
import { Hotel } from './types';
import { fetchHotels, getHotelById as fetchHotelById, filterHotels as filterHotelsApi } from './api';

// These can be fetched from the API in a real implementation
export const CITIES = [
  "Hà Nội",
  "Hồ Chí Minh",
  "Đà Nẵng",
  "Hội An",
  "Nha Trang",
  "Phú Quốc",
  "Hạ Long",
  "Đà Lạt",
  "Huế",
  "Sapa",
  "Hải Phòng",
  "Quy Nhơn"
];

export const AMENITIES = [
  "Wifi miễn phí",
  "Bể bơi",
  "Phòng gym",
  "Spa",
  "Nhà hàng",
  "Quầy bar",
  "Dịch vụ phòng 24h",
  "Bãi đậu xe",
  "Máy lạnh",
  "Máy giặt",
  "Tủ lạnh",
  "TV màn hình phẳng",
  "Ban công",
  "Bồn tắm",
  "Dịch vụ đưa đón sân bay",
  "Phòng họp"
];

// Remove the static hotel data and use API functions instead
export const hotels: Hotel[] = [];

// Use the async API functions
export const getHotelById = async (id: string): Promise<Hotel | null> => {
  return await fetchHotelById(id);
};

export const filterHotels = async (location: string): Promise<Hotel[]> => {
  return await filterHotelsApi(location);
};
