import { ForecastData } from "../../types/weather";
import "./Forecast.css";

interface ForecastProps {
  data: ForecastData | null;
  isLoading: boolean;
  selectedDay: string;
}

const Forecast = ({ data, isLoading, selectedDay }: ForecastProps) => {
  if (isLoading) return <div className="loading">Loading forecast data...</div>;
  if (!data) return null;

  /**
   * Convert weather conditions to appropriate emoji icons
   */
  const getWeatherIcon = (condition: string) => {
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

  // Filter forecast data to show only the selected day
  const dayForecast = data.list.filter((item) => {
    const date = new Date(item.dt_txt);
    const dayStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    return dayStr === selectedDay;
  });

  // Target hours we want to display (9am, 12pm, 3pm, 6pm, 9pm)
  const targetHours = [9, 12, 15, 18, 21];

  /**
   * Find forecasts closest to our target hours without duplicates
   */
  const getForecastsForTargetHours = () => {
    const result = [];
    const usedForecasts = new Set();

    // First find exact or close matches to target hours
    for (const hour of targetHours) {
      let closest = null;
      let minDiff = Infinity;

      for (const forecast of dayForecast) {
        const date = new Date(forecast.dt_txt);
        const forecastHour = date.getHours();
        const diff = Math.abs(forecastHour - hour);

        if (diff < minDiff && !usedForecasts.has(forecast.dt_txt)) {
          minDiff = diff;
          closest = forecast;
        }
      }

      if (closest && minDiff <= 3) {
        result.push({
          ...closest,
          targetHour: hour,
        });
        usedForecasts.add(closest.dt_txt);
      }
    }

    // Fill remaining slots if needed
    if (result.length < targetHours.length) {
      for (const forecast of dayForecast) {
        if (!usedForecasts.has(forecast.dt_txt)) {
          result.push({
            ...forecast,
            targetHour: null,
          });
          usedForecasts.add(forecast.dt_txt);

          if (result.length >= targetHours.length) break;
        }
      }
    }

    return result.sort((a, b) => {
      const timeA = new Date(a.dt_txt).getTime();
      const timeB = new Date(b.dt_txt).getTime();
      return timeA - timeB;
    });
  };

  const filteredForecast = getForecastsForTargetHours();
  const displayForecasts =
    filteredForecast.length > 0 ? filteredForecast : dayForecast.slice(0, 5);

  /**
   * Format time display using either target hour or actual forecast time
   */
  const getDisplayTime = (
    item: ForecastData["list"][0] & { targetHour?: number | null }
  ) => {
    if (item.targetHour !== null && item.targetHour !== undefined) {
      const hour = item.targetHour % 12 || 12;
      const ampm = item.targetHour >= 12 ? "PM" : "AM";
      return `${hour}:00 ${ampm}`;
    } else {
      const date = new Date(item.dt_txt);
      const hours = date.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${displayHours}:00 ${ampm}`;
    }
  };

  return (
    <div className="forecast">
      <h2>Forecast for {selectedDay}</h2>
      <div className="forecast-grid">
        {displayForecasts.length > 0 ? (
          displayForecasts.map((item, index) => {
            return (
              <div className="forecast-card" key={index}>
                <div className="forecast-date">
                  <div>{getDisplayTime(item)}</div>
                </div>
                <div className="forecast-icon">
                  {getWeatherIcon(item.weather[0]?.description)}
                </div>
                <div className="forecast-temp">
                  <div className="forecast-temp-main">
                    {Math.round(item.main.temp)}°C
                  </div>
                  <div className="forecast-temp-minmax">
                    <span>Min: {Math.round(item.main.temp_min)}°C</span>
                    <span>Max: {Math.round(item.main.temp_max)}°C</span>
                  </div>
                </div>
                <div className="forecast-wind">
                  💨 Wind {item.wind.speed} m/sec
                </div>
                <div className="forecast-description">
                  {item.weather[0]?.description}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-forecast">
            <div className="no-forecast-icon">🔍</div>
            <h3>No Forecast Data Available</h3>
            <p>
              Weather forecast data for {selectedDay} is currently unavailable.
              This may be because:
            </p>
            <ul>
              <li>The forecast data hasn't been updated yet</li>
              <li>The selected date is too far in the future</li>
              <li>
                There was an issue retrieving data from the weather service
              </li>
            </ul>
            <p>Try selecting a different day or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecast;
