package com.example.demo.entity;

import java.util.Date;

public class WoolResult {
	private int state;

	private Date end_time;

	public static WoolResult fail() {
		return new WoolResult(0);
	}

	public static WoolResult success(Date end_time) {
		return new WoolResult(1, end_time);
	}

	public WoolResult(int stage, Date end_time) {
		this.state = stage;
		this.end_time = end_time;
	}

	public WoolResult(int stage) {
		this.state = stage;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public Date getEnd_time() {
		return end_time;
	}

	public void setEnd_time(Date end_time) {
		this.end_time = end_time;
	}

}
