import { useState, useCallback, useRef } from "react";
import { CurrentWeather, ForecastData } from "../types/weather";

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY;

const WEATHER_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather?id=";
const FORECAST_ENDPOINT =
  "https://api.openweathermap.org/data/2.5/forecast?id=";

/**
 * Hook providing weather data fetching functionality
 */
interface UseWeatherResult {
  currentWeather: CurrentWeather | null;
  forecast: ForecastData | null;
  isLoading: boolean;
  isForecastLoading: boolean;
  error: string | null;
  fetchWeatherForCity: (cityId: number) => Promise<void>;
  fetchForecastForCity: (cityId: number) => Promise<void>;
}

export const useWeather = (): UseWeatherResult => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isForecastLoading, setIsForecastLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Track the last city ID to prevent duplicate calls
  const lastWeatherCityRef = useRef<number | null>(null);
  const lastForecastCityRef = useRef<number | null>(null);

  const fetchWeatherForCity = useCallback(async (cityId: number) => {
    // Skip if we already have data for this city
    if (lastWeatherCityRef.current === cityId) return;

    setIsLoading(true);
    setError(null);
    lastWeatherCityRef.current = cityId;

    try {
      const response = await fetch(
        `${WEATHER_ENDPOINT}${cityId}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch current weather");
      }

      const data = await response.json();
      setCurrentWeather(data);
    } catch (err) {
      setError("Failed to fetch weather data");
      console.error(err);
      // Clear the reference on error so we can try again
      lastWeatherCityRef.current = null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchForecastForCity = useCallback(async (cityId: number) => {
    // Skip if we already have data for this city
    if (lastForecastCityRef.current === cityId) return;

    setIsForecastLoading(true);
    setError(null);
    lastForecastCityRef.current = cityId;

    try {
      const response = await fetch(
        `${FORECAST_ENDPOINT}${cityId}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch forecast data");
      }

      const data = await response.json();
      setForecast(data);
    } catch (err) {
      setError("Failed to fetch forecast data");
      console.error(err);
      // Clear the reference on error so we can try again
      lastForecastCityRef.current = null;
    } finally {
      setIsForecastLoading(false);
    }
  }, []);

  return {
    currentWeather,
    forecast,
    isLoading,
    isForecastLoading,
    error,
    fetchWeatherForCity,
    fetchForecastForCity,
  };
};
