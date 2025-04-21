# ☀️ Weather Forecast App

A modern, responsive weather application built with React, TypeScript, and Vite that provides current weather data and multi-day forecasts for cities around the world.

## 📸 Screenshots

### Desktop View

|                           Current Weather                            |                             Forecast View                              |
| :------------------------------------------------------------------: | :--------------------------------------------------------------------: |
| ![Current Weather Desktop](/screenshots/current_weather_desktop.png) | ![Forecast Weather Desktop](/screenshots/forecast_weather_desktop.png) |

### Mobile View

|                          Current Weather                           |                            Forecast View                             |
| :----------------------------------------------------------------: | :------------------------------------------------------------------: |
| ![Current Weather Mobile](/screenshots/current_weather_mobile.png) | ![Forecast Weather Mobile](/screenshots/forecast_weather_mobile.png) |

## ✨ Features

- **🌡️ Current Weather Display**: Shows temperature, weather conditions, and wind speed
- **📅 5-Day Forecast**: View weather forecasts for upcoming days
- **🌆 City Selection**: Choose from available cities to view their weather data
- **🌈 Dynamic Weather Animations**: Background and animations change based on current weather conditions
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Technologies Used

- **⚛️ React 19**: UI components and state management
- **📘 TypeScript**: Type-safe JavaScript
- **⚡ Vite**: Fast development and build tool
- **🌐 OpenWeatherMap API**: Weather data provider
- **🎨 CSS3**: Custom styling with responsive design

## 📁 Project Structure

```
weather-app/
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── CitySelector/   # City selection dropdown
│   │   ├── CurrentWeather/ # Current weather display
│   │   ├── Forecast/       # Weather forecast components
│   │   └── WeatherAnimation/ # Weather background animations
│   ├── config/             # Configuration files
│   │   └── cities.ts       # Available cities configuration
│   ├── helpers/            # Utility functions
│   │   ├── dateUtils.ts    # Date formatting utilities
│   │   ├── forecastUtils.ts # Forecast data processing
│   │   └── weatherUtils.ts # Weather-related helpers
│   ├── hooks/              # Custom React hooks
│   │   └── getWeather.ts   # Weather data fetching hook
│   ├── types/              # TypeScript type definitions
│   │   └── weather.ts      # Weather data types
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── App.css             # Main application styles
├── public/                 # Static assets
├── scripts/                # Build and development scripts
│   └── dev-server.js       # Custom dev server with QR code
└── .env                    # Environment variables (API keys)
```

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- OpenWeatherMap API key

### 💻 Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd weather-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and add your OpenWeatherMap API key:
   ```
   VITE_OPEN_WEATHER_MAP_API_KEY=your_api_key_here
   ```

### ▶️ Running the Application

Start the development server:

```bash
npm run dev
```

This will start the server and display:

- Local and network URLs for accessing the app
- A QR code you can scan to open the app on your mobile device

### 🏗️ Building for Production

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 🌍 Adding More Cities

To add more cities to the app:

1. Open `/src/config/cities.ts`
2. Add new city entries to the `CITIES` array:
   ```typescript
   export const CITIES: City[] = [
     // Existing cities...
     { id: 5128581, name: "New York", country: "US" },
     { id: 2643743, name: "London", country: "GB" },
   ];
   ```
3. Find city IDs by searching on [OpenWeatherMap](https://openweathermap.org/)

## 🏗️ Code Structure

The application follows a component-based architecture:

- **🧩 App.tsx**: Main component that orchestrates the application flow
- **🧱 Components**: Reusable UI elements for different parts of the application
- **🪝 Hooks**: Custom React hooks for data fetching and state management
- **🔧 Helpers**: Utility functions for data processing and formatting
- **📝 Types**: TypeScript interfaces and type definitions

## 🔌 API Usage

The app uses the following OpenWeatherMap API endpoints:

- Current weather: `api.openweathermap.org/data/2.5/weather`
- 5-day forecast: `api.openweathermap.org/data/2.5/forecast`

Data is fetched and managed through the custom `useWeather` hook.

## ⚖️ License

[MIT](https://choosealicense.com/licenses/mit/)
