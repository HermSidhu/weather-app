export interface City {
  id: number;
  name: string;
  country: string;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  weather: Weather[];
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  wind: {
    speed: number;
  };
  clouds: {
    all: number;
  };
  name: string;
  timezone: number;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Weather[];
  wind: {
    speed: number;
  };
  clouds: {
    all: number;
  };
  dt_txt: string;
}

export interface ForecastData {
  list: ForecastItem[];
}

export type WeatherCondition =
  | "clear"
  | "clouds"
  | "rain"
  | "snow"
  | "thunderstorm"
  | "mist"
  | "default";
