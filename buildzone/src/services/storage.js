import { supabase } from '../lib/supabase';

// ============ STORAGE SERVICE ============
export const storageService = {
  // Upload file to specific bucket
  uploadFile: async (bucket, filePath, file, options = {}) => {
    try {
      const { data, error } = await supabase?.storage?.from(bucket)?.upload(filePath, file, {
          cacheControl: '3600',
          upsert: options?.upsert || false,
          ...options
        })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Delete file from storage
  deleteFile: async (bucket, filePath) => {
    try {
      const { data, error } = await supabase?.storage?.from(bucket)?.remove([filePath])

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get public URL for file
  getPublicUrl: (bucket, filePath) => {
    const { data } = supabase?.storage?.from(bucket)?.getPublicUrl(filePath)
    
    return data?.publicUrl || null
  },

  // Get signed URL for private files
  getSignedUrl: async (bucket, filePath, expiresIn = 3600) => {
    try {
      const { data, error } = await supabase?.storage?.from(bucket)?.createSignedUrl(filePath, expiresIn)

      if (error) throw error
      return { data: data?.signedUrl || null, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // List files in a bucket/folder
  listFiles: async (bucket, folder = '', options = {}) => {
    try {
      const { data, error } = await supabase?.storage?.from(bucket)?.list(folder, {
          limit: options?.limit || 100,
          offset: options?.offset || 0,
          sortBy: options?.sortBy || { column: 'created_at', order: 'desc' }
        })

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  }
}

// ============ PRODUCT IMAGES ============
export const productImagesService = {
  // Upload product image
  upload: async (productId, file) => {
    try {
      const fileExt = file?.name?.split('.')?.pop()
      const fileName = `${productId}/${Date.now()}.${fileExt}`
      
      const { data, error } = await storageService?.uploadFile(
        'product-images',
        fileName,
        file,
        { upsert: true }
      )

      if (error) throw error

      // Get public URL
      const publicUrl = storageService?.getPublicUrl('product-images', fileName)
      
      return { data: { ...data, publicUrl }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Delete product image
  delete: async (filePath) => {
    return await storageService?.deleteFile('product-images', filePath);
  },

  // Get product images
  list: async (productId) => {
    return await storageService?.listFiles('product-images', productId);
  }
}

// ============ OFFER BANNERS ============
export const offerBannersService = {
  // Upload offer banner
  upload: async (offerId, file) => {
    try {
      const fileExt = file?.name?.split('.')?.pop()
      const fileName = `${offerId}/${Date.now()}.${fileExt}`
      
      const { data, error } = await storageService?.uploadFile(
        'offer-banners',
        fileName,
        file,
        { upsert: true }
      )

      if (error) throw error

      // Get public URL
      const publicUrl = storageService?.getPublicUrl('offer-banners', fileName)
      
      return { data: { ...data, publicUrl }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Delete offer banner
  delete: async (filePath) => {
    return await storageService?.deleteFile('offer-banners', filePath);
  },

  // Get offer banners
  list: async (offerId) => {
    return await storageService?.listFiles('offer-banners', offerId);
  }
}

// ============ KYC DOCUMENTS (Private) ============
export const kycDocumentsService = {
  // Upload KYC document
  upload: async (userId, documentType, file) => {
    try {
      const fileExt = file?.name?.split('.')?.pop()
      const fileName = `${userId}/${documentType}_${Date.now()}.${fileExt}`
      
      const { data, error } = await storageService?.uploadFile(
        'kyc-documents',
        fileName,
        file,
        { upsert: true }
      )

      if (error) throw error
      
      return { data: { ...data, fileName }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get signed URL for KYC document
  getSignedUrl: async (filePath, expiresIn = 3600) => {
    return await storageService?.getSignedUrl('kyc-documents', filePath, expiresIn);
  },

  // Delete KYC document
  delete: async (filePath) => {
    return await storageService?.deleteFile('kyc-documents', filePath);
  },

  // List user's KYC documents
  list: async (userId) => {
    return await storageService?.listFiles('kyc-documents', userId);
  }
}

// ============ HELPER FUNCTIONS ============
export const storageHelpers = {
  // Validate file type
  validateFileType: (file, allowedTypes) => {
    if (!file?.type) return false
    return allowedTypes?.includes(file?.type);
  },

  // Validate file size (size in bytes)
  validateFileSize: (file, maxSize) => {
    if (!file?.size) return false
    return file?.size <= maxSize;
  },

  // Format file size for display
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  },

  // Get file extension
  getFileExtension: (filename) => {
    return filename?.split('.')?.pop()?.toLowerCase() || ''
  },

  // Generate unique filename
  generateUniqueFileName: (originalName, prefix = '') => {
    const timestamp = Date.now()
    const random = Math.random()?.toString(36)?.substring(2, 8)
    const extension = storageHelpers?.getFileExtension(originalName)
    
    return `${prefix}${timestamp}_${random}.${extension}`
  }
}

// ============ FILE UPLOAD HOOK ============
export const useFileUpload = () => {
  const uploadProductImage = async (productId, file) => {
    // Validate file
    if (!storageHelpers?.validateFileType(file, ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])) {
      return { data: null, error: new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.') }
    }

    if (!storageHelpers?.validateFileSize(file, 10 * 1024 * 1024)) { // 10MB
      return { data: null, error: new Error('File size too large. Maximum size is 10MB.') }
    }

    return await productImagesService?.upload(productId, file);
  }

  const uploadOfferBanner = async (offerId, file) => {
    // Validate file
    if (!storageHelpers?.validateFileType(file, ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])) {
      return { data: null, error: new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.') }
    }

    if (!storageHelpers?.validateFileSize(file, 5 * 1024 * 1024)) { // 5MB
      return { data: null, error: new Error('File size too large. Maximum size is 5MB.') }
    }

    return await offerBannersService?.upload(offerId, file);
  }

  const uploadKYCDocument = async (userId, documentType, file) => {
    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf']
    if (!storageHelpers?.validateFileType(file, allowedTypes)) {
      return { data: null, error: new Error('Invalid file type. Only JPEG, PNG, WebP, and PDF are allowed.') }
    }

    if (!storageHelpers?.validateFileSize(file, 20 * 1024 * 1024)) { // 20MB
      return { data: null, error: new Error('File size too large. Maximum size is 20MB.') }
    }

    return await kycDocumentsService?.upload(userId, documentType, file);
  }

  return {
    uploadProductImage,
    uploadOfferBanner,
    uploadKYCDocument,
    storageHelpers
  }
}