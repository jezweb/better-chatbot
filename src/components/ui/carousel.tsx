"use client";

import * as React from "react";
import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Context for sharing carousel state
interface CarouselContextType {
  scrollDivRef: React.RefObject<HTMLDivElement | null>;
  scroll: (direction: "left" | "right") => void;
  itemsToScroll: number;
  isPrevVisible: boolean;
  isNextVisible: boolean;
}

const CarouselContext = createContext<CarouselContextType | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error(
      "Carousel compound components must be used within Carousel",
    );
  }
  return context;
}

// Main Carousel component
export interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  itemsToScroll?: number;
}

export interface CarouselHandle {
  scrollTo: (direction: "left" | "right") => void;
}

export const Carousel = forwardRef<CarouselHandle, CarouselProps>(
  ({ children, className, itemsToScroll = 1 }, ref) => {
    const scrollDivRef = useRef<HTMLDivElement | null>(null);
    const [isPrevVisible, setIsPrevVisible] = useState(false);
    const [isNextVisible, setIsNextVisible] = useState(false);

    // Update button visibility based on scroll position
    const updateButtonVisibility = useCallback(() => {
      const scrollDiv = scrollDivRef.current;
      if (!scrollDiv) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollDiv;

      // Show prev button if scrolled right
      setIsPrevVisible(scrollLeft > 0);

      // Show next button if there's more content to scroll
      setIsNextVisible(scrollLeft < scrollWidth - clientWidth - 1);
    }, []);

    // Scroll function
    const scroll = useCallback(
      (direction: "left" | "right") => {
        const scrollDiv = scrollDivRef.current;
        if (!scrollDiv) return;

        const itemWidth = scrollDiv.scrollWidth / scrollDiv.children.length;
        const scrollAmount = itemWidth * itemsToScroll;

        scrollDiv.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      },
      [itemsToScroll],
    );

    // Expose scroll function via ref
    useImperativeHandle(ref, () => ({
      scrollTo: scroll,
    }));

    // Setup observers
    useEffect(() => {
      const scrollDiv = scrollDivRef.current;
      if (!scrollDiv) return;

      // Initial check
      updateButtonVisibility();

      // Listen to scroll events
      scrollDiv.addEventListener("scroll", updateButtonVisibility);

      // ResizeObserver to detect container size changes
      const resizeObserver = new ResizeObserver(() => {
        updateButtonVisibility();
      });
      resizeObserver.observe(scrollDiv);

      // MutationObserver to detect content changes
      const mutationObserver = new MutationObserver(() => {
        updateButtonVisibility();
      });
      mutationObserver.observe(scrollDiv, {
        childList: true,
        subtree: true,
      });

      return () => {
        scrollDiv.removeEventListener("scroll", updateButtonVisibility);
        resizeObserver.disconnect();
        mutationObserver.disconnect();
      };
    }, [updateButtonVisibility]);

    const contextValue: CarouselContextType = {
      scrollDivRef,
      scroll,
      itemsToScroll,
      isPrevVisible,
      isNextVisible,
    };

    return (
      <CarouselContext.Provider value={contextValue}>
        <div className={cn("relative w-full", className)}>{children}</div>
      </CarouselContext.Provider>
    );
  },
);

Carousel.displayName = "Carousel";

// CarouselContent component
export interface CarouselContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CarouselContent: React.FC<CarouselContentProps> = ({
  children,
  className,
}) => {
  const { scrollDivRef } = useCarousel();

  return (
    <div
      ref={scrollDivRef}
      className={cn(
        "flex overflow-x-auto scrollbar-hide gap-4",
        "scroll-smooth",
        className,
      )}
      style={{ scrollbarWidth: "none" }}
    >
      {children}
    </div>
  );
};

CarouselContent.displayName = "CarouselContent";

// CarouselItem component
export interface CarouselItemProps {
  children: React.ReactNode;
  className?: string;
}

export const CarouselItem: React.FC<CarouselItemProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex-shrink-0 min-w-0", className)}>{children}</div>
  );
};

CarouselItem.displayName = "CarouselItem";

// CarouselPrevious button
export interface CarouselPreviousProps {
  className?: string;
  children?: React.ReactNode;
}

export const CarouselPrevious: React.FC<CarouselPreviousProps> = ({
  className,
  children,
}) => {
  const { scroll, isPrevVisible } = useCarousel();

  if (!isPrevVisible) return null;

  return (
    <button
      onClick={() => scroll("left")}
      className={cn(
        "absolute left-2 top-1/2 -translate-y-1/2 z-10",
        "p-2 rounded-full",
        "bg-background/90 hover:bg-background",
        "border border-border",
        "transition-colors",
        "shadow-md",
        className,
      )}
      aria-label="Previous"
    >
      {children || <ChevronLeft className="w-5 h-5" />}
    </button>
  );
};

CarouselPrevious.displayName = "CarouselPrevious";

// CarouselNext button
export interface CarouselNextProps {
  className?: string;
  children?: React.ReactNode;
}

export const CarouselNext: React.FC<CarouselNextProps> = ({
  className,
  children,
}) => {
  const { scroll, isNextVisible } = useCarousel();

  if (!isNextVisible) return null;

  return (
    <button
      onClick={() => scroll("right")}
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 z-10",
        "p-2 rounded-full",
        "bg-background/90 hover:bg-background",
        "border border-border",
        "transition-colors",
        "shadow-md",
        className,
      )}
      aria-label="Next"
    >
      {children || <ChevronRight className="w-5 h-5" />}
    </button>
  );
};

CarouselNext.displayName = "CarouselNext";
