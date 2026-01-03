package com.bank.BankSimulator;

import java.math.BigDecimal;
import java.util.Map;

import static spark.Spark.*;

import com.bank.BankSimulator.repository.AccountRepository;
import com.bank.BankSimulator.repository.TransactionRepository;
import com.bank.BankSimulator.model.Account;
import com.bank.BankSimulator.service.AccountService;
import com.bank.BankSimulator.service.AlertService;
import com.bank.BankSimulator.service.TransactionService;
import com.google.gson.Gson;

import spark.Route;

public class ApiServer {
	
	public static void main(String[] args) {

		port(8085);
		staticFiles.location("/public");


        Gson gson = new Gson();
        AccountRepository accRepo = new AccountRepository();
        AccountService accountService = new AccountService(accRepo);
        TransactionRepository trxRepo = new TransactionRepository();
		
		AlertService alertService = new AlertService(new BigDecimal("1000"));
		TransactionService trxService = new TransactionService(accountService,trxRepo,alertService);
		
        System.out.println("Spark server started on port 8085");

        // ---------------- ROUTES ----------------

        post("/accounts/create",(req, res) -> {
			System.out.println("/accounts/create api is called");
			res.type("application/json");
			
			AccountRequest data = gson.fromJson(req.body(), AccountRequest.class);
			Account acc = accountService.createAccount(data.name, data.email, data.balance);
			return gson.toJson(acc);
			
		});
		
        post("/accounts/deposit", (req, res) -> {
            res.type("application/json");

            TxRequest data = gson.fromJson(req.body(), TxRequest.class);
            trxService.deposit(data.accNo, data.amount);

            return gson.toJson(
                Map.of("message", "Deposit successful")
            );
        });

       
        
	}

 

    // ---------------- Request DTOs ----------------
    static class AccountRequest {
        String name;
        String email;
        BigDecimal balance;
    }
    
    static class TxRequest{
    	 String accNo;
    	 BigDecimal amount;
    }
  
		 
}