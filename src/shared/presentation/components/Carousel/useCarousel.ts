import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseCarouselProps {
  totalItems: number;
  autoPlay?: boolean;
  interval?: number;
  itemsPerView?: number;
}

export const useCarousel = ({ 
  totalItems, 
  autoPlay = true, 
  interval = 5000,
  itemsPerView = 1 
}: UseCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxIndex = Math.max(0, totalItems - itemsPerView);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goTo = useCallback((index: number) => {
    if (index >= 0 && index <= maxIndex) {
      setCurrentIndex(index);
    }
  }, [maxIndex]);

  useEffect(() => {
    if (autoPlay && !isPaused && !isModalOpen && totalItems > 1) {
      timerRef.current = setInterval(() => {
        next();
      }, interval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoPlay, isPaused, isModalOpen, next, interval, totalItems]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);
  
  const openModal = useCallback(() => {
    setIsModalOpen(true);
    pause(); // Optional: stop carousel behind modal
  }, [pause]);
  
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    resume();
  }, [resume]);

  return {
    currentIndex,
    isModalOpen,
    next,
    prev,
    goTo,
    pause,
    resume,
    openModal,
    closeModal
  };
};
