'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface UploadResult {
  mediaUrl: string;
  cloudinaryPublicId: string;
  thumbnailUrl?: string;
}

interface ImageUploaderProps {
  value?: string;
  onChange: (result: UploadResult | null) => void;
  folder?: string;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = 'high_school_youth_club',
  className,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setError(null);
      setUploading(true);
      setProgress(0);

      // Local preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      try {
        // Step 1: Request signed upload params from backend
        const sigRes = await apiClient.post<{
          success: boolean;
          data: {
            signature: string;
            timestamp: number;
            apiKey: string;
            cloudName: string;
            folder: string;
          };
        }>('/uploads/signature', { folder });

        const { signature, timestamp, apiKey, cloudName, folder: targetFolder } = sigRes.data.data;

        if (!cloudName || cloudName === 'placeholder' || !apiKey || apiKey === 'placeholder') {
          throw new Error('Cloudinary environment variables are missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env.');
        }

        // Step 2: Upload directly to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', String(timestamp));
        formData.append('signature', signature);
        formData.append('folder', targetFolder);

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const uploadRes = await axios.post<{
          secure_url: string;
          public_id: string;
          thumbnail_url?: string;
        }>(cloudinaryUrl, formData, {
          onUploadProgress: (evt) => {
            if (evt.total) {
              setProgress(Math.round((evt.loaded * 100) / evt.total));
            }
          },
        });

        const result: UploadResult = {
          mediaUrl: uploadRes.data.secure_url,
          cloudinaryPublicId: uploadRes.data.public_id,
          thumbnailUrl: uploadRes.data.thumbnail_url || uploadRes.data.secure_url,
        };

        setPreview(result.mediaUrl);
        onChange(result);
      } catch (err: any) {
        setError(err.message || 'Failed to upload image. Please check Cloudinary configuration.');
        setPreview(null);
        onChange(null);
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: (fileRejections) => {
      const rej = fileRejections[0];
      if (rej?.errors.some((e) => e.code === 'file-too-large')) {
        setError('File size exceeds the 5MB limit. Please choose a smaller image.');
      } else {
        setError('Invalid file. Only JPG, PNG, and WebP images up to 5MB are allowed.');
      }
    },
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxSize: 5 * 1024 * 1024, // 5MB max
    maxFiles: 1,
    disabled: uploading,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {preview ? (
        <div className="relative rounded-xl border border-border overflow-hidden bg-muted/30 aspect-video max-w-md group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Upload Preview"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemove}
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90 hover:opacity-100 shadow-md"
          >
            <X className="h-4 w-4" />
          </Button>
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
              <span className="text-xs font-semibold">{progress}%</span>
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-red-500 bg-red-500/5'
              : 'border-border/80 hover:border-red-500/50 hover:bg-muted/30',
            uploading && 'pointer-events-none opacity-60'
          )}
        >
          <input {...getInputProps()} />
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-red-600" />
            ) : (
              <UploadCloud className="h-5 w-5" />
            )}
          </div>
          <p className="text-xs font-semibold text-foreground">
            {uploading
              ? `Uploading... ${progress}%`
              : isDragActive
              ? 'Drop image here'
              : 'Click to upload or drag & drop'}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            PNG, JPG, WEBP up to 10MB
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
