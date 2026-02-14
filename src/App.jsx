import { useState, useEffect } from 'react'
import './App.css'

const API_KEY = "285b31f1226172b245204b66404989b2"; 

function App() {
  const [city, setCity] = useState("Malang");
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const fetchWeather = async (searchCity) => {
    try {
      const cur = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric&lang=ru`).then(r => r.json());
      if (cur.cod !== 200) throw new Error(cur.message);

      const forData = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${API_KEY}&units=metric&lang=ru`).then(r => r.json());
      
      setWeather(cur);
      // Фильтруем прогноз по дням как в твоем app.js
      const daily = forData.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);
      setForecast(daily);
    } catch (err) {
      alert("Ошибка: " + err.message);
    }
  };

  useEffect(() => { fetchWeather(city); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input) fetchWeather(input);
  };

  if (!weather) return <div className="container">Загрузка...</div>;

  return (
    <div className="container">
      <div className="top-bar">
        <div className="city-info">
          <h2>{weather.name}, {weather.sys.country}</h2>
        </div>
      </div>

      <form className="search-box" onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search city..." 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
        />
        <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
      </form>

      <div className="main-weather">
        <div className="weather-icon-large">
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="weather" />
        </div>
        <h1 className="main-temp"><span>{Math.round(weather.main.temp)}</span>°</h1>
        <p className="weather-desc">{weather.weather[0].description}</p>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <i className="fa-solid fa-location-arrow"></i>
          <div className="text"><span>{weather.wind.speed} м/с</span><p>Wind</p></div>
        </div>
        <div className="detail-item">
          <i className="fa-solid fa-droplet"></i>
          <div className="text"><span>{weather.main.humidity}%</span><p>Humidity</p></div>
        </div>
      </div>

      <div className="forecast-section">
        <div className="forecast-scroll">
          {forecast.map((item, i) => (
            <div className="forecast-item" key={i}>
              <p>{item.dt_txt.split(" ")[0]}</p>
              <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="icon" />
              <p><strong>{Math.round(item.main.temp)}°</strong></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;