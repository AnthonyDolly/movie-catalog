import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;

    if (file) {
      this.validateFile(file);
    }

    return next.handle();
  }

  private validateFile(file: Express.Multer.File): void {
    // Validate file type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Only JPEG, JPG, and PNG files are allowed. Received: ${file.mimetype}`
      );
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size too large. Maximum allowed size is ${this.maxFileSize / (1024 * 1024)}MB. Received: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
      );
    }

    // Validate file name extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = file.originalname.toLowerCase().split('.').pop();
    if (!allowedExtensions.includes(`.${fileExtension}`)) {
      throw new BadRequestException(
        `Invalid file extension. Only .jpg, .jpeg, and .png files are allowed. Received: .${fileExtension}`
      );
    }

    // Additional security: Check if file is actually an image by checking magic bytes
    this.validateImageMagicBytes(file.buffer);
  }

  private validateImageMagicBytes(buffer: Buffer): void {
    if (!buffer || buffer.length < 8) {
      throw new BadRequestException('Invalid file: File appears to be corrupted');
    }

    // Check magic bytes for common image formats
    const magicBytes = buffer.subarray(0, 8);
    
    // JPEG magic bytes: FF D8 FF
    if (magicBytes[0] === 0xFF && magicBytes[1] === 0xD8 && magicBytes[2] === 0xFF) {
      return; // Valid JPEG
    }
    
    // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    if (magicBytes[0] === 0x89 && magicBytes[1] === 0x50 && 
        magicBytes[2] === 0x4E && magicBytes[3] === 0x47) {
      return; // Valid PNG
    }

    throw new BadRequestException(
      'Invalid file: File does not appear to be a valid image file'
    );
  }
} 