import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { storage } from "@/lib/firebase";

export interface UploadResult {
  url: string;
  path: string;
  name: string;
  size: number;
}

export class StorageService {
  // Upload file to Firebase Storage
  async uploadFile(file: File, path: string): Promise<UploadResult> {
    const storageRef = ref(storage, path);
    
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadURL,
        path: snapshot.ref.fullPath,
        name: file.name,
        size: file.size
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  // Upload user profile image
  async uploadProfileImage(file: File, userId: string): Promise<UploadResult> {
    const timestamp = Date.now();
    const path = `users/${userId}/profile/${timestamp}_${file.name}`;
    return this.uploadFile(file, path);
  }

  // Upload migraine report images
  async uploadMigrainImage(file: File, userId: string, migrainId: string): Promise<UploadResult> {
    const timestamp = Date.now();
    const path = `users/${userId}/migraines/${migrainId}/${timestamp}_${file.name}`;
    return this.uploadFile(file, path);
  }

  // Delete file from Firebase Storage
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    
    try {
      await deleteObject(storageRef);
      console.log('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  // Get download URL for a file
  async getDownloadURL(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    
    try {
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw new Error('Failed to get file URL');
    }
  }

  // List files in a directory
  async listFiles(path: string): Promise<string[]> {
    const storageRef = ref(storage, path);
    
    try {
      const result = await listAll(storageRef);
      return result.items.map(item => item.fullPath);
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error('Failed to list files');
    }
  }

  // Validate file type and size
  validateFile(file: File, allowedTypes: string[], maxSizeMB: number = 5): boolean {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum ${maxSizeMB}MB`);
    }

    return true;
  }
}

export const storageService = new StorageService();