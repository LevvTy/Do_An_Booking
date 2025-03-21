import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function HotelCard({ hotel, className }) {
  const {
    id,
    name,
    location,
    city,
    shortDescription,
    price,
    rating,
    reviewCount,
    images,
  } = hotel;

  // Format price with commas
  const formattedPrice = new Intl.NumberFormat("vi-VN").format(price);

  return (
    <Link
      to={`/hotel/${id}`}
      className={cn(
        "group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={images[0] || "/placeholder-hotel.jpg"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">
                {location}, {city}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-primary/10 text-primary rounded-md px-2 py-1">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-sm font-medium">
              {rating ? rating.toFixed(1) : "0.0"}
            </span>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {shortDescription}
        </p>

        {/* Price and Reviews */}
        <div className="mt-4 flex items-end justify-between">
          <div>
            <span className="text-lg font-semibold">{formattedPrice}₫</span>
            <span className="text-sm text-gray-500 ml-1">/ đêm</span>
          </div>

          <div className="text-sm text-gray-500">
            {reviewCount || 0} đánh giá
          </div>
        </div>
      </div>
    </Link>
  );
}
