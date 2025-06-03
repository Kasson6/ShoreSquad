// State management for the application
export const state = {
    currentLocation: null,
    weatherData: null,
    events: [],
    userProfile: null,
    mainImage: 'images/main.gif'  // Add main image state
};

// Action types
export const actions = {
    SET_LOCATION: 'SET_LOCATION',
    SET_WEATHER: 'SET_WEATHER',
    ADD_EVENT: 'ADD_EVENT',
    SET_USER: 'SET_USER',
    SET_MAIN_IMAGE: 'SET_MAIN_IMAGE'  // Add main image action
};

// State updates
export function updateState(action, payload) {
    console.log('State update:', action, payload);
    switch (action) {
        case actions.SET_LOCATION:
            state.currentLocation = payload;
            break;
        case actions.SET_WEATHER:
            state.weatherData = payload;
            break;
        case actions.ADD_EVENT:
            state.events.push(payload);
            break;
        case actions.SET_USER:
            state.userProfile = payload;
            break;
        case actions.SET_MAIN_IMAGE:
            state.mainImage = payload;
            break;
        default:
            console.warn('Unknown action type:', action);
    }
    
    // Trigger any subscribers
    notifySubscribers();
}

// Observer pattern for state changes
const subscribers = new Set();

export function subscribe(callback) {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
}

function notifySubscribers() {
    subscribers.forEach(callback => callback(state));
}
