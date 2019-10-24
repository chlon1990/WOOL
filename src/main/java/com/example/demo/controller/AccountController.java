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
import com.example.demo.entity.WoolResult;
import com.example.demo.repository.AccountRepo;

@RestController
public class AccountController {
	@Autowired
	private AccountRepo accountRepo;

	@GetMapping("/checkAccount")
	public WoolResult findAccount(Account account) {

		
		if(account == null || account.getCode() == null || account.getMeid() == null ) {
			return WoolResult.fail();
		}

		Account storyAcc = accountRepo.findByCode(account.getCode());

		if (storyAcc == null) {
			return WoolResult.fail();
		}

		if (storyAcc.getMeid() == null && storyAcc.getEndTime() == null ) {
			// 第一次激活设备
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
			return WoolResult.success(storyAcc.getEndTime());

		}else if(storyAcc.getMeid() == null && storyAcc.getEndTime() != null) {
			// 重新绑定设备
			storyAcc.setMeid(account.getMeid());
			accountRepo.save(storyAcc);
			return WoolResult.success(storyAcc.getEndTime());
			
		} else if (account.getMeid().equals(storyAcc.getMeid())) {
			// 校验激活码是否过期
			Date curr = new Date();
			if (curr.compareTo(storyAcc.getEndTime()) < 0) {
				return WoolResult.success(storyAcc.getEndTime());
			}
		}

		return WoolResult.fail();
	}
	
	@GetMapping("/delete")
	public WoolResult removeBinding(Account account) {
		
		if(account == null || account.getCode() ==null ||  account.getMeid() ==null || account.getDelete() != 1 ) 
			return WoolResult.fail();
		
		Account storyAcc = accountRepo.findByCode(account.getCode());
		
		if (storyAcc == null || storyAcc.getEndTime() == null || storyAcc.getMeid() == null ) {
			return WoolResult.fail();
		}
		
		Date curr = new Date();
		
		if(account.getMeid().equals(storyAcc.getMeid()) && curr.compareTo(storyAcc.getEndTime()) < 0) {
			storyAcc.setMeid(null);
			accountRepo.save(storyAcc);
			return WoolResult.success(storyAcc.getEndTime());
		}
		
		return WoolResult.fail();
	}
}
