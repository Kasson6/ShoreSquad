// Weather widget implementation using data.gov.sg
import { state, actions, updateState } from './state.js';

const API_ENDPOINTS = {
    twoHour: 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast',
    twentyFourHour: 'https://api.data.gov.sg/v1/environment/24-hour-weather-forecast',
    fourDay: 'https://api.data.gov.sg/v1/environment/4-day-weather-forecast',
    temperature: 'https://api.data.gov.sg/v1/environment/air-temperature',
    humidity: 'https://api.data.gov.sg/v1/environment/relative-humidity',
    rainfall: 'https://api.data.gov.sg/v1/environment/rainfall',
    uvIndex: 'https://api.data.gov.sg/v1/environment/uv-index',
    pm25: 'https://api.data.gov.sg/v1/environment/pm25'
};

// Jujutsu Kaisen themed weather descriptions
const WEATHER_DESCRIPTIONS = {
    'Fair': 'Domain Clear: Gojo\'s Infinity',
    'Cloudy': 'Domain Shrouded: Megumi\'s Ten Shadows',
    'Light Rain': 'Domain Technique: Light Rain Curse',
    'Moderate Rain': 'Cursed Technique: Rain Formation',
    'Heavy Rain': 'Maximum: Torrential Curse',
    'Showers': 'Domain Expansion: Rain Shower',
    'Thundery Showers': 'Domain: Thunder and Lightning',
    'Heavy Thundery Showers': 'Unlimited Void: Storm Formation',
    'Heavy Thundery Showers with Gusty Winds': 'Maximum: Cursed Storm Vortex',
    'Partly Cloudy': 'Domain Barrier: Partial Cover',
    'Hazy': 'Domain Veil: Cursed Mist',
    'Windy': 'Domain Wind: Cursed Breeze'
};

// Weather icon mapping for Font Awesome icons
const WEATHER_ICONS = {
    // Basic conditions
    'Fair': 'sun',
    'Fair (Day)': 'sun',
    'Fair (Night)': 'moon',
    'Fair & Warm': 'sun',
    'Partly Cloudy': 'cloud-sun',
    'Partly Cloudy (Day)': 'cloud-sun',
    'Partly Cloudy (Night)': 'cloud-moon',
    'Cloudy': 'cloud',
    
    // Rain conditions
    'Light Rain': 'cloud-rain',
    'Moderate Rain': 'cloud-showers-heavy',
    'Heavy Rain': 'cloud-showers-heavy',
    'Showers': 'cloud-rain',
    'Light Showers': 'cloud-sun-rain',
    'Passing Showers': 'cloud-sun-rain',
    'Thundery Showers': 'cloud-bolt',
    'Heavy Thundery Showers': 'cloud-bolt',
    'Heavy Thundery Showers with Gusty Winds': 'cloud-bolt wind',
    
    // Special conditions
    'Windy': 'wind',
    'Mist': 'smog',
    'Hazy': 'smog',
    'Slightly Hazy': 'smog',
    'Strong Winds': 'wind',
    'Snow': 'snowflake', // Just in case! 😄
    'Heavy Thundery Showers with Gusty Winds': 'wind'
};

