package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class indexController {
	@RequestMapping(value = "/")
	@ResponseBody
	public ModelAndView uploadPage(ModelAndView model) {
		model.setViewName("index.html");
		return model;
	}
}
