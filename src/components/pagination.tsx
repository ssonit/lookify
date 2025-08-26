
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const pageNumber = Number(value);
    
    // Only update if the input is a valid number within the page range
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };
  
  // When the input loses focus, if it's empty or invalid, reset to 1 or the current page
  const handlePageInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
     const value = e.target.value;
     if (value === '' || Number(value) < 1 || Number(value) > totalPages) {
        onPageChange(currentPage); // or reset to 1: onPageChange(1)
     }
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-end gap-2 text-sm ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Trang trước</span>
      </Button>
      <div className="flex items-center gap-1.5">
        <span>Trang</span>
        <Input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={handlePageInputChange}
          onBlur={handlePageInputBlur}
          onKeyDown={(e) => {
             if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement;
                target.blur(); // Trigger onBlur to validate
             }
          }}
          className="h-9 w-14 text-center"
        />
        <span>/ {totalPages}</span>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Trang sau</span>
      </Button>
    </div>
  );
}
