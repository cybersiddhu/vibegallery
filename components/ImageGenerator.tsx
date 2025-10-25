
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import type { Image } from '../types';
import { Spinner } from './Spinner';

interface ImageGeneratorProps {
  onImageGenerated: (image: Image) => void;
}

const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<Image | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImage(prompt, aspectRatio);
      const newImage: Image = {
        id: `gen-${Date.now()}`,
        src: imageUrl,
        alt: prompt,
        prompt: prompt
      };
      setGeneratedImage(newImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddToGallery = () => {
      if (generatedImage) {
          onImageGenerated(generatedImage);
      }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Generate New Image</h2>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-64">
          <Spinner />
          <p className="mt-4 text-gray-300">Generating your masterpiece...</p>
        </div>
      )}

      {!isLoading && generatedImage && (
        <div className="text-center">
            <img src={generatedImage.src} alt={generatedImage.alt} className="rounded-lg mb-4 max-h-80 mx-auto" />
            <p className="text-gray-400 italic mb-4">"{generatedImage.prompt}"</p>
             <button
                onClick={handleAddToGallery}
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Add to Gallery
              </button>
              <button
                onClick={() => setGeneratedImage(null)}
                className="w-full mt-2 bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Generate Another
              </button>
        </div>
      )}

      {!isLoading && !generatedImage && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
              Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A majestic lion wearing a crown, cinematic lighting"
              rows={3}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
            <div className="flex flex-wrap gap-2">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    aspectRatio === ratio
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
          
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition duration-300"
          >
            Generate
          </button>
        </form>
      )}
    </div>
  );
};
