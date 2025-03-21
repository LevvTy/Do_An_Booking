import { useState, useEffect } from "react";
import { HotelCard } from "./HotelCard";
import { Loader2 } from "lucide-react";

export function HotelList({
  hotels,
  loading = false,
  emptyMessage = "Không tìm thấy khách sạn nào phù hợp với tìm kiếm của bạn.",
}) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading for a smoother UX
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-medium mb-2">Không tìm thấy kết quả</h3>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {hotels.map((hotel) => (
        <div
          key={hotel.id}
          className="animate-scale-in [animation-fill-mode:backwards]"
          style={{
            animationDelay: `${
              (parseInt(hotel.id.split("-")[1], 36) % 10) * 50
            }ms`,
          }}
        >
          <HotelCard hotel={hotel} />
        </div>
      ))}
    </div>
  );
}
