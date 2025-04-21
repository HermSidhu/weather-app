import { CurrentWeather, ForecastData, City } from "../types/weather";

/**
 * Extract unique days from forecast data
 *
 * The weather API returns forecast data with multiple timestamps per day
 * (typically every 3 hours). This function extracts just the unique calendar
 * days, so we can show day tabs/buttons in the UI for users to select.
 *
 * For example, if the API returns forecasts for:
 * - May 15 at 9am, 12pm, 3pm, 6pm, 9pm
 * - May 16 at 9am, 12pm, 3pm, 6pm, 9pm
 *
 * This function will extract:
 * - "Mon, May 15"
 * - "Tue, May 16"
 */
export const extractUniqueDays = (data: ForecastData | null): string[] => {
  if (!data) return [];

  const uniqueDays: string[] = []; // Array to hold our unique day strings
  const daySet = new Set<string>(); // Set to track which days we've already seen

  data.list.forEach((item) => {
    // Convert timestamp to a readable day format (e.g., "Mon, May 15")
    const date = new Date(item.dt_txt);
    const dayStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    // If we haven't seen this day before, add it to our array
    if (!daySet.has(dayStr)) {
      daySet.add(dayStr);
      uniqueDays.push(dayStr);
    }
  });

  return uniqueDays; // Returns array like ["Mon, May 15", "Tue, May 16", ...]
};

/**
 * Get forecast data for a specific day
 */
export const getDayForecastData = (data: ForecastData, dayStr: string) => {
  return data.list.filter((item) => {
    const date = new Date(item.dt_txt);
    const itemDayStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    return itemDayStr === dayStr;
  });
};

/**
 * Create a weather summary for a selected day
 */
export const createDaySummary = (
  dayData: ForecastData["list"],
  selectedCity: City | null,
  currentWeather: CurrentWeather | null
): CurrentWeather | null => {
  if (dayData.length === 0 || !selectedCity) return null;

  // Use the middle of the day forecast (noon) if available, otherwise first entry
  const midDayForecast =
    dayData.find((item) => {
      const date = new Date(item.dt_txt);
      return date.getHours() === 12 || date.getHours() === 13;
    }) || dayData[0];

  // Create a summary with proper type mapping
  const summary: CurrentWeather = {
    weather: midDayForecast.weather,
    main: {
      temp: midDayForecast.main.temp,
      temp_min: midDayForecast.main.temp_min,
      temp_max: midDayForecast.main.temp_max,
    },
    wind: {
      speed: midDayForecast.wind.speed,
    },
    clouds: {
      all: midDayForecast.clouds?.all || 0,
    },
    name: selectedCity.name,
    timezone: currentWeather?.timezone || 0,
  };

  return summary;
};

/**
 * Get forecasts for specific target hours
 */
export const getForecastsForTargetHours = (
  dayForecast: ForecastData["list"],
  targetHours: number[]
) => {
  // Define the result type with the extended forecast item that includes targetHour
  const result: (ForecastData["list"][0] & { targetHour: number | null })[] =
    [];
  const usedForecasts = new Set<string>(); // Track which forecasts we've already used

  // First pass - try to find exact matches or very close ones
  for (const hour of targetHours) {
    // Find forecast closest to this hour
    let closest = null;
    let minDiff = Infinity;

    for (const forecast of dayForecast) {
      const date = new Date(forecast.dt_txt);
      const forecastHour = date.getHours();
      const diff = Math.abs(forecastHour - hour);

      // Only consider forecasts we haven't used yet
      if (diff < minDiff && !usedForecasts.has(forecast.dt_txt)) {
        minDiff = diff;
        closest = forecast;
      }
    }

    if (closest && minDiff <= 3) {
      // Only include if within 3 hours of target
      result.push({
        ...closest,
        targetHour: hour, // Add the target hour for display purposes
      });
      usedForecasts.add(closest.dt_txt);
    }
  }

  // If we couldn't find all times, fill remaining slots with available forecasts
  if (result.length < targetHours.length) {
    for (const forecast of dayForecast) {
      if (!usedForecasts.has(forecast.dt_txt)) {
        result.push({
          ...forecast,
          targetHour: null, // No specific target hour
        });
        usedForecasts.add(forecast.dt_txt);

        if (result.length >= targetHours.length) break;
      }
    }
  }

  // Sort by actual time
  return result.sort((a, b) => {
    const timeA = new Date(a.dt_txt).getTime();
    const timeB = new Date(b.dt_txt).getTime();
    return timeA - timeB;
  });
};
