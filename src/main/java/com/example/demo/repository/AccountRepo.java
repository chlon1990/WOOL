package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Account;

@Repository
public interface AccountRepo extends JpaRepository<Account, Integer> {

	@Query(value = "select a.* from Account a where a.code = ?1",nativeQuery = true)
	Account findByCode(String code);

}
