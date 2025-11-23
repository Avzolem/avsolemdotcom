'use client';

import { useState, useRef, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import Fuse from 'fuse.js';
import styles from './CardScanner.module.scss';

interface CardScannerProps {
  onScanComplete: (cardName: string) => void;
}

interface CardMatch {
  name: string;
  score: number;
}

type ScanMode = 'name' | 'setcode';

export default function CardScanner({ onScanComplete }: CardScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cardMatches, setCardMatches] = useState<CardMatch[]>([]);
  const [scanMode, setScanMode] = useState<ScanMode>('setcode');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Open camera stream
  const openCamera = async () => {
    console.log('🎥 openCamera called');
    try {
      setError('');

      // FIRST: Show the video container so videoRef.current exists
      setIsCameraOpen(true);
      console.log('🎥 Camera container opened, waiting for video element...');

      // Wait a bit for React to render the video element
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('🎥 Requesting camera access...');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      console.log('🎥 Camera access granted, stream obtained:', stream);

      if (videoRef.current) {
        console.log('🎥 Setting srcObject on video element');
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Wait for video to be ready and play
        videoRef.current.onloadedmetadata = () => {
          console.log('🎥 Video metadata loaded');
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              console.log('✅ Video playing successfully');
              // Wait a moment for video to stabilize, then mark as ready
              setTimeout(() => {
                setIsVideoReady(true);
                console.log('✅ Video ready for capture');
              }, 500);
            }).catch((err) => {
              console.error('❌ Error playing video:', err);
              setError('Error al iniciar la cámara. Intenta de nuevo.');
            });
          }
        };
      } else {
        console.error('❌ videoRef.current is still null after delay');
        setIsCameraOpen(false);
        setError('Error al inicializar el video. Intenta de nuevo.');
      }
    } catch (err) {
      console.error('❌ Error accessing camera:', err);
      setIsCameraOpen(false);
      setError('No se pudo acceder a la cámara. Por favor, permite el acceso a la cámara en tu navegador.');
    }
  };

  // Close camera stream
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
    setIsVideoReady(false);
    setCapturedImage(null);
  };

  // Capture photo from camera
  const capturePhoto = () => {
    console.log('📸 Capturing photo...');

    if (!videoRef.current || !canvasRef.current) {
      console.error('❌ Video or canvas ref is null');
      setError('Error al capturar la foto. Intenta de nuevo.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('❌ Could not get canvas context');
      setError('Error al inicializar el canvas.');
      return;
    }

    // Verify video has valid dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('❌ Video has no dimensions');
      setError('El video no está listo. Espera un momento e intenta de nuevo.');
      return;
    }

    console.log(`📸 Video dimensions: ${video.videoWidth}x${video.videoHeight}`);

    // Define crop area based on scan mode
    let cropX = 0, cropY = 0, cropWidth = 0, cropHeight = 0;

    if (scanMode === 'name') {
      // Top 30% of the image where card name is located
      cropWidth = video.videoWidth;
      cropHeight = Math.floor(video.videoHeight * 0.3);
      cropX = 0;
      cropY = 0;
      console.log(`📸 Cropping to: ${cropWidth}x${cropHeight} (top portion for card name)`);
    } else {
      // Bottom-right corner for set code (alphanumeric code like "LOB-EN001")
      // Set code is approximately in the bottom 15% and right 50% of the card
      cropWidth = Math.floor(video.videoWidth * 0.5);
      cropHeight = Math.floor(video.videoHeight * 0.15);
      cropX = video.videoWidth - cropWidth; // Start from right side
      cropY = video.videoHeight - cropHeight;
      console.log(`📸 Cropping to: ${cropWidth}x${cropHeight} (bottom-right for set code)`);
    }

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    // Draw only the cropped portion
    context.drawImage(
      video,
      cropX, cropY, cropWidth, cropHeight, // Source rectangle
      0, 0, canvas.width, canvas.height     // Destination rectangle
    );

    // Apply image preprocessing for better OCR
    // Use willReadFrequently for better performance
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height, { willReadFrequently: true } as any);
    preprocessImage(imageData);
    context.putImageData(imageData, 0, 0);

    // Get processed image as data URL
    const processedImage = canvas.toDataURL('image/jpeg', 0.95);
    console.log('📸 Image captured and preprocessed, length:', processedImage.length);

    setCapturedImage(processedImage);

    // Start OCR processing
    processImage(processedImage);
  };

  // Preprocess image for better OCR
  const preprocessImage = (imageData: ImageData) => {
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Convert to grayscale
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;

      // Increase contrast moderately (less aggressive)
      const contrast = 2.0;
      const brightness = 10;
      let adjusted = ((gray - 128) * contrast) + 128 + brightness;

      // Clamp values between 0-255
      adjusted = Math.max(0, Math.min(255, adjusted));

      data[i] = adjusted;     // R
      data[i + 1] = adjusted; // G
      data[i + 2] = adjusted; // B
      // Alpha channel (data[i + 3]) stays the same
    }

    console.log('🎨 Image preprocessed: grayscale + contrast enhanced');
  };

  // Search card by set code using YugiohPrices API
  const searchBySetCode = async (setCode: string): Promise<void> => {
    try {
      console.log('🔍 Searching by set code:', setCode);

      // Try YugiohPrices API first (has specific rarity pricing)
      const yugiohPricesResponse = await fetch(`https://yugiohprices.com/api/price_for_print_tag/${setCode}`);

      if (yugiohPricesResponse.ok) {
        const priceData = await yugiohPricesResponse.json();
        console.log('✅ Card found in YugiohPrices:', priceData);

        if (priceData.status === 'success' && priceData.data) {
          const cardName = priceData.data.name;
          console.log('✅ Card name from set code:', cardName);
          onScanComplete(cardName);
          closeCamera();
          return;
        }
      }

      // Fallback: Try YGOPRODeck API with set code search
      console.log('🔍 Trying YGOPRODeck API as fallback...');
      const ygoprodeckResponse = await fetch(`https://db.ygoprodeck.com/api/v7/cardsetsinfo.php?setcode=${setCode}`);

      if (ygoprodeckResponse.ok) {
        const data = await ygoprodeckResponse.json();
        console.log('✅ Card found in YGOPRODeck:', data);

        if (data && data.name) {
          console.log('✅ Card name from YGOPRODeck:', data.name);
          onScanComplete(data.name);
          closeCamera();
          return;
        }
      }

      setError('No se encontró ninguna carta con ese código. Verifica que el set code sea correcto.');
    } catch (error) {
      console.error('❌ Error searching by set code:', error);
      setError('Error al buscar la carta. Verifica tu conexión e intenta de nuevo.');
    }
  };

  // Process image with OCR
  const processImage = async (imageData: string) => {
    console.log('🔍 Starting OCR processing...');
    setIsScanning(true);
    setError('');
    setProgress(0);

    try {
      // Validate image data
      if (!imageData || imageData.length < 100) {
        throw new Error('Invalid image data');
      }

      console.log('🔍 Calling Tesseract.recognize...');

      // Configure OCR based on scan mode
      const ocrConfig = scanMode === 'setcode'
        ? {
            logger: (m: any) => {
              console.log('🔍 Tesseract status:', m.status, m.progress);
              if (m.status === 'recognizing text') {
                setProgress(Math.round(m.progress * 100));
              }
            },
            tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-', // Alphanumeric + dash for set code
          }
        : {
            logger: (m: any) => {
              console.log('🔍 Tesseract status:', m.status, m.progress);
              if (m.status === 'recognizing text') {
                setProgress(Math.round(m.progress * 100));
              }
            },
            tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-\' .',
          };

      const result = await Tesseract.recognize(
        imageData,
        'eng',
        ocrConfig
      );

      console.log('🔍 OCR completed, raw text:', result.data.text);

      const text = result.data.text.trim();

      if (!text) {
        const errorMsg = scanMode === 'setcode'
          ? 'No se detectó el set code. Asegúrate de que el código (ej: LOB-EN001) sea visible.'
          : 'No se detectó texto en la imagen. Intenta capturar una foto más clara del nombre de la carta.';
        setError(errorMsg);
        setIsScanning(false);
        return;
      }

      if (scanMode === 'setcode') {
        // Clean set code: extract alphanumeric and dash
        const setCode = text.replace(/[^A-Z0-9-]/gi, '').toUpperCase();
        console.log('🔍 Extracted set code:', setCode);

        if (setCode.length >= 5) {
          // Set codes are usually at least 5 characters (e.g., "SDK-1" or "LOB-001")
          console.log('✅ Using set code:', setCode);
          await searchBySetCode(setCode);
        } else {
          setError(`Set code incompleto detectado (${setCode.length} caracteres). Intenta de nuevo.`);
        }
      } else {
        // Name mode: use fuzzy matching
        const cleanedText = cleanCardName(text);
        console.log('🔍 Cleaned text:', cleanedText);

        if (cleanedText) {
          console.log('✅ Searching for matching cards...');

          // Find matching cards using fuzzy search
          const matches = await findMatchingCards(cleanedText);

          if (matches.length > 0) {
            console.log('✅ Found card matches, displaying options');
            setCardMatches(matches);
          } else {
            setError('No se encontraron cartas que coincidan. Intenta de nuevo con mejor iluminación.');
          }
        } else {
          setError('No se pudo identificar el nombre de la carta. Intenta de nuevo con mejor iluminación.');
        }
      }
    } catch (err) {
      console.error('❌ OCR Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error al procesar la imagen: ${errorMessage}. Verifica tu conexión e intenta de nuevo.`);
    } finally {
      setIsScanning(false);
    }
  };

  // Clean up extracted text to get card name
  const cleanCardName = (text: string): string => {
    console.log('🧹 Cleaning text:', text);

    // Remove common OCR artifacts and clean the text
    let cleaned = text
      .replace(/[^a-zA-Z0-9\s\-']/g, ' ') // Keep only alphanumeric, spaces, hyphens, apostrophes
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\b[a-zA-Z]\b/g, '') // Remove single letters (usually artifacts)
      .trim();

    // Take the first line (usually the card name)
    const lines = cleaned.split('\n');
    cleaned = lines[0] || cleaned;

    // Remove extra spaces again
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    // Require minimum length
    if (cleaned.length < 3) {
      console.log('🧹 Cleaned text too short, returning empty');
      return '';
    }

    // Limit to reasonable card name length
    if (cleaned.length > 50) {
      cleaned = cleaned.substring(0, 50).trim();
    }

    console.log('🧹 Final cleaned text:', cleaned);
    return cleaned;
  };

  // Fetch all card names from the API
  const fetchAllCardNames = async (): Promise<string[]> => {
    try {
      console.log('📥 Fetching all card names from API...');
      const response = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php');

      if (!response.ok) {
        throw new Error('Failed to fetch card data');
      }

      const data = await response.json();
      const cardNames = data.data.map((card: any) => card.name);
      console.log(`📥 Fetched ${cardNames.length} card names`);
      return cardNames;
    } catch (error) {
      console.error('❌ Error fetching card names:', error);
      throw error;
    }
  };

  // Find matching cards using fuzzy search
  const findMatchingCards = async (ocrText: string): Promise<CardMatch[]> => {
    try {
      console.log('🔍 Finding matches for:', ocrText);

      // Fetch all card names
      const cardNames = await fetchAllCardNames();

      // Configure Fuse.js for fuzzy matching
      const fuse = new Fuse(cardNames, {
        threshold: 0.4, // 0 = perfect match, 1 = match anything
        distance: 100, // Maximum distance for character differences
        minMatchCharLength: 3,
        ignoreLocation: true,
      });

      // Search for matches
      const results = fuse.search(ocrText);
      console.log(`🔍 Found ${results.length} potential matches`);

      // Return top 5 matches with their scores
      const matches = results.slice(0, 5).map(result => ({
        name: result.item,
        score: 1 - result.score! // Convert to similarity score (higher is better)
      }));

      console.log('🔍 Top matches:', matches);
      return matches;
    } catch (error) {
      console.error('❌ Error finding matches:', error);
      throw error;
    }
  };

  // Handle card selection from matches
  const handleCardSelection = (cardName: string) => {
    console.log('✅ User selected card:', cardName);
    onScanComplete(cardName);
    closeCamera();
    setCardMatches([]);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);
      processImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.scanner}>
      {/* Mode Selector */}
      {!isCameraOpen && !isScanning && (
        <div className={styles.modeSelector}>
          <p className={styles.modeLabel}>Modo de Escaneo:</p>
          <div className={styles.modeButtons}>
            <button
              onClick={() => setScanMode('setcode')}
              className={`${styles.modeButton} ${scanMode === 'setcode' ? styles.modeButtonActive : ''}`}
            >
              🏷️ Set Code (Recomendado)
            </button>
            <button
              onClick={() => setScanMode('name')}
              className={`${styles.modeButton} ${scanMode === 'name' ? styles.modeButtonActive : ''}`}
            >
              📝 Nombre
            </button>
          </div>
          <p className={styles.modeHint}>
            {scanMode === 'setcode'
              ? '💡 Escanea el código en la esquina inferior derecha (ej: LOB-EN001)'
              : '💡 Escanea el nombre en la parte superior de la carta'}
          </p>
        </div>
      )}

      <div className={styles.controls}>
        {!isCameraOpen && !isScanning && (
          <>
            <button
              onClick={openCamera}
              className={styles.primaryButton}
            >
              📸 Abrir Cámara
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={styles.secondaryButton}
            >
              🖼️ Subir Imagen
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </>
        )}

        {isCameraOpen && !isScanning && !capturedImage && (
          <>
            <button
              onClick={capturePhoto}
              disabled={!isVideoReady}
              className={styles.captureButton}
              style={{ opacity: isVideoReady ? 1 : 0.5, cursor: isVideoReady ? 'pointer' : 'not-allowed' }}
            >
              {isVideoReady ? '📷 Capturar' : '⏳ Cargando...'}
            </button>
            <button
              onClick={closeCamera}
              className={styles.cancelButton}
            >
              ✕ Cerrar
            </button>
          </>
        )}

        {capturedImage && isScanning && (
          <div className={styles.processingInfo}>
            <p>Procesando imagen... {progress}%</p>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Camera Preview */}
      {isCameraOpen && !capturedImage && (
        <div className={styles.cameraContainer}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={styles.video}
          />
          <div className={styles.overlay}>
            <div
              className={`${styles.frame} ${scanMode === 'setcode' ? styles.frameSetCode : styles.frameName}`}
            />
            <p className={styles.hint}>
              {scanMode === 'setcode'
                ? 'Centra el set code en el recuadro (ej: LOB-EN001)'
                : 'Centra el nombre de la carta en el recuadro'}
            </p>
          </div>
        </div>
      )}

      {/* Captured Image Preview */}
      {capturedImage && (
        <div className={styles.preview}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={capturedImage} alt="Captured" className={styles.previewImage} />
        </div>
      )}

      {/* Card Matches */}
      {cardMatches.length > 0 && !isScanning && (
        <div className={styles.matchesSection}>
          <h4 className={styles.matchesTitle}>🎯 Selecciona la carta correcta:</h4>
          <div className={styles.matchesList}>
            {cardMatches.map((match, index) => (
              <button
                key={index}
                onClick={() => handleCardSelection(match.name)}
                className={styles.matchButton}
              >
                <span className={styles.matchRank}>#{index + 1}</span>
                <span className={styles.matchName}>{match.name}</span>
                <span className={styles.matchScore}>
                  {Math.round(match.score * 100)}% coincidencia
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setCapturedImage(null);
              setCardMatches([]);
              setError('');
            }}
            className={styles.retryButton}
          >
            🔄 Intentar de Nuevo
          </button>
        </div>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Error Message */}
      {error && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          <p>{error}</p>
          {capturedImage && (
            <button
              onClick={() => {
                setCapturedImage(null);
                setError('');
              }}
              className={styles.retryButton}
            >
              🔄 Intentar de Nuevo
            </button>
          )}
        </div>
      )}

      {/* Instructions */}
      {!isCameraOpen && !isScanning && !error && (
        <div className={styles.instructions}>
          <h4>📋 Instrucciones:</h4>
          <ul>
            <li>Asegúrate de tener buena iluminación</li>
            <li>Centra el nombre de la carta en la cámara</li>
            <li>Mantén la carta lo más plana posible</li>
            <li>Evita reflejos y sombras sobre el texto</li>
          </ul>
        </div>
      )}
    </div>
  );
}
