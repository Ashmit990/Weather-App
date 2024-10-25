let button=document.querySelector(".search");
let inputTxt=document.querySelector(".txt");
let humidity=document.querySelector(".humidity");
let windSpeed=document.querySelector(".wind-speed");
let weatherIcon=document.querySelector(".icon")
let temp=document.querySelector(".temp")
let myLocation=document.querySelector("#location")
cityName=document.querySelector(".city");
let miniContainer=document.querySelector(".mini-container")



async function getWeather(){
   
    const apiKey="39f7cfdbb9f8aa167a14b1194016c81b";
    const city=inputTxt.value;
    const url1 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&days=2`; 

 
    try {
        let result=await fetch(url1);
        let data = await result.json();
        miniContainer.style.display="block";

        console.log(data)

        temp.innerHTML=data.main.temp+"°C";
        cityName.innerHTML=data.name;
        humidity.innerHTML=data.main.humidity+"%";
        windSpeed.innerHTML=data.wind.speed+"m/s";

        if(data.weather[0].main==="Clear"){
        weatherIcon.src="clear.png"
         }
         else if(data.weather[0].main==="Rain"){
            weatherIcon.src="rain.png"
         }
         else if(data.weather[0].main==="Clouds"){
            weatherIcon.src="clouds.png"
         }
         else if(data.weather[0].main==="Drizzle"){
            weatherIcon.src="drizzle.png"
         }
         else if(data.weather[0].main==="Mist"){
            weatherIcon.src="mist.png"
         }

        } catch (error) {
        console.log(error);
    }
  


}

async function getMyLocation() {
   const apiKey = "39f7cfdbb9f8aa167a14b1194016c81b";

   navigator.geolocation.getCurrentPosition(async (position) => {
       const latitude = position.coords.latitude;
       const longitude = position.coords.longitude;
       const url2 = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

       try {
           let result = await fetch(url2);
           let data = await result.json();
           miniContainer.style.display = "block";

           console.log(data);

           temp.innerHTML = data.main.temp + "°C";
           cityName.innerHTML = data.name;
           humidity.innerHTML = data.main.humidity + "%";
           windSpeed.innerHTML = data.wind.speed + "m/s";

           if (data.weather[0].main === "Clear") {
               weatherIcon.src = "clear.png";
           } else if (data.weather[0].main === "Rain") {
               weatherIcon.src = "rain.png";
           } else if (data.weather[0].main === "Clouds") {
               weatherIcon.src = "clouds.png";
           } else if (data.weather[0].main === "Drizzle") {
               weatherIcon.src = "drizzle.png";
           } else if (data.weather[0].main === "Mist") {
               weatherIcon.src = "mist.png";
           }

       } catch (error) {
           console.log(error);
       }
   }, (error) => {
       console.error("Error getting location: ", error);
   });
}

myLocation.addEventListener("click",getMyLocation)

button.addEventListener("click",getWeather)

