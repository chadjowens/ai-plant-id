import React, { useState } from 'react';
import OpenAI from 'openai';
import { DropZone } from './components/DropZone';
import { ImagePreview } from './components/ImagePreview';
import { PlantDetails } from './components/PlantDetails';
import { Sprout, AlertCircle, RefreshCw, Leaf } from 'lucide-react';

// Initialize OpenAI client with proper error handling
const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error(
      'Please add your OpenAI API key to the .env file as VITE_OPENAI_API_KEY'
    );
  }
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [plantData, setPlantData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openAIClient, setOpenAIClient] = useState<OpenAI | null>(null);

  // Initialize OpenAI client on component mount
  React.useEffect(() => {
    try {
      const client = getOpenAIClient();
      setOpenAIClient(client);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize OpenAI client');
    }
  }, []);

  const analyzeImage = async (base64Image: string) => {
    if (!openAIClient) {
      setError('OpenAI client is not initialized');
      setIsAnalyzing(false);
      return;
    }

    try {
      const response = await openAIClient.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this plant image and provide detailed information in markdown format. Include: scientific name, common name, identification confidence, description, characteristics (height, leaf type, color, growing zone), and care requirements (light, water, soil pH). Format it with proper markdown headings and lists."
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      });

      const result = response.choices[0]?.message?.content;
      if (result) {
        setPlantData(result);
      } else {
        throw new Error("No analysis results received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze image");
      console.error("Error analyzing image:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageDrop = (file: File) => {
    setError(null);
    setSelectedFile(file);
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const base64Image = e.target.result.toString();
        await analyzeImage(base64Image);
      }
    };
    reader.onerror = () => {
      setError("Failed to read image file");
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  const resetAll = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setSelectedFile(null);
    setPlantData(null);
    setError(null);
    setIsAnalyzing(false);
  };

  // Show API key error message if initialization failed
  if (error && !openAIClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Configuration Error</h2>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              1. Create a <code className="bg-gray-200 px-1 py-0.5 rounded">.env</code> file in your project root<br />
              2. Add your OpenAI API key:<br />
              <code className="bg-gray-200 px-1 py-0.5 rounded">VITE_OPENAI_API_KEY=your_api_key_here</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sprout className="w-12 h-12 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-800">Plant Identifier</h1>
          </div>
          <p className="text-lg text-gray-600">
            Upload a photo of any plant to identify it instantly
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {!selectedImage ? (
            <DropZone 
              onImageDrop={handleImageDrop}
              onAnalyze={handleAnalyze}
              hasImage={false}
            />
          ) : (
            <div className="space-y-8">
              <ImagePreview 
                imageUrl={selectedImage} 
                onClear={resetAll} 
              />
              {!plantData && (
                <button
                  onClick={handleAnalyze}
                  className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Leaf className="w-5 h-5" />
                  Analyze Plant
                </button>
              )}
              <PlantDetails 
                isLoading={isAnalyzing} 
                plantInfo={plantData}
              />
              {plantData && (
                <button
                  onClick={resetAll}
                  className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Analyze Another Plant
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Upload clear, well-lit photos for best results</p>
        </footer>
      </div>
    </div>
  );
}

export default App;