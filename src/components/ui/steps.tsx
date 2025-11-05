"use client";

import * as React from "react";
import { createContext, useContext } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Context to pass step number automatically
const StepNumberContext = createContext<number>(0);

export interface StepsProps {
  children: React.ReactNode;
  className?: string;
}

export interface StepsItemProps {
  title: React.ReactNode;
  details: React.ReactNode;
  number?: number;
  className?: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

export const Steps: React.FC<StepsProps> = ({ children, className }) => {
  return (
    <motion.div
      className={cn("min-w-[280px] w-full", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col">
        {React.Children.map(children, (child, index) => (
          <StepNumberContext.Provider value={index + 1}>
            {child}
          </StepNumberContext.Provider>
        ))}
      </div>
    </motion.div>
  );
};

export const StepsItem: React.FC<StepsItemProps> = ({
  title,
  details,
  number,
  className,
}) => {
  const stepNumber = useContext(StepNumberContext);
  const displayNumber = Number.isInteger(number) ? number : stepNumber;

  return (
    <motion.div
      variants={itemVariants}
      className={cn("flex relative gap-4", className)}
    >
      {/* Connector column */}
      <div className="flex flex-col items-center">
        {/* Step number circle */}
        <div className="py-1 flex items-center justify-center z-10">
          <div
            className={cn(
              "flex items-center justify-center",
              "w-6 h-6 rounded-full",
              "bg-card border border-border",
              "text-muted-foreground text-xs font-medium",
              "transition-colors duration-200",
            )}
          >
            {displayNumber}
          </div>
        </div>

        {/* Connector line */}
        <div className="w-px flex-grow bg-border" />
      </div>

      {/* Content column */}
      <div className="pt-1 flex flex-col gap-1 mb-6 last:mb-0">
        <span className="font-medium text-sm text-foreground">{title}</span>
        <div className="text-sm text-muted-foreground flex flex-col gap-3">
          {details}
        </div>
      </div>
    </motion.div>
  );
};

Steps.displayName = "Steps";
StepsItem.displayName = "StepsItem";
