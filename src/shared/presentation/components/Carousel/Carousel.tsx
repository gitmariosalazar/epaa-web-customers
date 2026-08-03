import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useCarousel } from './useCarousel';
import { Modal } from '../Modal/Modal';
import './Carousel.css';
import { Button } from '../Button/Button';

export interface CarouselProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  modalTitle?: string;
  className?: string;
  itemsPerView?: number;
  gap?: number;
  fullWidth?: boolean;
  /** Called when the expand modal opens */
  onModalOpen?: () => void;
  /** Called when the expand modal closes */
  onModalClose?: () => void;
  /**
   * Incrementing this number signals the Carousel to close its internal modal.
   * Increment from the parent each time you want to force-close.
   */
  closeRequestCount?: number;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  size = 'md',
  autoPlay = true,
  interval = 5000,
  showArrows = true,
  showDots = true,
  modalTitle = 'Vista Expandida',
  className = '',
  itemsPerView = 1,
  gap = 0,
  fullWidth = true,
  onModalOpen,
  onModalClose,
  closeRequestCount = 0,
}) => {
  // Ensure children is always an array to handle single child edge cases
  const validChildren = React.Children.toArray(children);
  const totalItems = validChildren.length;

  const {
    currentIndex,
    isModalOpen,
    next,
    prev,
    goTo,
    pause,
    resume,
    openModal,
    closeModal
  } = useCarousel({ totalItems, autoPlay, interval, itemsPerView });

  // Force-close internal modal when parent increments closeRequestCount
  useEffect(() => {
    if (closeRequestCount > 0 && isModalOpen) {
      closeModal();
      onModalClose?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeRequestCount]);

  if (totalItems === 0) {
    return null;
  }

  return (
    <>
      <div
        className={`carousel-container carousel-size-${size} ${className}`.trim()}
        onMouseEnter={pause}
        onMouseLeave={resume}
        style={{ 
          width: fullWidth ? '100%' : 'max-content',
          maxWidth: '100%'
        }}
      >
        {/* Expand to Modal Button */}
        <Button
          variant="dashed"
          size="xs"
          circle
          className="carousel-expand-btn"
          onClick={() => {
            openModal();
            onModalOpen?.();
          }}
          aria-label="Expandir"
          title="Ver en pantalla completa"
          color='accent'
        >
          <Maximize2 size={18} />
        </Button>

        <div className="carousel-track-wrapper">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(calc(-${currentIndex} * ((100% - ${gap * (itemsPerView - 1)}px) / ${itemsPerView} + ${gap}px)))`,
              gap: `${gap}px`
            }}
          >
            {validChildren.map((child, index) => (
              <div
                key={index}
                className="carousel-slide"
                aria-hidden={index < currentIndex || index >= currentIndex + itemsPerView}
                style={{
                  flex: `0 0 calc((100% - ${gap * (itemsPerView - 1)}px) / ${itemsPerView})`
                }}
              >
                {child}
              </div>
            ))}
          </div>
        </div>

        {/* Controls - Arrows */}
        {showArrows && totalItems > 1 && (
          <>
            <Button
              variant="dashed"
              size="xs"
              circle
              className="carousel-btn carousel-btn-prev"
              onClick={prev}
              color='accent'
              aria-label="Anterior"
            >
              <ChevronLeft size={24} />
            </Button>
            <Button
              variant="dashed"
              size="xs"
              circle
              className="carousel-btn carousel-btn-next"
              onClick={next}
              aria-label="Siguiente"
              color='accent'
            >
              <ChevronRight size={24} />
            </Button>
          </>
        )}

        {/* Controls - Dots */}
        {showDots && totalItems > 1 && (
          <div className="carousel-dots">
            {validChildren.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goTo(index)}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal - Displays ALL the slides in an expanded grid view */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          closeModal();
          onModalClose?.();
        }}
        title={modalTitle}
        size="xl" // Usar un tamaño grande para la vista expandida
      >
        <div style={{
          width: '100%',
          maxHeight: '70vh',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
          padding: '1rem'
        }}>
          {validChildren}
        </div>
      </Modal>
    </>
  );
};
