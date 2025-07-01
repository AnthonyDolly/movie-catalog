import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly s3Client: S3Client;
  private readonly uploadDir = 'uploads/posters';
  private readonly allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor() {
    // Initialize S3 client for production
    if (process.env.NODE_ENV === 'production') {
      const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
      const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
      
      if (!awsAccessKeyId || !awsSecretAccessKey) {
        throw new Error('AWS credentials are required for production environment');
      }
      
      this.s3Client = new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: awsAccessKeyId,
          secretAccessKey: awsSecretAccessKey,
        },
      });
    }

    // Create upload directory for development
    if (process.env.NODE_ENV === 'development') {
      this.ensureUploadDirectory();
    }
  }

  /**
   * Upload a poster image
   */
  async uploadPoster(file: Express.Multer.File): Promise<string> {
    this.validateFile(file);

    const fileName = this.generateFileName(file.originalname);

    if (process.env.NODE_ENV === 'production') {
      return await this.uploadToS3(file, fileName);
    } else {
      return await this.uploadToLocal(file, fileName);
    }
  }

  /**
   * Delete a poster image
   */
  async deletePoster(posterUrl: string): Promise<void> {
    if (!posterUrl) return;

    try {
      if (process.env.NODE_ENV === 'production') {
        await this.deleteFromS3(posterUrl);
      } else {
        await this.deleteFromLocal(posterUrl);
      }
      this.logger.log(`Deleted poster: ${posterUrl}`);
    } catch (error) {
      this.logger.error(`Failed to delete poster: ${posterUrl}`, error);
      // Don't throw error - deletion failure shouldn't stop the main operation
    }
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Only ${this.allowedMimeTypes.join(', ')} are allowed`
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size too large. Maximum size is ${this.maxFileSize / (1024 * 1024)}MB`
      );
    }
  }

  /**
   * Generate unique filename
   */
  private generateFileName(originalName: string): string {
    const ext = path.extname(originalName).toLowerCase();
    const uuid = uuidv4();
    return `poster-${uuid}${ext}`;
  }

  /**
   * Upload to S3 (production)
   */
  private async uploadToS3(file: Express.Multer.File, fileName: string): Promise<string> {
    try {
      const bucketName = process.env.AWS_S3_BUCKET;
      if (!bucketName) {
        throw new Error('AWS_S3_BUCKET environment variable is not set');
      }

      const key = `posters/${fileName}`;
      
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
        CacheControl: 'max-age=31536000', // 1 year cache
      });

      await this.s3Client.send(command);
      
      const url = `https://${bucketName}.s3.amazonaws.com/${key}`;
      this.logger.log(`Uploaded to S3: ${url}`);
      return url;
    } catch (error) {
      this.logger.error('S3 upload failed:', error);
      throw new BadRequestException('Failed to upload image to cloud storage');
    }
  }

  /**
   * Upload to local storage (development)
   */
  private async uploadToLocal(file: Express.Multer.File, fileName: string): Promise<string> {
    try {
      const filePath = path.join(this.uploadDir, fileName);
      
      await fs.promises.writeFile(filePath, file.buffer);
      
      const url = `/uploads/posters/${fileName}`;
      this.logger.log(`Uploaded locally: ${url}`);
      return url;
    } catch (error) {
      this.logger.error('Local upload failed:', error);
      throw new BadRequestException('Failed to upload image to local storage');
    }
  }

  /**
   * Delete from S3
   */
  private async deleteFromS3(posterUrl: string): Promise<void> {
    const bucketName = process.env.AWS_S3_BUCKET;
    // Extract key from URL: https://bucket.s3.amazonaws.com/posters/file.jpg -> posters/file.jpg
    const key = posterUrl.split('.amazonaws.com/')[1];
    
    if (key) {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      
      await this.s3Client.send(command);
    }
  }

  /**
   * Delete from local storage
   */
  private async deleteFromLocal(posterUrl: string): Promise<void> {
    // Extract filename from URL: /uploads/posters/file.jpg -> file.jpg
    const fileName = posterUrl.split('/').pop();
    if (fileName) {
      const filePath = path.join(this.uploadDir, fileName);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    }
  }

  /**
   * Ensure upload directory exists
   */
  private ensureUploadDirectory(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`Created upload directory: ${this.uploadDir}`);
    }
  }

  /**
   * Get file extension from mimetype
   */
  private getFileExtension(mimetype: string): string {
    const mimeToExt = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
    };
    return mimeToExt[mimetype] || '.jpg';
  }
} 