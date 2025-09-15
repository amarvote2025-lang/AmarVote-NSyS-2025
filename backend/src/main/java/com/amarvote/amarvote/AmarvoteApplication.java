package com.amarvote.amarvote;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AmarvoteApplication {

	public static void main(String[] args) {
		SpringApplication.run(AmarvoteApplication.class, args);
	}

}
