
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageGrid } from './components/ImageGrid';
import { Modal } from './components/Modal';
import { ImageGenerator } from './components/ImageGenerator';
import type { Image } from './types';

const App: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState<boolean>(false);

  const fetchImages = useCallback(async (count: number) => {
    try {
      const newImages: Image[] = await Promise.all(
        Array.from({ length: count }).map(async (_, i) => {
          const id = `img-${Date.now()}-${Math.random()}`;
          // Adding a random query string to prevent caching and get different images
          const response = await fetch(`https://picsum.photos/500/500?random=${id}`);
          const blob = await response.blob();
          const src = URL.createObjectURL(blob);
          return {
            id: id,
            src: src,
            alt: `Random placeholder image ${i + 1}`,
            prompt: `Random placeholder image`,
          };
        })
      );
      setImages(prevImages => [...prevImages, ...newImages]);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  }, []);

  const loadMoreImages = useCallback(async () => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);
    await fetchImages(10);
    setIsFetchingMore(false);
  }, [isFetchingMore, fetchImages]);

  useEffect(() => {
    const fetchInitialImages = async () => {
      setIsLoading(true);
      await fetchImages(15);
      setIsLoading(false);
    };

    fetchInitialImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on initial mount

  useEffect(() => {
    const handleScroll = () => {
      // Load more when user is 500px from the bottom
      if (
        window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 500 ||
        isLoading ||
        isFetchingMore
      ) {
        return;
      }
      loadMoreImages();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, isFetchingMore, loadMoreImages]);


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

        {isFetchingMore && (
           <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
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