async function fetchWeatherData() {
    try {
        console.log('Initiating Domain Expansion: Weather Reading...');
        const today = new Date().toISOString().split('T')[0];
        const dateTime = new Date().toISOString();
        
        // Add cursed energy visualization effect
        const weatherSection = document.querySelector('.weather-section');
        if (weatherSection) {
            weatherSection.classList.add('domain-active');
        }

        const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            try {
                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal
                });
                clearTimeout(id);
                if (!response.ok) {
                    throw new Error(`Domain barrier encountered: ${response.status}`);
                }
                return response;
            } catch (error) {
                clearTimeout(id);
                if (error.name === 'AbortError') {
                    throw new Error('Domain collapsed: Request timed out');
                }
                throw error;
            }
        };

        const fetchOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        };

        // Fetch all endpoints
        const [fourDayRes, shortTermRes, twentyFourHourRes, temperatureRes, humidityRes, rainfallRes] = await Promise.allSettled([
            fetchWithTimeout(`${API_ENDPOINTS.fourDay}?date=${today}`, fetchOptions),
            fetchWithTimeout(`${API_ENDPOINTS.twoHour}?date=${today}`, fetchOptions),
            fetchWithTimeout(`${API_ENDPOINTS.twentyFourHour}?date=${today}`, fetchOptions),
            fetchWithTimeout(`${API_ENDPOINTS.temperature}?date_time=${dateTime}`, fetchOptions),
            fetchWithTimeout(`${API_ENDPOINTS.humidity}?date_time=${dateTime}`, fetchOptions),
            fetchWithTimeout(`${API_ENDPOINTS.rainfall}?date_time=${dateTime}`, fetchOptions)
        ]);

        // Process responses
        const results = await Promise.all([
            fourDayRes.status === 'fulfilled' ? fourDayRes.value.json() : { items: [] },
            shortTermRes.status === 'fulfilled' ? shortTermRes.value.json() : { items: [] },
            twentyFourHourRes.status === 'fulfilled' ? twentyFourHourRes.value.json() : { items: [] },
            temperatureRes.status === 'fulfilled' ? temperatureRes.value.json() : { items: [] },
            humidityRes.status === 'fulfilled' ? humidityRes.value.json() : { items: [] },
            rainfallRes.status === 'fulfilled' ? rainfallRes.value.json() : { items: [] }
        ]);

        const [fourDay, shortTerm, twentyFourHour, temperature, humidity, rainfall] = results;

        // Log successful responses for debugging
        console.log('API Responses:', {
            fourDay,
            shortTerm,
            twentyFourHour,
            temperature,
            humidity,
            rainfall
        });

        if (!fourDay.items) {
            throw new Error('Failed to fetch 4-day forecast data');
        }

        return {
            shortTerm,
            twentyFourHour,
            fourDay,
            temperature,
            humidity,
            rainfall
        };
    } catch (error) {
        console.error('Cursed technique interrupted:', error);
        throw error;
    }
}

export async function initializeWeatherWidget() {
    try {
        console.log('Initializing weather widget...');
        const data = await fetchWeatherData();
        console.log('Weather data fetched:', data);
        const combinedData = processWeatherData(data);
        console.log('Processed weather data:', combinedData);
        updateState(actions.SET_WEATHER, combinedData);
        renderWeatherWidget(combinedData);

        // Update weather every 30 minutes
        setInterval(async () => {
            try {
                const newData = await fetchWeatherData();
                const newCombinedData = processWeatherData(newData);
                updateState(actions.SET_WEATHER, newCombinedData);
                renderWeatherWidget(newCombinedData);
            } catch (error) {
                console.error('Error updating weather:', error);
            }
        }, 30 * 60 * 1000);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showWeatherError(error);
    }
}

function processWeatherData(data) {
    const currentArea = 'Pasir Ris';
    
    // Get current weather with enhanced error handling and JJK theming
    const currentWeather = data.shortTerm.items?.[0]?.forecasts?.find(
        f => f.area.toLowerCase() === currentArea.toLowerCase()
    ) || {
        forecast: 'Domain Interference',
        temperature: { low: 24, high: 32 },
        relative_humidity: { low: 60, high: 90 }
    };

    // Get current readings
    const currentTemp = data.temperature.items?.[0]?.readings?.find(
        r => r.station_id.toLowerCase().includes('pasir ris')
    );
    const currentHumidity = data.humidity.items?.[0]?.readings?.find(
        r => r.station_id.toLowerCase().includes('pasir ris')
    );
    const currentRainfall = data.rainfall.items?.[0]?.readings?.find(
        r => r.station_id.toLowerCase().includes('pasir ris')
    );

    // Get 24-hour forecast
    const dayForecast = data.twentyFourHour.items?.[0];

    // Process 4-day forecast with JJK themes
    const dailyForecasts = [];
    const forecasts = data.fourDay?.items?.[0]?.forecasts;
    
    if (Array.isArray(forecasts)) {
        forecasts.forEach(day => {
            try {
                const weather = day.forecast || 'Partly Cloudy';
                dailyForecasts.push({
                    date: new Date(day.date),
                    tempLow: day.temperature?.low || 24,
                    tempHigh: day.temperature?.high || 32,
                    weather: weather,
                    weatherDescription: WEATHER_DESCRIPTIONS[weather] || 'Domain State Unknown',
                    humidity: {
                        low: day.relative_humidity?.low || 60,
                        high: day.relative_humidity?.high || 90
                    },
                    wind: {
                        speed: { 
                            low: day.wind?.speed?.low || 0,
                            high: day.wind?.speed?.high || 25
                        },
                        direction: day.wind?.direction || 'Variable'
                    },
                    icon: WEATHER_ICONS[weather] || 'cloud'
                });
            } catch (error) {
                console.error('Error processing forecast day:', error);
            }
        });
    }

    const result = {
        current: {
            weather: currentWeather?.forecast || 'Partly Cloudy',
            weatherDescription: WEATHER_DESCRIPTIONS[currentWeather?.forecast] || 'Domain State Unknown',
            temperature: {
                current: currentTemp?.value || 28,
                low: dayForecast?.general?.temperature?.low || 24,
                high: dayForecast?.general?.temperature?.high || 32
            },
            humidity: {
                current: currentHumidity?.value || 75,
                low: dayForecast?.general?.relative_humidity?.low || 60,
                high: dayForecast?.general?.relative_humidity?.high || 90
            },
            wind: dayForecast?.general?.wind || { 
                speed: { low: 15, high: 25 }, 
                direction: 'Variable' 
            },
            rainfall: currentRainfall?.value ? `${currentRainfall.value}mm in last hour` : 'No rainfall',
            icon: WEATHER_ICONS[currentWeather?.forecast] || 'cloud',
            timestamp: new Date()
        },
        daily: dailyForecasts
    };

    return result;
}

