
import React from 'react';
import type { Image } from '../types';

interface ImageCardProps {
  image: Image;
  onClick: () => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onClick }) => {
  return (
    <div
      className="group aspect-w-1 aspect-h-1 block bg-gray-800 rounded-lg overflow-hidden cursor-pointer shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30"
      onClick={onClick}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end p-2">
         <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">{image.prompt}</p>
      </div>
    </div>
  );
};
