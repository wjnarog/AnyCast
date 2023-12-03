// *****************************************************
// <!-- Randomizer Button -->
// *****************************************************

let weatherData = null;

//when button is pressed, call the following function
document.getElementById('generate').addEventListener('click', function() {
    generateLandCoordinates();
});

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

function updateWeather(weatherData){
    const weatherInfo = document.getElementById('weather-info');
    
    if (weatherData) {
        const iconUrl = `https:${weatherData.condition.icon}`;
        weatherInfo.innerHTML = `
            <h2>Weather Information</h2>
            <p id="temperature">Temperature: ${weatherData.temp_c}°C</p>
            <img src="${iconUrl}" alt="Weather Icon">
            <p id="weather-condition">Condition: ${weatherData.condition.text}</p>
            <p id="humidity">Humidity: ${weatherData.humidity}%</p>
            <!-- Add more elements for additional information -->
        `;
    } else {
        weatherInfo.innerHTML = '<p>No weather information available</p>';
    }
}

function updateLocationInfo(locationInfo) {
    const locationInfoElement = document.getElementById('location-info');
    locationInfoElement.innerHTML = `
        <h2>Location Information</h2>
        <p>Name: ${locationInfo.name}</p>
        <p>Country: ${locationInfo.country}</p>
        <p>State: ${locationInfo.state}</p>
        <p>City: ${locationInfo.city}</p>
        <!-- Add more elements for additional information -->
    `;
}

