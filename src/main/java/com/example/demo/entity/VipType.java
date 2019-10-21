package com.example.demo.entity;

public enum VipType {
	DAY(0), MONTH(1), QUARTER(2), YEAR(3);

	private VipType(int type) {
		this.type = type;
	};

	private int type;

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

}
