'use client';

import { useState, useRef } from 'react';
import { useMagicLanguage } from '@/contexts/MagicLanguageContext';
import { MagicCard } from '@/types/magic';
import Tesseract from 'tesseract.js';
import Image from 'next/image';
import styles from './CardScanner.module.scss';

interface CardScannerProps {
  onScanComplete: (cardName: string) => void;
}

interface CardMatch {
  name: string;
  id: string;
  imageSmall: string;
  score: number;
}

export default function CardScanner({ onScanComplete }: CardScannerProps) {
  const { t } = useMagicLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cardMatches, setCardMatches] = useState<CardMatch[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Open camera stream
  const openCamera = async () => {
    try {
      setError('');

      // Show the video container so videoRef.current exists
      setIsCameraOpen(true);

      // Wait for React to render the video element
      await new Promise(resolve => setTimeout(resolve, 100));

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              setTimeout(() => {
                setIsVideoReady(true);
              }, 500);
            }).catch(() => {
              setError(t('scanner.error.camera'));
            });
          }
        };
      } else {
        setIsCameraOpen(false);
        setError(t('scanner.error.camera'));
      }
    } catch {
      setIsCameraOpen(false);
      setError(t('scanner.error.camera'));
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
    if (!videoRef.current || !canvasRef.current) {
      setError(t('scanner.error.capture'));
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (!context) {
      setError(t('scanner.error.capture'));
      return;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError(t('scanner.error.capture'));
      return;
    }

    // Top 30% of the image where card name is located
    const cropWidth = video.videoWidth;
    const cropHeight = Math.floor(video.videoHeight * 0.3);
    const cropX = 0;
    const cropY = 0;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    // Draw only the cropped portion
    context.drawImage(
      video,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, canvas.width, canvas.height
    );

    // Apply image preprocessing for better OCR
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    preprocessImage(imageData);
    context.putImageData(imageData, 0, 0);

    // Get processed image as data URL
    const processedImage = canvas.toDataURL('image/jpeg', 0.95);

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

      // Increase contrast moderately
      const contrast = 2.0;
      const brightness = 10;
      let adjusted = ((gray - 128) * contrast) + 128 + brightness;

      // Clamp values between 0-255
      adjusted = Math.max(0, Math.min(255, adjusted));

      data[i] = adjusted;
      data[i + 1] = adjusted;
      data[i + 2] = adjusted;
    }
  };

  // Search card by name using Scryfall API via our backend
  const searchByName = async (text: string): Promise<CardMatch[]> => {
    try {
      const response = await fetch(`/api/magic/search?q=${encodeURIComponent(text)}&limit=10`);

      if (!response.ok) {
        return [];
      }

      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        return [];
      }

      // Deduplicate by card name and return with fuzzy score
      const seen = new Set<string>();
      const matches: CardMatch[] = [];

      for (const card of data.data as MagicCard[]) {
        if (!seen.has(card.name)) {
          seen.add(card.name);
          // Calculate a simple similarity score
          const nameLower = card.name.toLowerCase();
          const textLower = text.toLowerCase();
          const score = textLower.length / nameLower.length;
          matches.push({
            name: card.name,
            id: card.id,
            imageSmall: card.images.small,
            score: Math.min(score, 1),
          });
        }
        if (matches.length >= 5) break;
      }

      return matches;
    } catch {
      return [];
    }
  };

  // Process image with OCR
  const processImage = async (imageData: string) => {
    setIsScanning(true);
    setError('');
    setProgress(0);

    try {
      // Validate image data
      if (!imageData || imageData.length < 100) {
        throw new Error('Invalid image data');
      }

      const result = await Tesseract.recognize(
        imageData,
        'eng',
        {
          logger: (m: any) => { // eslint-disable-line
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          },
        }
      );

      const text = result.data.text.trim();

      if (!text) {
        setError(t('scanner.error.noText'));
        setIsScanning(false);
        return;
      }

      // Clean text and search via Scryfall
      const cleanedText = cleanCardName(text);

      if (cleanedText) {
        const matches = await searchByName(cleanedText);

        if (matches.length > 0) {
          setCardMatches(matches);
        } else {
          setError(t('scanner.error.noMatch'));
        }
      } else {
        setError(t('scanner.error.noText'));
      }
    } catch {
      setError(t('scanner.error.process'));
    } finally {
      setIsScanning(false);
    }
  };

  // Clean up extracted text to get card name
  const cleanCardName = (text: string): string => {
    let cleaned = text
      .replace(/[^a-zA-Z0-9\s\-',]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\b[a-zA-Z]\b/g, '')
      .trim();

    const lines = cleaned.split('\n');
    cleaned = lines[0] || cleaned;

    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    if (cleaned.length < 3) {
      return '';
    }

    if (cleaned.length > 50) {
      cleaned = cleaned.substring(0, 50).trim();
    }

    return cleaned;
  };

  // Handle card selection from matches
  const handleCardSelection = (cardName: string) => {
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
      const imgData = e.target?.result as string;
      setCapturedImage(imgData);
      processImage(imgData);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.scanner}>
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
            <div className={styles.frame} />
            <p className={styles.hint}>
              {t('scanner.hint.name')}
            </p>
          </div>
        </div>
      )}

      <div className={styles.controls}>
        {!isCameraOpen && !isScanning && (
          <>
            <button
              onClick={openCamera}
              className={styles.primaryButton}
            >
              {'\uD83D\uDCF8'} {t('scanner.button.start')}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={styles.secondaryButton}
            >
              {'\uD83D\uDDBC\uFE0F'} {t('scanner.button.upload')}
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
              {isVideoReady ? `\uD83D\uDCF7 ${t('scanner.button.capture')}` : `\u23F3 ${t('scanner.loading')}`}
            </button>
            <button
              onClick={closeCamera}
              className={styles.cancelButton}
            >
              {'\u2715'} {t('scanner.button.cancel')}
            </button>
          </>
        )}

        {capturedImage && isScanning && (
          <div className={styles.processingInfo}>
            <p>{t('scanner.processing')} {progress}%</p>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

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
          <h4 className={styles.matchesTitle}>{t('scanner.matches.title')}</h4>
          <div className={styles.matchesList}>
            {cardMatches.map((match, index) => (
              <button
                key={match.id}
                onClick={() => handleCardSelection(match.name)}
                className={styles.matchButton}
              >
                <span className={styles.matchImageWrapper}>
                  <Image
                    src={match.imageSmall}
                    alt={match.name}
                    width={40}
                    height={56}
                    className={styles.matchImage}
                    unoptimized
                  />
                </span>
                <span className={styles.matchRank}>#{index + 1}</span>
                <span className={styles.matchName}>{match.name}</span>
                <span className={styles.matchScore}>
                  {t('scanner.matches.score', { score: Math.round(match.score * 100) })}
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
            {'\uD83D\uDD04'} {t('scanner.button.retry')}
          </button>
        </div>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Error Message */}
      {error && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>{'\u26A0\uFE0F'}</span>
          <p>{error}</p>
          {capturedImage && (
            <button
              onClick={() => {
                setCapturedImage(null);
                setError('');
              }}
              className={styles.retryButton}
            >
              {'\uD83D\uDD04'} {t('scanner.button.retry')}
            </button>
          )}
        </div>
      )}

      {/* Instructions */}
      {!isCameraOpen && !isScanning && !error && (
        <div className={styles.instructions}>
          <h4>{t('scanner.instructions.title')}</h4>
          <ul>
            <li>{t('scanner.instructions.name.1')}</li>
            <li>{t('scanner.instructions.name.2')}</li>
            <li>{t('scanner.instructions.name.3')}</li>
            <li>{t('scanner.instructions.name.4')}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
