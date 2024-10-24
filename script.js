let button=document.querySelector(".search");
let inputTxt=document.querySelector(".txt");
let humidity=document.querySelector(".humidity");
let windSpeed=document.querySelector(".wind-speed");
let weatherIcon=document.querySelector(".icon")
let temp=document.querySelector(".temp")
cityName=document.querySelector(".city");



async function getWeather(){
    const apiKey="39f7cfdbb9f8aa167a14b1194016c81b";
    const city=inputTxt.value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; 

 
    try {
        let result=await fetch(url);
        let data = await result.json();

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
button.addEventListener("click",getWeather)

