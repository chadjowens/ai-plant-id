import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Leaf } from 'lucide-react';

interface PlantDetailsProps {
  isLoading: boolean;
  plantInfo: string | null;
}

export function PlantDetails({ isLoading, plantInfo }: PlantDetailsProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!plantInfo) {
    return null;
  }

  return (
    <div className="prose prose-emerald max-w-none">
      <div className="flex items-center gap-2 mb-4">
        <Leaf className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-gray-800 m-0">Plant Analysis Results</h2>
      </div>
      <ReactMarkdown>{plantInfo}</ReactMarkdown>
    </div>
  );
}