package com.tyreplus.dealer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TyrePlusDealerApplication {

    public static void main(String[] args) {
        SpringApplication.run(TyrePlusDealerApplication.class, args);
    }
}
