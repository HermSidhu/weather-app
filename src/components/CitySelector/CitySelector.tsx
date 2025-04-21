import { City } from "../../types/weather";
import "./CitySelector.css";

interface CitySelectorProps {
  cities: City[];
  selectedCity: City | null;
  onCityChange: (city: City) => void;
}

const CitySelector = ({
  cities,
  selectedCity,
  onCityChange,
}: CitySelectorProps) => {
  return (
    <div className="city-selector">
      <label htmlFor="city-select">City</label>
      <select
        id="city-select"
        value={selectedCity?.id || ""}
        onChange={(e) => {
          if (e.target.value) {
            const city = cities.find((c) => c.id === Number(e.target.value));
            if (city) onCityChange(city);
          }
        }}
      >
        <option value="" disabled={selectedCity !== null}>
          Select a city
        </option>
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}, {city.country}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CitySelector;
