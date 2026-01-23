package com.bank.BankSimulator;
import com.bank.BankSimulator.auth.AuthController;
import com.bank.BankSimulator.util.AuthFilter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import static spark.Spark.*;

import com.bank.BankSimulator.repository.AccountRepository;
import com.bank.BankSimulator.repository.TransactionRepository;
import com.bank.BankSimulator.exception.AccountNotFoundException;
import com.bank.BankSimulator.model.Account;
import com.bank.BankSimulator.service.AccountService;
import com.bank.BankSimulator.service.AlertService;
import com.bank.BankSimulator.service.TransactionService;
import com.google.gson.Gson;

import spark.Route;

public class ApiServer {
	
	public static void main(String[] args) {

		 
	            int port=8085; // local development
	            String portEnv = System.getenv("PORT");
	            if (portEnv != null) {
	                port = Integer.parseInt(portEnv);
	            }
	            port(port);
	            staticFiles.location("/public");
	            
	            get("/", (req, res) -> "Bank Simulator Running!");

	            System.out.println("Server started on port " + port);
	           

	           

		AuthController.routes();
		AuthFilter.apply();



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
        	System.out.println("/accounts/deposit api is called");
            res.type("application/json");

            TxRequest data = gson.fromJson(req.body(), TxRequest.class);
            trxService.deposit(data.accNo, data.amount);

            return gson.toJson(
                Map.of("message", "Deposit successful")
            );
        });

       post("/accounts/withdraw",(req,res)->{
    	   System.out.println("/accounts/withdraw api is called");
    	   res.type("application/json");
    	   TxRequest data = gson.fromJson(req.body(), TxRequest.class);
    	   trxService.withdraw(data.accNo, data.amount);
    	   return gson.toJson(
                   Map.of("message", "Withdraw successful")
               );
    	   
       });
       
       post("/accounts/transfer",(req,res)->{
    	   System.out.println("/accounts/transfer api is called"); 
    	   res.type("application/json");
    	   
    	   TransferRequest data = gson.fromJson(req.body(), TransferRequest.class);
		   trxService.transfer(data.fromAcc, data.toAcc, data.amount);
		   
		   return gson.toJson(
                   Map.of("message", "Transfer successful")
               );
       });
       
       get("/accounts/all", (req, res) -> {
    	    res.type("application/json");
    	    try {
    	        Collection<Account> accounts = accountService.listAll();
    	        return gson.toJson(new ArrayList<>(accounts));
    	    } catch (Exception e) {
    	        e.printStackTrace();
    	        res.status(500);
    	        return gson.toJson(Map.of("error", e.getMessage()));
    	    }
    	});
       
       get("/accounts/:accNo", (req, res) ->{
    	   System.out.println("/accounts/:accNo api is called"); 
    	   res.type("application/json");
    	   
    	   String accNo = req.params(":accNo");

    	   try {
    	        Account account = accountService.getAccount(accNo);
    	        return gson.toJson(account);
    	    } catch (AccountNotFoundException e) {
    	        res.status(404);
    	        return gson.toJson(Map.of("error", e.getMessage()));
    	    }
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
    
    static class TransferRequest{
		String fromAcc;
		String toAcc;
		BigDecimal amount;
	}
  
		 
}
