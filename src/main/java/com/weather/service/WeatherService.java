package com.weather.service;

import com.weather.model.WeatherResponse;
import com.weather.util.ApiUtil;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {

    @Value("${openweather.api.key}")
    private String apiKey;

    public WeatherResponse getWeather(String city) {

        try {

            String url = "https://api.openweathermap.org/data/2.5/weather?q=" 
                    + city + "&appid=" + apiKey + "&units=metric";

            String response = ApiUtil.rest().getForObject(url, String.class);
            JSONObject obj = new JSONObject(response);

            JSONObject main = obj.getJSONObject("main");
            JSONObject wind = obj.getJSONObject("wind");
            JSONArray weatherArr = obj.getJSONArray("weather");
            JSONObject weatherObj = weatherArr.getJSONObject(0);

            WeatherResponse wr = new WeatherResponse();
            wr.setTemp(main.getDouble("temp"));
            wr.setHumidity(main.getInt("humidity"));
            wr.setWind(wind.getDouble("speed"));
            wr.setDescription(weatherObj.getString("description"));

            double temp = main.getDouble("temp");
            double humidity = main.getDouble("humidity");
            wr.setDewPoint(temp - ((100 - humidity) / 5));

            wr.setUv(-1);

            return wr;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

