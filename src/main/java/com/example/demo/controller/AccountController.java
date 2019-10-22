package com.example.demo.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.example.demo.entity.Account;
import com.example.demo.entity.VipType;
import com.example.demo.repository.AccountRepo;

@RestController
public class AccountController {
	@Autowired
	private AccountRepo accountRepo;

	@GetMapping("/checkAccount")
	public Map<String, Object> findAccount(Account account) {
		
		

		Map<String, Object> res = new HashMap<>();
		res.put("state", 0);
		
		if(account == null || account.getCode() == null || account.getMeid() == null ) {
			return res;
		}

		Account storyAcc = accountRepo.findByCode(account.getCode());

		if (storyAcc == null) {
			return res;
		}

		if (storyAcc.getMeid() == null) {

			Date curr = new Date();

			storyAcc.setCreateTime(curr);
			storyAcc.setMeid(account.getMeid());

			if (storyAcc.getVipType() == VipType.DAY) {
				storyAcc.setEndTime(DateUtils.addDays(curr, 1));

			} else if (storyAcc.getVipType() == VipType.MONTH) {
				storyAcc.setEndTime(DateUtils.addMonths(curr, 1));

			} else if (storyAcc.getVipType() == VipType.QUARTER) {
				storyAcc.setEndTime(DateUtils.addMonths(curr, 3));

			} else if (storyAcc.getVipType() == VipType.YEAR) {
				storyAcc.setEndTime(DateUtils.addYears(curr, 1));

			}

			accountRepo.save(storyAcc);
			res.put("state", 1);
			res.put("end_time", storyAcc.getEndTime());
			return res;

		} else {
			Date curr = new Date();
			if (curr.compareTo(storyAcc.getEndTime()) < 0) {
				res.put("state", 1);
				res.put("end_time", storyAcc.getEndTime());
			}
		}

		return res;
	}

}
