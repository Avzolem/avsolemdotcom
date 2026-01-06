import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// Helper to generate signed upload params
export function generateSignedUploadParams(folder: string = 'cloud_storage') {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const uploadFolder = process.env.CLOUDINARY_FOLDER || folder;

  const paramsToSign = {
    timestamp,
    folder: uploadFolder,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder: uploadFolder,
  };
}

// Generate signed URL for video streaming
export function generateSignedStreamUrl(
  publicId: string,
  options: {
    resourceType?: 'video' | 'image' | 'raw';
    format?: string;
    expiresIn?: number; // seconds
  } = {}
): string {
  const {
    resourceType = 'video',
    format = 'mp4',
  } = options;

  // Use public URL (videos are uploaded as 'upload' type by default)
  return cloudinary.url(publicId, {
    resource_type: resourceType,
    type: 'upload',
    format,
    secure: true,
  });
}

// Generate HLS streaming URL
export function generateHlsStreamUrl(
  publicId: string,
  expiresIn: number = 900
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

  return cloudinary.url(publicId, {
    resource_type: 'video',
    type: 'authenticated',
    format: 'm3u8',
    streaming_profile: 'auto',
    sign_url: true,
    secure: true,
    expires_at: expiresAt,
  });
}

// Generate thumbnail URL
export function generateThumbnailUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
  } = {}
): string {
  const { width = 400, height = 225, crop = 'fill' } = options;

  return cloudinary.url(publicId, {
    resource_type: 'video',
    format: 'jpg',
    transformation: [
      { width, height, crop },
      { quality: 'auto' },
    ],
  });
}

// Delete a file from Cloudinary
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'video' | 'image' | 'raw' = 'video'
): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}

// Get resource info from Cloudinary
export async function getResourceInfo(
  publicId: string,
  resourceType: 'video' | 'image' | 'raw' = 'video'
) {
  try {
    return await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error('Error getting resource info:', error);
    return null;
  }
}
