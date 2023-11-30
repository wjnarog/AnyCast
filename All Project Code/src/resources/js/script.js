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

        document.getElementById('coordinates').innerText = `Coordinates: ${coordinates.lat}, ${coordinates.lng}`;
        // Fetch and display weather data for the land coordinates
        getWeatherData(coordinates.lat, coordinates.lng).then(weather => {
            console.log('Weather Data:', weatherData);
            updateWeather(weatherData);
        });
    } catch (error) {
        console.error('Error:', error);
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

function updateWeather(weatherData){
    if (weatherData) {
        document.getElementById('weatherLocation').innerText = weatherData.location.name + ', ' + weatherData.location.country;
        document.getElementById('weatherTemperature').innerText = weatherData.current.temp_c;
        document.getElementById('weatherWindSpeed').innerText = weatherData.current.wind_kph;
        document.getElementById('weatherHumidity').innerText = weatherData.current.humidity;
        document.getElementById('weatherCondition').innerText = weatherData.current.condition.text;
        document.getElementById('weatherCloud').innerText = weatherData.current.cloud;
        document.getElementById('weatherFeelsLike').innerText = weatherData.current.feelslike_c;
        document.getElementById('weatherIcon').src = weatherData.current.condition.icon;
    }
}