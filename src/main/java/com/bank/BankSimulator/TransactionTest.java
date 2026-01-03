package com.bank.BankSimulator;

import java.math.BigDecimal;

import com.bank.BankSimulator.exception.AccountNotFoundException;
import com.bank.BankSimulator.exception.InsufficientBalanceException;
import com.bank.BankSimulator.exception.InvalidAmountException;
import com.bank.BankSimulator.model.Account;
import com.bank.BankSimulator.repository.AccountRepository;
import com.bank.BankSimulator.repository.TransactionRepository;
import com.bank.BankSimulator.service.AccountService;
import com.bank.BankSimulator.service.TransactionService;
import com.bank.BankSimulator.service.AlertService;

public class TransactionTest {
	public static void main(String[] args) throws AccountNotFoundException, InvalidAmountException, InsufficientBalanceException
	{
		AccountRepository accRepo = new AccountRepository();
		TransactionRepository trxRepo = new TransactionRepository();
		AccountService accService = new AccountService(accRepo);
		AlertService alertService = new AlertService(new BigDecimal("1000"));
		TransactionService trx = new TransactionService(accService, trxRepo,alertService);
		try {
			Account fromAccount = accService.createAccount("Sam","sam@gmail.com",new BigDecimal("3000"));
			Account toAccount = accService.createAccount("ashna","ashna@gmail.com",new BigDecimal("500"));
			System.out.println(fromAccount);
			System.out.println("---------------------------------------------------------");
			System.out.println(toAccount);

		}
		catch(InvalidAmountException e)
		{
			e.printStackTrace();
		}
		
		try {
			Account fromAccount = accService.createAccount("Sam","sam@gmail.com",new BigDecimal("3000"));
			Account toAccount = accService.createAccount("ashna","ashna@gmail.com",new BigDecimal("500"));
			trx.deposit("1000000",new BigDecimal("2000"));
			trx.withdraw("1000001",new BigDecimal("10"));
			System.out.println(fromAccount);
			System.out.println("---------------------------------------------------------");
			System.out.println(toAccount);

		}
		catch(InvalidAmountException e)
		{
			e.printStackTrace();
		}
		
		
	}
}
