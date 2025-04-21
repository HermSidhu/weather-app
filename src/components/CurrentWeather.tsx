import { CurrentWeather as CurrentWeatherType } from "../types/weather";

interface CurrentWeatherProps {
  data: CurrentWeatherType | null;
  isLoading: boolean;
  isForecastDay?: boolean;
  dayName?: string | null;
}

const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  return (
    <div className="weather-info">
      <div className="weather-main">
        {data?.weather[0]?.main}
        <div className="weather-description">
          {data?.weather[0]?.description}
        </div>
      </div>
      <div className="temperature">
        {data?.main && Math.round(data.main.temp)} °C
      </div>
      <div className="wind">Wind {data?.wind && data.wind.speed} m/sec</div>
    </div>
  );
};

export default CurrentWeather;
