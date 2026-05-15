import supabase from '../lib/supabase';
import apiClient from '../lib/api-config.js';

// Generate a unique file name
const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 10);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomStr}.${extension}`;
};

// Upload video directly to Supabase from the browser
export const uploadVideoToStorage = async (userId, file) => {
  try {
    console.log('📹 Uploading video to Supabase...', { userId, fileName: file.name, fileSize: file.size });
    const fileName = generateUniqueFileName(file.name);
    const filePath = `user-${userId}/${fileName}`;
    
    console.log('File path:', filePath);
    console.log('Bucket: videos');
    
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('❌ Supabase upload error details:', {
        message: error.message,
        statusCode: error.statusCode,
        name: error.name
      });
      throw error;
    }
    
    console.log('✅ Upload success, data:', data);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);
    
    console.log('✅ Video uploaded successfully:', { url: urlData.publicUrl, path: filePath });
    
    return { 
      url: urlData.publicUrl,
      storagePath: filePath
    };
  } catch (error) {
    // Better error logging
    console.error('❌ Error uploading video to Supabase:');
    console.error('  - Message:', error.message);
    console.error('  - Status:', error.statusCode);
    console.error('  - Name:', error.name);
    console.error('  - Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    throw error;
  }
};

// ✅ ADD THIS FUNCTION - Upload thumbnail to Supabase
export const uploadThumbnailToStorage = async (userId, file) => {
  try {
    console.log('🖼️ Uploading thumbnail to Supabase...', { userId, fileName: file.name });
    const fileName = generateUniqueFileName(file.name);
    const filePath = `user-${userId}/${fileName}`;
    
    console.log('Thumbnail file path:', filePath);
    console.log('Bucket: thumbnails');
    
    const { data, error } = await supabase.storage
      .from('thumbnails')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('❌ Supabase thumbnail upload error:', {
        message: error.message,
        statusCode: error.statusCode,
        name: error.name
      });
      throw error;
    }
    
    console.log('✅ Thumbnail upload success, data:', data);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(filePath);
    
    console.log('✅ Thumbnail uploaded successfully:', { url: urlData.publicUrl, path: filePath });
    
    return { 
      url: urlData.publicUrl,
      storagePath: filePath
    };
  } catch (error) {
    console.error('❌ Error uploading thumbnail to Supabase:');
    console.error('  - Message:', error.message);
    console.error('  - Status:', error.statusCode);
    console.error('  - Name:', error.name);
    throw error;
  }
};

// Create video with direct upload to Supabase
export const createVideo = async (videoData) => {
  try {
    console.log('📤 Sending to backend:', videoData);
    // ✅ Using /metadata endpoint (JSON only, no file upload)
    const response = await apiClient.post('/videos/metadata', videoData);
    console.log('✅ Backend response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating video:', error);
    console.error('❌ Error response:', error.response?.data);
    throw error;
  }
};