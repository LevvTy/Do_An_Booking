/**
 * @typedef {Object} Hotel
 * @property {string} id
 * @property {string} name
 * @property {string} location
 * @property {string} city
 * @property {Object} description - Parsed JSON object containing hotel description
 * @property {string} shortDescription
 * @property {number} price
 * @property {number} rating
 * @property {number} reviewCount
 * @property {string[]} images
 * @property {string[]} amenities
 * @property {Room[]} rooms
 */

/**
 * @typedef {Object} Room
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number} maxGuests
 * @property {string} bedType
 * @property {string[]} images
 * @property {string[]} amenities
 */

/**
 * @typedef {Object} SearchParams
 * @property {string} location
 * @property {Date|undefined} checkIn
 * @property {Date|undefined} checkOut
 * @property {number} guests
 */

/**
 * @typedef {Object} BookingDetails
 * @property {string} hotelId
 * @property {string} roomId
 * @property {Date} checkIn
 * @property {Date} checkOut
 * @property {number} guests
 * @property {number} totalNights
 * @property {number} totalPrice
 */

/**
 * @typedef {BookingDetails & {
 *   id: string,
 *   bookingDate: Date,
 *   hotelName: string,
 *   roomName: string,
 *   hotelImage: string
 * }} Booking
 */

// Export the type definitions
export const Hotel = {};
export const Room = {};
export const SearchParams = {};
export const BookingDetails = {};
export const Booking = {};
