const API_KEY = "e409a667936e4abaada5a8208959bc58";

window.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");
    const cityInput = document.getElementById("cityInput");

    if (searchBtn) {
        searchBtn.addEventListener("click", searchWeather);
    }

    if (cityInput) {
        cityInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                searchWeather();
            }
        });
    }
});

async function searchWeather() {
    const cityInput = document.getElementById("cityInput");
    if (!cityInput) return;

    const city = cityInput.value.trim();
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    try {
 
        const curr = await fetch("http://localhost:8081/weather/" + encodeURIComponent(city));
        const current = await curr.json();

        document.getElementById("cityName").innerText = city;
        document.getElementById("temperature").innerText = (current.temp ?? "--") + "°";
        document.getElementById("weatherDesc").innerText = current.description ?? "--";

        document.getElementById("humidity").innerText =
            (current.humidity !== undefined ? current.humidity + "%" : "N/A");
        document.getElementById("wind").innerText =
            (current.wind !== undefined ? current.wind + " km/h" : "N/A");
        document.getElementById("uv").innerText =
            (current.uvi !== undefined ? current.uvi : "N/A");
        document.getElementById("dew").innerText =
            (current.dew_point !== undefined ? current.dew_point + "°" : "N/A");

        const now = new Date();
        document.getElementById("currentDate").innerText = now.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
        document.getElementById("currentTime").innerText = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
                city
            )}&appid=${API_KEY}&units=metric`
        );
        const forecast = await res.json();

        if (forecast.cod !== "200") {
            console.error("Forecast error:", forecast);
        } else {
            updateHourly(forecast.list);
            updateWeekly(forecast.list);
        }

        const mapFrame = document.getElementById("gmap");
        if (mapFrame) {
            mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(city)}&output=embed`;
        }

        
    } catch (err) {
        console.error("Error fetching weather data:", err);
        alert("Unable to fetch weather data. Please check city name or try again later.");
    }
}

function updateHourly(list) {
    const box = document.getElementById("hourlyBox");
    if (!box) return;

    box.innerHTML = "";
    list.slice(0, 8).forEach((item) => {
        const time = item.dt_txt.split(" ")[1].substring(0, 5);
        const temp = Math.round(item.main.temp);
        const icon = item.weather[0].icon;

        box.innerHTML += `
        <div class="hour">
            <p>${time}</p>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="">
            <h3>${temp}°</h3>
        </div>
        `;
    });
}

function updateWeekly(list) {
    const box = document.getElementById("weeklyBox");
    if (!box) return;

    box.innerHTML = "";

    // Pick entries at 12:00:00 -> one per day
    const daily = list.filter((item) => item.dt_txt.includes("12:00:00"));

    daily.forEach((day) => {
        const dateObj = new Date(day.dt_txt);

        const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" });
        const fullDate = dateObj.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
        });

        const max = Math.round(day.main.temp_max);
        const min = Math.round(day.main.temp_min);
        const icon = day.weather[0].icon;

        box.innerHTML += `
        <div class="day">
            <div>
                <span class="weekday">${weekday}</span>
                <span class="date">${fullDate}</span>
            </div>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="">
            <span>${max}° / ${min}°</span>
        </div>
        `;
    });
}

window.onload = () => {
    cityInput.value = "Baramati";
    searchWeather();
};


