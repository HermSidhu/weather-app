/**
 * Weather-related utilities
 */

/**
 * Map weather conditions to their corresponding icons
 */
export const getWeatherIcon = (condition: string): string => {
  const iconMap: Record<string, string> = {
    "clear sky": "☀️",
    "few clouds": "🌤️",
    "scattered clouds": "⛅",
    "broken clouds": "☁️",
    "shower rain": "🌦️",
    rain: "🌧️",
    thunderstorm: "⛈️",
    snow: "❄️",
    mist: "🌫️",
  };

  return iconMap[condition.toLowerCase()] || "☁️";
};

/**
 * Get weather condition class name for styling
 */
export const getWeatherConditionClass = (condition: string): string => {
  // Normalize the condition to lowercase and handle common cases
  const normalizedCondition = condition.toLowerCase();

  if (normalizedCondition.includes("clear")) return "clear";
  if (normalizedCondition.includes("cloud")) return "clouds";
  if (
    normalizedCondition.includes("rain") ||
    normalizedCondition.includes("drizzle")
  )
    return "rain";
  if (normalizedCondition.includes("snow")) return "snow";
  if (normalizedCondition.includes("thunderstorm")) return "thunderstorm";
  if (
    normalizedCondition.includes("mist") ||
    normalizedCondition.includes("fog")
  )
    return "mist";

  return "default";
};
