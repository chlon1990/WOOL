package com.example.demo;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import java.util.TimeZone;

public class ApplicationStartup implements ApplicationListener<ContextRefreshedEvent> {

	@Override
	public void onApplicationEvent(ContextRefreshedEvent event) {
		initTz();
	}

	private void initTz() {
		TimeZone.setDefault( TimeZone.getTimeZone("Asia/Shanghai"));
	}
	

}