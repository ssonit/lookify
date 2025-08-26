
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

interface PaginationProps {
  totalPages: number;
  className?: string;
}

export function Pagination({ totalPages, className }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      router.push(createPageURL(currentPage - 1));
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
       router.push(createPageURL(currentPage + 1));
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const pageNumber = Number(value);
    
    if (value === '' || (pageNumber >= 1 && pageNumber <= totalPages)) {
        const newUrl = createPageURL(pageNumber || 1);
        // We use router.replace here for the input to not create new browser history entries for each number typed
        router.replace(newUrl); 
    }
  };
  
  // When the input loses focus, if it's empty or invalid, reset to 1
  const handlePageInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
     const value = e.target.value;
     if (value === '' || Number(value) < 1 || Number(value) > totalPages) {
        router.push(createPageURL(1));
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
                const pageNumber = Number(target.value);
                 if (pageNumber >= 1 && pageNumber <= totalPages) {
                    router.push(createPageURL(pageNumber));
                } else {
                    router.push(createPageURL(1));
                }
                target.blur();
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
