const searchBtn=document.querySelector("#search")
const cityName=document.querySelector("#city")
const date=document.querySelector("#date")
const mainWeatherCondition=document.querySelector("#main-wc")
const weatherCondition=document.querySelector("#wc")
const temperature=document.querySelector("#temperature")
const pressure=document.querySelector("#pressure")
const humidity=document.querySelector("#humidity")
const windSpeed=document.querySelector("#wind-speed")
const direction=document.querySelector("#direction")
const errorBox=document.querySelector("#error")
const closeError=document.querySelector(".close-error")
const iconBox=document.querySelector(".iconBox") //accessing all html DOM elements

async function getWeather() { //creating an async function

   const placeName=document.querySelector("#input-box").value.trim()
   const city= placeName || "Pokhara" 
 //   const apiKey=`42e6f715cf9b164f4b6d985e594e448b`
 //   const apiUrl=`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=42e6f715cf9b164f4b6d985e594e448b&units=metric` //the API URL, it will fetch   the data of provided place name

 let url=`http://localhost/prototype2/weather.php?city=${city}`;

     try {


        let response = await fetch(url);

        console.log(response);
        
        if(!response.ok){
         throw new error (`Error fetching response status : ${response.status}`)
        }

        
        let data= await response.json() //for easy access, converting the response into JSON (Java Script Object Notation) format and storing it into "data" variable
        console.log(data)
        const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`

        const time=new Date() 
        const todayDate=time.toLocaleDateString()

        cityName.innerHTML=data.city 
        date.innerHTML=todayDate
        iconBox.src=iconUrl
        temperature.innerHTML=Math.round(data.temperature)+"°C" 
        mainWeatherCondition.innerHTML=data.mainWeatherCondition
        weatherCondition.innerHTML=data.weatherCondition
        pressure.innerHTML=data.pressure +" hPa" 
        humidity.innerHTML=data.humidity +"  %" 
        windSpeed.innerHTML=data.windSpeed + " m/s" 
        direction.innerHTML=data.direction + " °" 

     } catch (error) { //This handles the error, i.e the app will not crash suddenly, it will provide reason behind the error to the users
      console.log(error)
      errorBox.classList.remove("hidden")

     }

}
closeError.addEventListener("click",()=>{
   errorBox.classList.add("hidden")
})

getWeather() //intial call

searchBtn.addEventListener("click", () => {
   const placeName = document.querySelector("#input-box").value.trim();
   if (!placeName) {
       alert("Please enter a city name."); // Alert if input is empty
   } else {
       getWeather(); 
   }
});
