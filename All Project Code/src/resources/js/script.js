// *****************************************************
// <!-- Randomizer Button -->
// *****************************************************

let weatherData = null;

const boulderLat = 40.0150;
const boulderLng = -105.2705;

let currentLat = boulderLat;
let currentLng = boulderLng;


const generateButton = document.getElementById('generate');

// Add a click event listener to the button
generateButton.addEventListener('click', function() {
    document.getElementById('errorMessage').innerText = '';
    // Switch between Boulder and random coordinates
    if (currentLat === boulderLat && currentLng === boulderLng) {
        // If currently showing Boulder, switch to random coordinates
        generateRandomCoordinates();
    } else {
        // If currently showing random coordinates, switch to Boulder
        currentLat = boulderLat;
        currentLng = boulderLng;

        // Update the button text
        generateButton.innerText = 'Randomize';
    }

    // Call the function to get weather information for the current coordinates
    getWeatherInfo(currentLat, currentLng);
});

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Call the function to get weather information for Boulder when the page loads
    getWeatherInfo(boulderLat, boulderLng);
    
    // map implementation unfinished
    // var map = new maplibregl.Map({
    //     container: 'my-map',
    //     style: 'https://maps.geoapify.com/v1/styles/osm-bright-smooth/style.json?apiKey=ad0cddc0c26946eeafb204536230911',
    // });

});

async function generateRandomCoordinates() {
    let attempts = 0;
    const maxAttempts = 5; // adjust the number of attempts as needed

    try {
        while (attempts < maxAttempts) {
            const randomCoordinates = getRandomCoordinates();
            currentLat = randomCoordinates.lat;
            currentLng = randomCoordinates.lng;

            // Fetch weather data for the provided coordinates
            weatherData = await getWeatherData(currentLat, currentLng);

            // If weather data is available, break out of the loop
            if (weatherData) {
                // Update the button text
                generateButton.innerText = 'Back to Boulder';

                // Call the function to get weather information for the current coordinates
                getWeatherInfo(currentLat, currentLng);
                return;
            }

            // If weather data is not available, increment the attempts counter
            attempts++;
            console.log(`Attempt ${attempts}: Weather data not available, trying new coordinates...`);
        }

        // If max attempts reached and no weather data, handle it accordingly
        console.log(`Max attempts reached, weather data not available.`);
        document.getElementById('errorMessage').innerText = 'Weather data not available. Please try again.';
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('errorMessage').innerText = 'An error occurred. Please try again.';
    }
}


async function getWeatherInfo(lat, lng) {
    try {
        // Fetch weather data for the provided coordinates
        weatherData = await getWeatherData(lat, lng); // Remove the "let" keyword

        // Fetch location information for the provided coordinates
        const locationInfo = await getLocationInfo(lat, lng);

        // Display the coordinates
        document.getElementById('coordinates').innerText = `Coordinates: ${lat}, ${lng}`;

        // Display location information
        if (locationInfo) {
            updateLocationInfo(locationInfo);
        } else {
            console.log('Location information not available.');
        }

        // Display weather information
        console.log('Weather Data:', weatherData);
        updateWeather(weatherData);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('errorMessage').innerText = 'An error occurred. Please try again.';
    }
}


// Asynchronously find coordinates on land
async function generateLandCoordinates() {
    let coordinates = getRandomCoordinates();

    try {
        let isLand = await isOnLand(coordinates.lat, coordinates.lng);
        while (!isLand || weatherData === undefined) {
            if (!isLand) {
                console.log('Coordinates are not on land, trying again...');
            } else {
                console.log('Weather data not found, trying new coordinates...');
            }
            coordinates = getRandomCoordinates();
            isLand = await isOnLand(coordinates.lat, coordinates.lng);
            if (isLand) {
                weatherData = await getWeatherData(coordinates.lat, coordinates.lng);
            }
        }

        // plugs coordinate info into async function
        const locationInfo = await getLocationInfo(coordinates.lat, coordinates.lng);

        document.getElementById('coordinates').innerText = `Coordinates: ${coordinates.lat}, ${coordinates.lng}`;
        if (locationInfo) {
            updateLocationInfo(locationInfo);
        } else {
            console.log('Location information not available.');
        }

        document.getElementById('coordinates').innerText = `Coordinates: ${coordinates.lat}, ${coordinates.lng}`;
        // Fetch and display weather data for the land coordinates
        getWeatherData(coordinates.lat, coordinates.lng).then(weather => {
            console.log('Weather Data:', weatherData);
            updateWeather(weatherData);
            // Display weather data here
        });
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('errorMessage').innerText = 'An error occurred. Please try again.'; 
    }
}

// Function to check if coordinates are on land using iswater.io
async function isOnLand(lat, lng) {
    const response = await fetch(`https://isitwater-com.p.rapidapi.com/?latitude=${lat}&longitude=${lng}&rapidapi-key=3a932eef1fmsh42c524bd7674ff8p120ac4jsn43ea7bf6057c`);
    const data = await response.json();
    return !data.water;
}

function getRandomCoordinates() {
    const lat = Math.random() * 180 - 90; // Latitude from -90 to 90
    const lng = Math.random() * 360 - 180; // Longitude from -180 to 180
    return { lat, lng };
}

// Function to get weather data using WeatherAPI.com
async function getWeatherData(lat, lng) {
    const apiKey = 'ad0cddc0c26946eeafb204536230911'; // Replace with your actual API key
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lng}`;

    const response = await fetch(url);
    const data = await response.json();
    return data.current;
}

// function to get location data based on generated coordinates using reverse geocoding api
async function getLocationInfo(lat, lng) {
    const apiKey = '9a72f8c10f9f414db8c4efa65e7a9cbc'; // Replace with your actual API key
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        const locationInfo = response.data.features[0].properties;
        return locationInfo;
    } catch (error) {
        console.error('Error fetching location information:', error);
        return null;
    }
}

function updateLocationInfo(locationInfo) {
    const locationInfoElement = document.getElementById('location-info');
    locationInfoElement.innerHTML = `
        <div id="location-details">
            <p><strong> ${locationInfo.country}, ${locationInfo.state}, ${locationInfo.city}</strong></p>
        </div>
        <!-- Add more elements for additional information -->
    `;
}

function updateWeather(weatherData){
    const weatherInfo = document.getElementById('weather-info');
    
    if (weatherData) {
        const iconUrl = `https:${weatherData.condition.icon}`;
        weatherInfo.innerHTML = `
            <img src="${iconUrl}" alt="Weather Icon">
            <p id="temperature">Temperature: ${weatherData.temp_f}°F</p>
            <p id="weather-condition">Condition: ${weatherData.condition.text},  Feels like: ${weatherData.feelslike_f}°F</p>
            <p id="humidity">Humidity: ${weatherData.humidity}%,         Gusting: ${weatherData.gust_mph}mph</p>
            <!-- Add more elements for additional information -->
        `;
    } else {
        weatherInfo.innerHTML = '<p>No weather information available</p>';
    }
}


