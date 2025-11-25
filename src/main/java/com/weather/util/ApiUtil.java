package com.weather.util;

import org.springframework.web.client.RestTemplate;

public class ApiUtil {

    public static RestTemplate rest() {
        return new RestTemplate();
    }
}
