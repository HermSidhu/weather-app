import "./WeatherAnimation.css";

interface WeatherAnimationProps {
  condition: string;
}

const WeatherAnimation = ({ condition }: WeatherAnimationProps) => {
  return (
    <div className="weather-animation-background">
      {condition === "clear" && (
        <>
          <div className="sun">☀️</div>
        </>
      )}

      {(condition === "clouds" || condition === "default") && (
        <>
          <div className="cloud cloud-1">☁️</div>
          <div className="cloud cloud-2">☁️</div>
          <div className="cloud cloud-3">🌤️</div>
        </>
      )}

      {condition === "rain" && (
        <>
          <div className="cloud cloud-1">☁️</div>
          <div className="cloud cloud-2">🌧️</div>
          <div className="rain"></div>
        </>
      )}

      {condition === "snow" && (
        <>
          <div className="cloud cloud-1">☁️</div>
          <div className="cloud cloud-2">❄️</div>
          <div className="snow"></div>
        </>
      )}

      {condition === "thunderstorm" && (
        <>
          <div className="cloud cloud-1">☁️</div>
          <div className="cloud cloud-2">⛈️</div>
          <div className="lightning"></div>
        </>
      )}
    </div>
  );
};

export default WeatherAnimation;
