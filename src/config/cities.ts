import { City } from "../types/weather";

/**
 * List of cities available for weather lookup
 * Add more cities as needed
 */
export const CITIES: City[] = [
  { id: 6167865, name: "Toronto", country: "CA" },
  { id: 6094817, name: "Ottawa", country: "CA" },
  { id: 1850147, name: "Tokyo", country: "JP" },
  // Add more cities below - find city IDs at https://openweathermap.org/
  // Example: { id: 5128581, name: "New York", country: "US" },
];
