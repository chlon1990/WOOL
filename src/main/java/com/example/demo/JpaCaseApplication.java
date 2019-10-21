package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;
@EnableTransactionManagement
@EnableAutoConfiguration
@ComponentScan
@SpringBootApplication
public class JpaCaseApplication {

	public static void main(String[] args) {
		SpringApplication.run(JpaCaseApplication.class, args);
	}
	

}
