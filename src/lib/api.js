/**
 * @typedef {import('./types').Hotel} Hotel
 */

const API_URL = "https://ngochieuwedding.io.vn/api/booking";

/**
 * Fetches all hotels from the API
 * @returns {Promise<Hotel[]>}
 */
export const fetchHotels = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();

    // The API returns { message: string, data: Hotel[] }
    if (!result.data || !Array.isArray(result.data)) {
      console.error("Invalid API response format:", result);
      return [];
    }

    // Transform API data to match our Hotel type
    return result.data.map((item) => {
      // Parse description field which contains both full and short descriptions
      const parsedDescription = JSON.parse(item.description || "{}");

      return {
        id: item._id, // API uses _id instead of id
        name: item.name,
        location: item.location,
        city: item.location.split(",")[1]?.trim() || "", // Extract city from location
        description: parsedDescription,
        shortDescription: parsedDescription.content || "", // Use content as short description
        price: item.price || 0,
        rating: 0, // API doesn't provide rating
        reviewCount: 0, // API doesn't provide review count
        images: item.images || [],
        amenities: parsedDescription.service?.map((s) => s.name) || [], // Extract amenities from service
        rooms: [], // API doesn't provide room data
      };
    });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return [];
  }
};

/**
 * Fetches a hotel by its ID
 * @param {string} id - The hotel ID
 * @returns {Promise<Hotel|null>}
 */
export const getHotelById = async (id) => {
  try {
    const hotels = await fetchHotels();
    return hotels.find((hotel) => hotel.id === id);
  } catch (error) {
    console.error("Error getting hotel by ID:", error);
    return null;
  }
};

/**
 * Filters hotels by location
 * @param {string} location - The location to filter by
 * @returns {Promise<Hotel[]>}
 */
export const filterHotels = async (location) => {
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
