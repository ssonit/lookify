'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface DateInputProps {
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

const DateInput = React.forwardRef<HTMLButtonElement, DateInputProps>(
  ({ className, value, onChange, placeholder = 'dd/mm/yyyy', disabled, id, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(undefined);

    // Convert string value to Date
    React.useEffect(() => {
      if (value) {
        const dateObj = new Date(value);
        if (!isNaN(dateObj.getTime())) {
          setDate(dateObj);
        } else {
          setDate(undefined);
        }
      } else {
        setDate(undefined);
      }
    }, [value]);

    // Convert Date to string value
    const handleDateSelect = (selectedDate: Date | undefined) => {
      setDate(selectedDate);
      if (selectedDate && onChange) {
        // Convert to yyyy-mm-dd format for storage
        const year = selectedDate.getFullYear();
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const day = selectedDate.getDate().toString().padStart(2, '0');
        onChange(`${year}-${month}-${day}`);
      } else if (onChange) {
        onChange('');
      }
      setOpen(false);
    };

    // Format date for display (dd/mm/yyyy)
    const formatDateForDisplay = (date: Date | undefined): string => {
      if (!date) return '';
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            id={id}
            variant="outline"
            className={cn(
              "w-full justify-between font-normal",
              !date && "text-muted-foreground",
              className
            )}
            disabled={disabled}
            {...props}
          >
            {date ? formatDateForDisplay(date) : placeholder}
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            captionLayout="dropdown"
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DateInput.displayName = 'DateInput';

export { DateInput };