function renderWeatherWidget(data) {
    const weatherContainer = document.querySelector('.weather-widget') || createWeatherWidget();
    const { current, daily } = data;

    // Clear existing content
    weatherContainer.innerHTML = '';

    // Add background image and effects
    const backgroundImg = document.createElement('div');
    backgroundImg.className = 'weather-background cursed-energy-background';
    backgroundImg.style.backgroundImage = 'url("images/lol.jpg")';
    weatherContainer.appendChild(backgroundImg);
    
    // Create header with current conditions
    const header = document.createElement('div');
    header.className = 'weather-header';
    
    // Render the current weather with JJK theme
    header.innerHTML = `
        <div class="domain-barrier">
            <div class="cursed-seal-container">
                <div class="cursed-seal-inner"></div>
                <div class="cursed-seal-outer"></div>
            </div>
            <h2>Gojo's Domain Expansion: Infinite Weather</h2>
            <p class="domain-subtitle">${current.weatherDescription}</p>
        </div>
        <div class="current-conditions">
            <div class="current-weather">
                <div class="weather-icon-wrapper ${getWeatherEffectClass(current.weather)}">
                    <i class="fas fa-${current.icon} weather-icon"></i>
                    <div class="cursed-energy-effect" data-energy="${current.humidity.current}"></div>
                </div>
                <div class="temp-container">
                    <div class="temp">${current.temperature.current?.toFixed(1) || 'N/A'}°C</div>
                    <div class="cursed-energy-meter">
                        <div class="meter-fill" style="height: ${current.humidity.current}%"></div>
                        <div class="meter-label">Cursed Energy Level</div>
                    </div>
                </div>
                <div class="weather-details">
                    <div class="weather-text">${current.weather}</div>
                    <div class="weather-description">${current.weatherDescription}</div>
                </div>
            </div>
            <div class="current-details">
                <div class="detail-item">
                    <i class="fas fa-infinity"></i>
                    <span>Cursed Energy Density: ${current.humidity.current?.toFixed(0) || 'N/A'}%</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-cloud-rain"></i>
                    <span>Limitless Technique: ${current.rainfall}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-wind"></i>
                    <span>Domain Wind: ${current.wind.direction}, ${current.wind.speed.low}-${current.wind.speed.high} km/h</span>
                </div>
            </div>
        </div>
    `;
    weatherContainer.appendChild(header);

    // Create forecast container with enhanced JJK styling
    const forecastContainer = document.createElement('div');
    forecastContainer.className = 'forecast-container';
    forecastContainer.innerHTML = '<h3>Four-Day Domain Forecast</h3>';

    // Add daily forecasts with enhanced JJK theme
    daily.forEach(forecast => {
        const dayCard = document.createElement('div');
        dayCard.className = `forecast-day ${getWeatherEffectClass(forecast.weather)}`;
        dayCard.innerHTML = `
            <div class="cursed-energy-background"></div>
            <div class="day-content">
                <div class="day-name">${formatDate(forecast.date)}</div>
                <div class="forecast-icon-wrapper">
                    <i class="fas fa-${forecast.icon} weather-icon"></i>
                    <div class="cursed-energy-effect mini"></div>
                </div>
                <div class="forecast-text">${forecast.weather}</div>
                <div class="forecast-description">${forecast.weatherDescription}</div>
                <div class="temperature-range">
                    <div class="temp-item high">
                        <i class="fas fa-fire"></i>
                        <span>${forecast.tempHigh}°C</span>
                    </div>
                    <div class="temp-item low">
                        <i class="fas fa-snowflake"></i>
                        <span>${forecast.tempLow}°C</span>
                    </div>
                </div>
                <div class="forecast-details">
                    <div class="detail-item">
                        <i class="fas fa-infinity"></i>
                        <span>Cursed Energy: ${forecast.humidity.low}-${forecast.humidity.high}%</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-wind"></i>
                        <span>${forecast.wind.direction}, ${forecast.wind.speed.low}-${forecast.wind.speed.high} km/h</span>
                    </div>
                </div>
            </div>
        `;
        
        forecastContainer.appendChild(dayCard);
    });

    weatherContainer.appendChild(forecastContainer);
}

