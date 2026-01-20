'use client';

import { useState, useEffect, DragEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { uploadInvoice, cacheInvoice } from '@/lib/api';
import { Upload, File, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function UploadPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setUploadStatus('error');
      setMessage('Invalid file type. Please upload PDF or image files (PNG, JPG, JPEG).');
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadStatus('error');
      setMessage('File is too large. Maximum size is 10MB.');
      return;
    }

    setFile(selectedFile);
    setUploadStatus('idle');
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadStatus('idle');
    setMessage('');

    try {
      const response = await uploadInvoice(file);
      
      // Cache the invoice locally
      cacheInvoice(response.invoice);
      
      setUploadStatus('success');
      setMessage(`Invoice uploaded successfully! ID: ${response.invoice_id}`);
      
      // Redirect to invoice details after 2 seconds
      setTimeout(() => {
        router.push(`/invoice/${response.invoice_id}`);
      }, 2000);
    } catch (error) {
      setUploadStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to upload invoice');
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadStatus('idle');
    setMessage('');
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Invoice</h1>
        <p className="text-muted-foreground">
          Upload an invoice document to extract information automatically
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select File</CardTitle>
          <CardDescription>
            Supported formats: PDF, PNG, JPG, JPEG (max 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleChange}
              accept=".pdf,.png,.jpg,.jpeg"
              disabled={uploading}
            />

            {!file ? (
              <div className="space-y-4">
                <div className="rounded-full bg-primary/10 p-4 w-fit mx-auto">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium mb-2">
                    Drag and drop your invoice here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">or</p>
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-full bg-primary/10 p-4 w-fit mx-auto">
                  <File className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="min-w-[120px]"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={resetUpload}
                    variant="outline"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {uploadStatus === 'success' && (
            <div className="mt-6 rounded-md bg-green-50 border border-green-200 p-4 flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Success!</p>
                <p className="text-sm text-green-700 mt-1">{message}</p>
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="mt-6 rounded-md bg-red-50 border border-red-200 p-4 flex items-start space-x-3">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-1">{message}</p>
              </div>
            </div>
          )}

          {uploading && (
            <div className="mt-6">
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Processing invoice...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Select an invoice file (PDF or image format)</li>
            <li>The system will automatically extract invoice details</li>
            <li>Review and edit the extracted information if needed</li>
            <li>The invoice will be saved and available in your invoices list</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
