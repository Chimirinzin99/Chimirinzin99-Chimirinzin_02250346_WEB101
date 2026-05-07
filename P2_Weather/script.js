// Configuration and Constants
const WEATHER_API_KEY = 'ec1b2492a9b172502f8901fa96ade226';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const PLACEHOLDER_API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Global state to store saved locations
let savedLocations = [];

// DOM Elements and Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Tab navigation
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });

  // GET Weather
  document.getElementById('get-weather').addEventListener('click', getWeather);

  // POST Location
  document.getElementById('save-location').addEventListener('click', saveLocation);

  // PUT / Edit Modal
  document.getElementById('update-location').addEventListener('click', updateLocation);
  document.getElementById('cancel-edit').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
  });

  // Load saved locations
  fetchSavedLocations();
});

// Utility: Display API response info
function displayResponseInfo(method, url, status, data) {
  const responseInfo = document.getElementById('response-info');
  responseInfo.textContent = `Method: ${method}
URL: ${url}
Status: ${status}
Timestamp: ${new Date().toLocaleString()}

Data: ${JSON.stringify(data, null, 2)}`;
}

// GET Weather Implementation
async function getWeather() {
  const cityInput = document.getElementById('city-input');
  const city = cityInput.value.trim();

  if (!city) {
    alert('Please enter a city name');
    return;
  }

  const weatherResult = document.getElementById('weather-result');
  weatherResult.innerHTML = 'Loading...';

  try {
    const url = `${WEATHER_API_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    displayResponseInfo('GET', url.replace(WEATHER_API_KEY, 'API_KEY_HIDDEN'), response.status, data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch weather data');
    }

    // Display weather card
    weatherResult.innerHTML = `
      <div class="weather-card">
        <h3>${data.name}, ${data.sys.country}</h3>
        <div><strong>Weather:</strong> ${data.weather[0].main} - ${data.weather[0].description}</div>
        <div><strong>Temperature:</strong> ${data.main.temp}°C (Feels like: ${data.main.feels_like}°C)</div>
        <div><strong>Humidity:</strong> ${data.main.humidity}%</div>
        <div><strong>Wind:</strong> ${data.wind.speed} m/s</div>
      </div>
      <button id="quick-save" style="background-color: #27ae60;">Save This Location</button>
    `;

    // Quick save button
    document.getElementById('quick-save').addEventListener('click', () => {
      document.getElementById('location-name').value = `Weather in ${data.name}`;
      document.getElementById('location-city').value = data.name;
      document.getElementById('location-country').value = data.sys.country;
      document.getElementById('location-notes').value =
        `Temp: ${data.main.temp}°C, Weather: ${data.weather[0].description}`;

      document.querySelector('.tab[data-tab="post"]').click();
    });

  } catch (error) {
    weatherResult.innerHTML = `
      <div class="weather-card" style="border-left-color: #e74c3c;">
        <h3>Error</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// POST Location Implementation
async function saveLocation() {
  const name = document.getElementById('location-name').value.trim();
  const city = document.getElementById('location-city').value.trim();
  const country = document.getElementById('location-country').value.trim();
  const notes = document.getElementById('location-notes').value.trim();

  if (!name || !city) {
    alert('Please enter at least a name and city');
    return;
  }

  try {
    const locationData = {
      title: name,
      body: JSON.stringify({ city, country, notes }),
      userId: 1
    };

    const response = await fetch(PLACEHOLDER_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationData)
    });

    const data = await response.json();
    displayResponseInfo('POST', PLACEHOLDER_API_URL, response.status, data);

    if (!response.ok) throw new Error('Failed to save location');

    savedLocations.push({ id: data.id, name, city, country, notes });
    renderSavedLocations();

    // Clear form
    document.getElementById('location-name').value = '';
    document.getElementById('location-city').value = '';
    document.getElementById('location-country').value = '';
    document.getElementById('location-notes').value = '';

    document.querySelector('.tab[data-tab="saved"]').click();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Fetch saved locations (simulated)
async function fetchSavedLocations() {
  try {
    const response = await fetch(`${PLACEHOLDER_API_URL}?userId=1`);
    const data = await response.json();

    savedLocations = data.slice(0, 5).map(item => {
      let city = '', country = '', notes = '';
      try {
        const body = JSON.parse(item.body);
        city = body.city || 'Unknown City';
        country = body.country || '';
        notes = body.notes || '';
      } catch (e) {
        city = 'Unknown City';
        notes = item.body;
      }
      return { id: item.id, name: item.title, city, country, notes };
    });

    renderSavedLocations();
  } catch (error) {
    console.error('Error fetching saved locations:', error);
  }
}

// Render saved locations
function renderSavedLocations() {
  const container = document.getElementById('saved-locations');
  if (savedLocations.length === 0) {
    container.innerHTML = '<p>No saved locations. Add one in the "POST Location" tab.</p>';
    return;
  }

  container.innerHTML = savedLocations.map(loc => `
    <div class="location-item" data-id="${loc.id}">
      <h3>${loc.name}</h3>
      <div><strong>City:</strong> ${loc.city}</div>
      ${loc.country ? `<div><strong>Country:</strong> ${loc.country}</div>` : ''}
      ${loc.notes ? `<div><strong>Notes:</strong> ${loc.notes}</div>` : ''}
      <div class="location-actions">
        <button class="btn-edit" onclick="editLocation(${loc.id})">Edit</button>
        <button class="btn-delete" onclick="deleteLocation(${loc.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

// PUT: Show edit modal
function editLocation(id) {
  const loc = savedLocations.find(l => l.id === id);
  if (!loc) return;

  document.getElementById('edit-id').value = loc.id;
  document.getElementById('edit-name').value = loc.name;
  document.getElementById('edit-city').value = loc.city;
  document.getElementById('edit-country').value = loc.country;
  document.getElementById('edit-notes').value = loc.notes;

  document.getElementById('edit-modal').style.display = 'block';
}

// PUT: Update location
async function updateLocation() {
  const id = document.getElementById('edit-id').value;
  const name = document.getElementById('edit-name').value.trim();
  const city = document.getElementById('edit-city').value.trim();
  const country = document.getElementById('edit-country').value.trim();
  const notes = document.getElementById('edit-notes').value.trim();

  if (!name || !city) {
    alert('Please enter at least a name and city');
    return;
  }

  try {
    const locationData = { id, title: name, body: JSON.stringify({ city, country, notes }), userId: 1 };
    const response = await fetch(`${PLACEHOLDER_API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationData)
    });

    const data = await response.json();
    displayResponseInfo('PUT', `${PLACEHOLDER_API_URL}/${id}`, response.status, data);

    if (!response.ok) throw new Error('Failed to update location');

    const index = savedLocations.findIndex(l => Number(l.id) === Number(id));

if (index !== -1) {
  savedLocations[index] = {
    id: Number(id),
    name,
    city,
    country,
    notes
  };
} else {
  console.log("Update failed: ID not found");
}

    renderSavedLocations();
    document.getElementById('edit-modal').style.display = 'none';
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// DELETE Location
async function deleteLocation(id) {
  if (!confirm('Are you sure you want to delete this location?')) return;

  try {
    const response = await fetch(`${PLACEHOLDER_API_URL}/${id}`, { method: 'DELETE' });
    displayResponseInfo('DELETE', `${PLACEHOLDER_API_URL}/${id}`, response.status, { message: 'Resource deleted successfully!' });

    if (!response.ok) throw new Error('Failed to delete location');

    savedLocations = savedLocations.filter(l => l.id !== id);
    renderSavedLocations();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}