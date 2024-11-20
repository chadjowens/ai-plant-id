import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Leaf } from 'lucide-react';

interface DropZoneProps {
  onImageDrop: (file: File) => void;
  onAnalyze: () => void;
  hasImage: boolean;
}

export function DropZone({ onImageDrop, onAnalyze, hasImage }: DropZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageDrop(acceptedFiles[0]);
    }
  }, [onImageDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`w-full p-8 border-2 border-dashed rounded-xl transition-colors duration-200 ease-in-out cursor-pointer
          ${isDragActive 
            ? 'border-emerald-400 bg-emerald-50' 
            : 'border-gray-300 hover:border-emerald-300 bg-gray-50 hover:bg-gray-100'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className="w-12 h-12 text-gray-400" />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">
              {isDragActive ? 'Drop your image here' : 'Drag & drop a plant image'}
            </p>
            <p className="text-sm text-gray-500">or click to select a file</p>
          </div>
        </div>
      </div>
      {hasImage && (
        <button
          onClick={onAnalyze}
          className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Leaf className="w-5 h-5" />
          Analyze Plant
        </button>
      )}
    </div>
  );
}