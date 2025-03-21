
import * as React from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function GuestSelector({
  guests,
  onGuestsChange,
  className,
}) {
  const increment = () => {
    if (guests < 10) {
      onGuestsChange(guests + 1);
    }
  };

  const decrement = () => {
    if (guests > 1) {
      onGuestsChange(guests - 1);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal border rounded-xl h-14 bg-white hover:bg-gray-50",
              !guests && "text-muted-foreground"
            )}
          >
            <Users className="mr-2 h-4 w-4" />
            <span>{guests} khách</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Số lượng khách</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm">Người lớn & trẻ em</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={decrement}
                  disabled={guests <= 1}
                >
                  <span>-</span>
                </Button>
                <span className="w-8 text-center">{guests}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={increment}
                  disabled={guests >= 10}
                >
                  <span>+</span>
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Số lượng khách tối đa là 10 người.
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
