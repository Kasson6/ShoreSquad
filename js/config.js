// Configuration management
export const config = {
    googleMapsApiKey: 'AIzaSyDsQ6dtbIV7F7MJSaOoeAMyTPdqy3lJnt4',
    weatherApiKey: process.env.WEATHER_API_KEY || '',
    maps: {
        defaultLocation: {
            lat: 1.381497,
            lng: 103.955574
        },
        defaultZoom: 15
    }
};

// Function to validate API keys are set
export function validateConfig() {
    if (!config.googleMapsApiKey) {
        console.error('Google Maps API key is not set. Please add it to your .env file.');
        return false;
    }
    return true;
}