function createWeatherWidget() {
    console.log('Creating weather widget...');
    
    let container = document.getElementById('weather-widget');
    console.log('Existing container:', container);
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'weather-widget';
        container.className = 'weather-widget';
        console.log('Created new container:', container);

        const weatherSection = document.querySelector('.weather-section');
        console.log('Found weather section:', weatherSection);
        
        if (weatherSection) {
            // Add JJK-themed loading state
            container.innerHTML = `
                <div class="weather-loading">
                    <div class="cursed-seal-loading">
                        <div class="seal-ring"></div>
                        <div class="seal-core">
                            <i class="fas fa-infinity fa-spin"></i>
                        </div>
                    </div>
                    <h3>Opening Domain Expansion</h3>
                    <p>Gathering Cursed Energy...</p>
                </div>
            `;
            weatherSection.appendChild(container);
            console.log('Added container to weather section');
        } else {
            console.error('Domain barrier error: Weather section not found');
        }
    }
    return container;
}

function formatDate(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
}

function showWeatherError(error) {
    const weatherContainer = document.querySelector('.weather-widget') || createWeatherWidget();
    weatherContainer.innerHTML = `
        <div class="weather-error domain-interference">
            <div class="cursed-seal"></div>
            <i class="fas fa-exclamation-circle pulse"></i>
            <h3>Domain Barrier Interference Detected</h3>
            <p class="error-details">${error.message}</p>
            <button class="retry-button infinity" onclick="window.initializeWeatherWidget()">
                <i class="fas fa-yin-yang fa-spin"></i>
                Strengthen Domain
            </button>
            <div class="cursed-energy-waves"></div>
        </div>
    `;
}

// Weather widget display enhancement
function updateWeatherDisplay(data) {
    const widget = document.getElementById('weather-widget');
    
    try {
        const { temperature, humidity, conditions, forecast } = processWeatherData(data);
        
        widget.innerHTML = `
            <div class="weather-card">
                <div class="cursed-energy-indicator" style="opacity: ${Math.min(humidity / 100, 0.8)}">
                    <i class="fas fa-${WEATHER_ICONS[conditions] || 'question'}" aria-hidden="true"></i>
                </div>
                <div class="weather-info">
                    <h3>Domain Conditions</h3>
                    <p class="temperature">${temperature}°C</p>
                    <p class="conditions">${conditions}</p>
                    <p class="humidity">Cursed Energy Density: ${humidity}%</p>
                    <div class="forecast">
                        <h4>Domain Forecast</h4>
                        <p>${forecast}</p>
                    </div>
                </div>
            </div>
        `;
        
        // Add cursed energy particle effects
        addWeatherParticleEffects(widget, conditions);
    } catch (error) {
        widget.innerHTML = `
            <div class="weather-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>Domain barrier interference detected</p>
                <p class="error-details">${error.message}</p>
                <button class="retry-button" onclick="initializeWeatherWidget()">
                    Strengthen Domain
                </button>
            </div>
        `;
    }
}

function getWeatherEffectClass(weather) {
    const weatherLower = weather.toLowerCase();
    const effects = [];
    
    if (weatherLower.includes('rain')) {
        effects.push('rainfall-effect');
    }
    if (weatherLower.includes('thunder')) {
        effects.push('thunder-effect');
    }
    if (weatherLower.includes('wind') || weatherLower.includes('gusty')) {
        effects.push('wind-effect');
    }
    if (weatherLower.includes('hazy') || weatherLower.includes('mist')) {
        effects.push('haze-effect');
    }
    
    return effects.join(' ');
}
