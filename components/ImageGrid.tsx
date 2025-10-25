
import React from 'react';
import type { Image } from '../types';
import { ImageCard } from './ImageCard';

interface ImageGridProps {
  images: Image[];
  onImageClick: (image: Image) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageClick }) => {
  if (images.length === 0) {
    return (
      <div className="text-center text-gray-400 py-16">
        <h2 className="text-2xl font-semibold">Your gallery is empty</h2>
        <p className="mt-2">Click "Generate Image" to create your first masterpiece!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} onClick={() => onImageClick(image)} />
      ))}
    </div>
  );
};
