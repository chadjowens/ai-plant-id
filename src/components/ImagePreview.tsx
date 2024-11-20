import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string;
  onClear: () => void;
}

export function ImagePreview({ imageUrl, onClear }: ImagePreviewProps) {
  return (
    <div className="relative">
      <button
        onClick={onClear}
        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>
      <img
        src={imageUrl}
        alt="Plant preview"
        className="w-full h-auto rounded-lg shadow-lg"
      />
    </div>
  );
}