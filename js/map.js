// Map initialization and management
import { state } from './state.js';

let map;
let markers = [];

export function initializeMap() {
    // Create the map instance
    map = L.map('cleanup-map').setView([0, 0], 2);
    
    // Add the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // If we have user location, center the map there
    if (state.currentLocation) {
        map.setView([state.currentLocation.lat, state.currentLocation.lng], 13);
        addMarker(state.currentLocation.lat, state.currentLocation.lng, 'Your Location');
    }

    // Add sample cleanup events (these would come from an API/database in production)
    const sampleEvents = [
        {
            lat: state.currentLocation ? state.currentLocation.lat + 0.01 : 0,
            lng: state.currentLocation ? state.currentLocation.lng + 0.01 : 0,
            title: 'Weekend Beach Cleanup',
            date: '2025-06-15',
            participants: 12
        },
        {
            lat: state.currentLocation ? state.currentLocation.lat - 0.01 : 0,
            lng: state.currentLocation ? state.currentLocation.lng - 0.01 : 0,
            title: 'Community Shoreline Restoration',
            date: '2025-06-22',
            participants: 8
        }
    ];

    addCleanupEvents(sampleEvents);
}

function addMarker(lat, lng, title, isEvent = false) {
    const marker = L.marker([lat, lng], {
        icon: isEvent ? createEventIcon() : createUserIcon()
    });
    
    marker.addTo(map);
    markers.push(marker);
    
    if (title) {
        marker.bindPopup(title);
    }
    
    return marker;
}

function createEventIcon() {
    return L.divIcon({
        html: '<i class="fas fa-broom" style="color: #ff6b6b;"></i>',
        className: 'event-marker',
        iconSize: [30, 30]
    });
}

function createUserIcon() {
    return L.divIcon({
        html: '<i class="fas fa-user" style="color: #1a9cc7;"></i>',
        className: 'user-marker',
        iconSize: [30, 30]
    });
}

function addCleanupEvents(events) {
    events.forEach(event => {
        const marker = addMarker(event.lat, event.lng, null, true);
        const popupContent = `
            <div class="event-popup">
                <h3>${event.title}</h3>
                <p>Date: ${event.date}</p>
                <p>Participants: ${event.participants}</p>
                <button onclick="window.joinEvent('${event.title}')" class="popup-join-btn">Join Event</button>
            </div>
        `;
        marker.bindPopup(popupContent);
    });
}
