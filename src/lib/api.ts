import { Hotel } from "./types";

const API_URL = "https://ngochieuwedding.io.vn/api/booking";

export const fetchHotels = async (): Promise<Hotel[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    // Transform API data to match our Hotel type
    return data.map((item: any) => {
      // Parse description field which contains both full and short descriptions
      const parsedDescription = JSON.parse(item.description || "{}");

      return {
        id: item.id,
        name: item.name,
        location: item.location,
        city: item.city,
        description: parsedDescription,
        shortDescription: parsedDescription.short || "",
        price: item.price || 0,
        rating: item.rating || 0,
        reviewCount: item.reviewCount || 0,
        images: item.images || [],
        amenities: item.amenities || [],
        rooms: (item.rooms || []).map((room: any) => ({
          id: room.id,
          name: room.name,
          description: room.description,
          price: room.price,
          maxGuests: room.maxGuests,
          bedType: room.bedType,
          images: room.images || [],
          amenities: room.amenities || [],
        })),
      };
    });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return [];
  }
};

export const getHotelById = async (id: string): Promise<Hotel | null> => {
  try {
    const hotels = await fetchHotels();
    return hotels.find((hotel) => hotel.id === id) || null;
  } catch (error) {
    console.error("Error fetching hotel by id:", error);
    return null;
  }
};

export const filterHotels = async (location: string): Promise<Hotel[]> => {
  try {
    const hotels = await fetchHotels();
    if (!location) return hotels;
    return hotels.filter((hotel) =>
      hotel.city?.toLowerCase().includes(location.toLowerCase())
    );
  } catch (error) {
    console.error("Error filtering hotels:", error);
    return [];
  }
};
