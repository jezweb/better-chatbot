"use client";

import * as React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImageItem } from "./image-gallery";

export interface ImageGalleryModalProps {
  images: ImageItem[];
  selectedIndex: number;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.15,
    },
  },
};

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  images,
  selectedIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const currentImage = images[currentIndex];

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, onClose]);

  // Update thumbnail scroll indicators
  const updateScrollIndicators = useCallback(() => {
    const container = thumbnailContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1,
    );
  }, []);

  // Check scroll position on mount and when currentIndex changes
  useEffect(() => {
    updateScrollIndicators();
    const container = thumbnailContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollIndicators);
      return () =>
        container.removeEventListener("scroll", updateScrollIndicators);
    }
  }, [updateScrollIndicators]);

  // Scroll thumbnail into view when index changes
  useEffect(() => {
    const container = thumbnailContainerRef.current;
    if (!container) return;

    const thumbnail = container.children[currentIndex] as HTMLElement;
    if (thumbnail) {
      thumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  const handleThumbnailClick = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const scrollThumbnails = useCallback((direction: "left" | "right") => {
    const container = thumbnailContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }, []);

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={handleBackdropClick}
      >
        <motion.div
          ref={modalContentRef}
          className="relative w-full h-full max-w-7xl max-h-[90vh] flex flex-col p-4 md:p-8"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className={cn(
              "absolute top-4 right-4 z-10",
              "p-2 rounded-full",
              "bg-background/80 hover:bg-background",
              "border border-border",
              "transition-colors",
            )}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Main image */}
          <div className="flex-1 flex items-center justify-center mb-4 relative">
            {/* Previous button */}
            {images.length > 1 && (
              <button
                onClick={handlePrevious}
                className={cn(
                  "absolute left-2 z-10",
                  "p-3 rounded-full",
                  "bg-background/80 hover:bg-background",
                  "border border-border",
                  "transition-colors",
                )}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Image */}
            <div className="relative max-w-full max-h-full flex items-center justify-center">
              <img
                src={currentImage.src}
                alt={currentImage.alt || `Image ${currentIndex + 1}`}
                className="max-w-full max-h-[calc(90vh-200px)] object-contain rounded-lg"
              />
              {currentImage.details && (
                <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm p-3 rounded-b-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    {currentImage.details}
                  </p>
                </div>
              )}
            </div>

            {/* Next button */}
            {images.length > 1 && (
              <button
                onClick={handleNext}
                className={cn(
                  "absolute right-2 z-10",
                  "p-3 rounded-full",
                  "bg-background/80 hover:bg-background",
                  "border border-border",
                  "transition-colors",
                )}
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Thumbnail carousel */}
          {images.length > 1 && (
            <div className="relative">
              {/* Left scroll button */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollThumbnails("left")}
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 z-10",
                    "p-2 rounded-full",
                    "bg-background/90 hover:bg-background",
                    "border border-border",
                    "transition-colors",
                  )}
                  aria-label="Scroll thumbnails left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              {/* Thumbnails */}
              <div
                ref={thumbnailContainerRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide px-8"
                style={{ scrollbarWidth: "none" }}
              >
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-md overflow-hidden",
                      "border-2 transition-all",
                      currentIndex === index
                        ? "border-primary scale-110"
                        : "border-border hover:border-foreground/20",
                    )}
                  >
                    <img
                      src={image.src}
                      alt={image.alt || `Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Right scroll button */}
              {canScrollRight && (
                <button
                  onClick={() => scrollThumbnails("right")}
                  className={cn(
                    "absolute right-0 top-1/2 -translate-y-1/2 z-10",
                    "p-2 rounded-full",
                    "bg-background/90 hover:bg-background",
                    "border border-border",
                    "transition-colors",
                  )}
                  aria-label="Scroll thumbnails right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};

ImageGalleryModal.displayName = "ImageGalleryModal";
