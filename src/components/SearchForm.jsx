import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRangePicker } from "./DateRangePicker";
import { GuestSelector } from "./GuestSelector";
import { CITIES } from "@/lib/data";
import { cn } from "@/lib/utils";

export function SearchForm({
  className,
  variant = "hero",
  onSearch,
  initialParams,
}) {
  const navigate = useNavigate();
  const [location, setLocation] = useState(initialParams?.location || "");
  const [dateRange, setDateRange] = useState(
    initialParams?.checkIn && initialParams?.checkOut
      ? {
          from: initialParams.checkIn,
          to: initialParams.checkOut,
        }
      : undefined
  );
  const [guests, setGuests] = useState(initialParams?.guests || 2);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState(CITIES);

  useEffect(() => {
    if (location) {
      const filtered = CITIES.filter((city) =>
        city.toLowerCase().includes(location.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(CITIES);
    }
  }, [location]);

  const handleSearch = () => {
    const searchParams = {
      location,
      checkIn: dateRange?.from,
      checkOut: dateRange?.to,
      guests,
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      // Build query string for navigation
      const queryParams = new URLSearchParams();
      if (location) queryParams.append("location", location);
      if (dateRange?.from)
        queryParams.append("checkIn", dateRange.from.toISOString());
      if (dateRange?.to)
        queryParams.append("checkOut", dateRange.to.toISOString());
      queryParams.append("guests", guests.toString());

      navigate(`/hotels?${queryParams.toString()}`);
    }
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl",
        variant === "hero" ? "glass p-4 md:p-6" : "bg-white shadow-sm p-3",
        className
      )}
    >
      <div
        className={cn(
          "grid gap-4",
          variant === "hero"
            ? "md:grid-cols-[1fr_1fr_auto] lg:grid-cols-[1.5fr_1.5fr_1fr_auto]"
            : "md:grid-cols-[1fr_1fr_auto] lg:grid-cols-[1.2fr_1.5fr_0.8fr_auto]"
        )}
      >
        {/* Location Input */}
        <div className="relative">
          <Popover
            open={showCitySuggestions && filteredCities.length > 0}
            onOpenChange={setShowCitySuggestions}
          >
            <PopoverTrigger asChild>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Bạn muốn đi đâu?"
                  className={cn(
                    "pl-10 pr-4 border rounded-xl h-14 bg-white",
                    variant === "compact" && "h-12"
                  )}
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setShowCitySuggestions(true);
                  }}
                  onClick={() => setShowCitySuggestions(true)}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <div className="max-h-64 overflow-y-auto py-2">
                {filteredCities.map((city) => (
                  <div
                    key={city}
                    className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                    onClick={() => {
                      setLocation(city);
                      setShowCitySuggestions(false);
                    }}
                  >
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      <span>{city}, Việt Nam</span>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Range Picker */}
        <div
          className={
            variant === "hero"
              ? "col-span-full md:col-span-1 lg:col-span-1"
              : ""
          }
        >
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>

        {/* Guest Selector - Hide on small screens in hero variant */}
        <div
          className={cn(
            variant === "hero" ? "col-span-full lg:col-span-1" : ""
          )}
        >
          <GuestSelector guests={guests} onGuestsChange={setGuests} />
        </div>

        {/* Search Button */}
        <Button
          className={cn(
            "rounded-xl",
            variant === "hero" ? "h-14 px-8" : "h-12"
          )}
          onClick={handleSearch}
        >
          <Search className="h-4 w-4 mr-2" />
          <span>Tìm kiếm</span>
        </Button>
      </div>
    </div>
  );
}
