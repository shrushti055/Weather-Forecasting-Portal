package com.weather.controller;

import com.weather.model.WeatherResponse;
import com.weather.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class WeatherController {

    @Autowired
    private WeatherService service;

    @GetMapping("/weather/{city}")
    public WeatherResponse getWeather(@PathVariable String city) {
        return service.getWeather(city);
    }
}
