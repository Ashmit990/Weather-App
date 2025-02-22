<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-type: application/json");

$server = "localhost";
$username = "root";
$password = "";
$connection = mysqli_connect($server, $username, $password);

$createDb = "CREATE DATABASE IF NOT EXISTS weather_info";

if (!mysqli_query($connection, $createDb)) {
    die(json_encode(["error" => mysqli_connect_error()]));
}

mysqli_select_db($connection, 'weather_info');

// Create table with timestamp column
$createTable = "CREATE TABLE IF NOT EXISTS weather_datas(
    city VARCHAR(255),
    icon VARCHAR(255),
    temperature FLOAT NOT NULL,
    mainWeatherCondition VARCHAR(255),
    weatherCondition VARCHAR(255),
    pressure FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    windSpeed FLOAT NOT NULL,
    direction FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if (!mysqli_query($connection, $createTable)) {
    die(json_encode(["error" => "Table creation failed: " . mysqli_error($connection)]));
}

$cityName = isset($_GET['city']) ? $_GET['city'] : 'Pokhara';
$cityName = mysqli_real_escape_string($connection, $cityName);

$url = "https://api.openweathermap.org/data/2.5/weather?q=$cityName&appid=42e6f715cf9b164f4b6d985e594e448b&units=metric";

function fetching_weather($url)
{
    $json_data = file_get_contents($url);
    $data = json_decode($json_data, true);

    if (!$data || !isset($data["cod"]) || $data["cod"] != 200) {
        die(json_encode(["error" => "Failed to fetch weather data from API", "api_response" => $data]));
    }

    return $data;
} //fetches data from api and returns an associative array

function deleting_old_weather_data($connection, $city)
{
    // Delete records older than 2 hours
    $deleteQuery = "DELETE FROM weather_datas WHERE city='$city' AND created_at < NOW() - INTERVAL 2 HOUR";
    mysqli_query($connection, $deleteQuery);
}

function inserting_weather($connection, $datas)
{
    deleting_old_weather_data($connection, $datas["city"]); // Ensure old data is deleted before inserting

    $city = $datas["city"];
    $icon = $datas["icon"];
    $temperature = $datas["temperature"];
    $mainWeatherCondition = $datas["mainWeatherCondition"];
    $weatherCondition = $datas["weatherCondition"];
    $pressure = $datas["pressure"];
    $humidity = $datas["humidity"];
    $windSpeed = $datas["windSpeed"];
    $direction = $datas["direction"];

    $dataInserting = "INSERT INTO weather_datas 
                      (city, icon, temperature, mainWeatherCondition, weatherCondition, pressure, humidity, windSpeed, direction, created_at)
                      VALUES 
                      ('$city', '$icon', '$temperature', '$mainWeatherCondition', '$weatherCondition', '$pressure', '$humidity', '$windSpeed', '$direction', NOW())";

    if (!mysqli_query($connection, $dataInserting)) {
        die(json_encode(["error" => mysqli_error($connection)]));
    }
}

function getting_weather_from_database($connection, $city)
{
    // Fetch only data from the last 2 hours
    $dataGetting = "SELECT * FROM weather_datas WHERE city='$city' AND created_at >= NOW() - INTERVAL 2 HOUR LIMIT 1";
    $sql = mysqli_query($connection, $dataGetting);
    return ($sql && mysqli_num_rows($sql) > 0) ? mysqli_fetch_assoc($sql) : null;
}

function displayData($data)
{
    header("Content-Type: application/json");
    echo json_encode($data);
}

$dataFromDb = getting_weather_from_database($connection, $cityName);

if ($dataFromDb != null) {
    displayData($dataFromDb);
} else {
    $apiData = fetching_weather($url);
    $weatherData = [
        'city' => $apiData['name'],
        'icon' => $apiData['weather'][0]['icon'],
        'temperature' => $apiData['main']['temp'],
        'mainWeatherCondition' => $apiData['weather'][0]['main'],
        'weatherCondition' => $apiData['weather'][0]['description'],
        'pressure' => $apiData['main']['pressure'],
        'humidity' => $apiData['main']['humidity'],
        'windSpeed' => $apiData['wind']['speed'],
        'direction' => $apiData['wind']['deg'],
    ];
    inserting_weather($connection, $weatherData);
    $showResult = getting_weather_from_database($connection, $cityName);
    displayData($showResult);
}
?>

