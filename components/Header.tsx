
import React from 'react';
import { PlusIcon } from './icons/PlusIcon';

interface HeaderProps {
  onGenerateClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGenerateClick }) => {
  return (
    <header className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur-md shadow-md p-4 sm:p-6 flex justify-between items-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">AI Image Gallery</h1>
      <button
        onClick={onGenerateClick}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
      >
        <PlusIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Generate Image</span>
      </button>
    </header>
  );
};
