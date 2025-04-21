import { useState, useEffect, useCallback } from "react";
import CitySelector from "./components/CitySelector";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast/Forecast";
import WeatherAnimation from "./components/WeatherAnimation/WeatherAnimation";
import { useWeather } from "./hooks/getWeather";
import { extractUniqueDays, getDayForecastData } from "./helpers/forecastUtils";
import { getWeatherConditionClass } from "./helpers/weatherUtils";
import { CITIES } from "./config/cities";
import "./App.css";
import { City, WeatherCondition } from "./types/weather";

/**
 * Format today's date for display in the UI header
 */
const getTodayDateString = (): string => {
  const today = new Date();
  return today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

function App() {
  const {
    currentWeather,
    forecast,
    isLoading,
    isForecastLoading,
    error: weatherError,
    fetchWeatherForCity,
    fetchForecastForCity,
  } = useWeather();

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showForecast, setShowForecast] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [weatherCondition, setWeatherCondition] =
    useState<WeatherCondition>("default");

  /**
   * Process forecast data and update UI state
   */
  const processForecastData = useCallback(() => {
    if (!forecast) return;

    const uniqueDays = extractUniqueDays(forecast);
    setAvailableDays(uniqueDays);

    if (uniqueDays.length > 0 && selectedDay === null) {
      setSelectedDay(0);
    }
  }, [forecast, selectedDay]);

  /**
   * Fetch and process forecast data with better error handling
   */
  const fetchForecastData = useCallback(async () => {
    if (!selectedCity) return;

    try {
      if (!forecast) {
        await fetchForecastForCity(selectedCity.id);
      }

      processForecastData();
    } catch (err) {
      // Explicitly handle fetch errors
      setError(
        `Failed to fetch forecast: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }, [selectedCity, forecast, fetchForecastForCity, processForecastData]);

  /**
   * Get the weather condition class based on the current weather
   */
  useEffect(() => {
    // Handle error updates
    if (weatherError) {
      setError(weatherError);
    }
  }, [weatherError]);

  // Fetch current weather when a city is selected
  useEffect(() => {
    if (selectedCity) {
      fetchWeatherForCity(selectedCity.id);
    }
  }, [selectedCity, fetchWeatherForCity]);

  // Separate effect for processing forecast data
  useEffect(() => {
    if (forecast && availableDays.length === 0) {
      processForecastData();
    }
  }, [forecast, availableDays.length, processForecastData]);

  // Add this new effect to update weather condition when current weather changes
  useEffect(() => {
    if (currentWeather?.weather && currentWeather.weather.length > 0) {
      const condition = getWeatherConditionClass(
        currentWeather.weather[0]?.main || ""
      );
      setWeatherCondition(condition as WeatherCondition);
    }
  }, [currentWeather]);

  const handleCityChange = (city: City) => {
    setSelectedCity(city);
    setShowForecast(false);
    setSelectedDay(null);
    setAvailableDays([]);
    setWeatherCondition("default");
  };

  const handleDaySelect = (index: number) => {
    if (!forecast) {
      fetchForecastData();
      return;
    }

    setSelectedDay(index);

    // Update weather condition based on selected day using helper function
    const dayData = getDayForecastData(forecast, availableDays[index]);
    if (dayData.length > 0) {
      const condition = getWeatherConditionClass(
        dayData[0].weather[0]?.main || ""
      );
      setWeatherCondition(condition as WeatherCondition);
    }
  };

  const toggleForecast = async () => {
    if (!showForecast) {
      // First set the UI state
      setShowForecast(true);

      // Then fetch data if needed
      if (selectedCity && !forecast) {
        await fetchForecastForCity(selectedCity.id);
      } else if (selectedDay === null && availableDays.length > 0) {
        setSelectedDay(0);
      }
    } else {
      setShowForecast(false);
    }
  };

  return (
    <div className={`weather-app weather-${weatherCondition}`}>
      {/* Use the WeatherAnimation component instead of inline JSX */}
      <WeatherAnimation condition={weatherCondition} />

      <div className="weather-content">
        <h1>Weather Forecast</h1>
        <h2 className="today-date">{getTodayDateString()}</h2>

        <CitySelector
          cities={CITIES}
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
        />

        {!selectedCity ? (
          <div className="no-city-selected">
            <p>Please select a city to view weather information</p>
          </div>
        ) : (
          <>
            {error && <div className="error">{error}</div>}

            <div className="current-weather-section">
              <h3 className="section-title">Current Weather</h3>
              <CurrentWeather data={currentWeather} isLoading={isLoading} />
            </div>

            <div className="forecast-controls">
              <button className="forecast-button" onClick={toggleForecast}>
                {showForecast ? "CLOSE FORECAST" : "SHOW FORECAST"}
              </button>
            </div>

            {showForecast && (
              <div className="forecast-container">
                {isForecastLoading ? (
                  <div className="loading">Loading forecast data...</div>
                ) : availableDays.length === 0 ? (
                  <div className="error">No forecast data available</div>
                ) : (
                  <>
                    <div className="day-selector">
                      <div className="day-buttons">
                        {availableDays.map((day, index) => (
                          <button
                            key={index}
                            className={`day-button ${
                              selectedDay === index ? "active" : ""
                            }`}
                            onClick={() => handleDaySelect(index)}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedDay !== null && (
                      <Forecast
                        data={forecast}
                        isLoading={false}
                        selectedDay={availableDays[selectedDay]}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
