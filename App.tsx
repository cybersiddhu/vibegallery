
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageGrid } from './components/ImageGrid';
import { Modal } from './components/Modal';
import { ImageGenerator } from './components/ImageGenerator';
import type { Image } from './types';

const App: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchInitialImages = async () => {
      setIsLoading(true);
      try {
        const initialImages: Image[] = await Promise.all(
          Array.from({ length: 15 }).map(async (_, i) => {
            const id = `initial-${i}-${Date.now()}`;
            // Adding a random query string to prevent caching and get different images
            const response = await fetch(`https://picsum.photos/500/500?random=${id}`);
            const blob = await response.blob();
            const src = URL.createObjectURL(blob);
            return {
              id: id,
              src: src,
              alt: `Random placeholder image ${i + 1}`,
              prompt: `Random placeholder image ${i + 1}`,
            };
          })
        );
        setImages(initialImages);
      } catch (error) {
        console.error("Failed to fetch initial images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialImages();
  }, []);


  const handleImageClick = useCallback((image: Image) => {
    setSelectedImage(image);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const openGeneratorModal = useCallback(() => {
    setIsGeneratorModalOpen(true);
  }, []);

  const closeGeneratorModal = useCallback(() => {
    setIsGeneratorModalOpen(false);
  }, []);

  const addImageToGallery = useCallback((newImage: Image) => {
    setImages(prevImages => [newImage, ...prevImages]);
    setIsGeneratorModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header onGenerateClick={openGeneratorModal} />
      <main className="p-4 sm:p-6 lg:p-8">
        {isLoading && images.length === 0 ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ImageGrid images={images} onImageClick={handleImageClick} />
        )}
      </main>

      {selectedImage && (
        <Modal onClose={closeModal}>
          <div className="bg-gray-800 p-4 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <img src={selectedImage.src} alt={selectedImage.alt} className="w-full h-auto object-contain max-h-[75vh] rounded-md" />
            <p className="mt-4 text-center text-gray-300 italic">{selectedImage.prompt}</p>
          </div>
        </Modal>
      )}

      {isGeneratorModalOpen && (
        <Modal onClose={closeGeneratorModal}>
            <ImageGenerator onImageGenerated={addImageToGallery} />
        </Modal>
      )}
    </div>
  );
};

export default App;
