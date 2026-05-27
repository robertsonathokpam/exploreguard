import { auth } from '../firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Initialize Lucide Icons
lucide.createIcons();

onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = 'login.html';
});

// OpenWeatherMap free API key
const API_KEY = '6a021b2cbb192d2064328037610164a9';

window.searchCity = () => {
  const city = document.getElementById('city-input').value.trim();
  if (city) fetchWeather(city);
};

window.fetchWeather = async (city) => {
  const result = document.getElementById('weather-result');
  result.innerHTML = `
    <div class="loading">
      <i data-lucide="loader" class="animate-spin" style="width:24px; height:24px; color:var(--primary);"></i>
      <span>Contacting meteorology satellites...</span>
    </div>`;
  lucide.createIcons();
  
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${API_KEY}&units=metric`);
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();

    const temp = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const wind = Math.round(data.wind.speed * 3.6); // m/s to km/h
    const condition = data.weather[0].description;
    const visibility = data.visibility ? Math.round(data.visibility / 1000) : 'N/A';

    // Safety alert logic based on weather conditions
    let alertClass = 'alert-safe';
    let alertMsg = 'Weather looks optimal for sightseeing and transit operations.';
    let alertIcon = 'check-circle';
    
    if (data.weather[0].main === 'Thunderstorm') {
      alertClass = 'alert-danger';
      alertMsg = 'Severe Thunderstorm warnings active! Severe lightning threat, seek indoors immediately.';
      alertIcon = 'alert-circle';
    } else if (data.weather[0].main === 'Rain' && data.rain && data.rain['1h'] > 10) {
      alertClass = 'alert-warn';
      alertMsg = 'Heavy monsoon precipitation. High risk of torrential mudslides in montane paths. Drive cautiously.';
      alertIcon = 'alert-triangle';
    } else if (wind > 50) {
      alertClass = 'alert-warn';
      alertMsg = 'Substantial wind velocities. Exercise high caution on open road bypasses and valleys.';
      alertIcon = 'alert-triangle';
    } else if (data.weather[0].main === 'Fog' || visibility < 1) {
      alertClass = 'alert-warn';
      alertMsg = 'Impaired road visibility due to dense fog banks. Maximize headlight utilization.';
      alertIcon = 'alert-triangle';
    }

    result.innerHTML = `
      <div class="weather-card">
        <div class="weather-top">
          <div class="city-details">
            <div class="city-name"><i data-lucide="map-pin"></i> ${data.name}, ${data.sys.country}</div>
            <div class="condition"><i data-lucide="cloud"></i> ${condition}</div>
          </div>
          <div class="temp">${temp}°C</div>
        </div>
        <div class="weather-details">
          <div class="detail-item">
            <i data-lucide="droplets"></i>
            <div class="detail-val">${humidity}%</div>
            <div class="detail-key">Humidity</div>
          </div>
          <div class="detail-item">
            <i data-lucide="wind"></i>
            <div class="detail-val">${wind} km/h</div>
            <div class="detail-key">Wind Speed</div>
          </div>
          <div class="detail-item">
            <i data-lucide="eye"></i>
            <div class="detail-val">${visibility} km</div>
            <div class="detail-key">Visibility</div>
          </div>
          <div class="detail-item">
            <i data-lucide="thermometer"></i>
            <div class="detail-val">${Math.round(data.main.feels_like)}°C</div>
            <div class="detail-key">Feels Like</div>
          </div>
        </div>
        <div class="alert-box ${alertClass}">
          <i data-lucide="${alertIcon}" style="width:22px; height:22px; flex-shrink:0;"></i>
          <span><strong>Status Update:</strong> ${alertMsg}</span>
        </div>
      </div>`;
    lucide.createIcons();
  } catch (e) {
    result.innerHTML = `
      <div class="weather-card" style="border-color: rgba(231, 76, 60, 0.2);">
        <div class="alert-box alert-danger">
          <i data-lucide="alert-circle" style="width:22px;"></i>
          <span><strong>Satellite Outage:</strong> City could not be queried or network timeout. Please verify city name spelling.</span>
        </div>
      </div>`;
    lucide.createIcons();
  }
};

// Auto load Imphal weather on page open
fetchWeather('Imphal');
