🏦 Banking Activity Simulation Platform
📌 Project Overview

The Banking Activity Simulation Platform is a Java-based console application that simulates core banking operations in a structured and realistic manner.
The project is designed to demonstrate object-oriented programming, exception handling, layered architecture, database interaction, file handling, and email integration.

This application mimics how a real banking backend works by separating responsibilities into Repository, Service, Utility, and Model layers.

🎯 Project Objectives

To understand real-world banking workflows

To implement clean, modular Java code

To practice exception-driven programming

To integrate database, file system, and email services

To build a project suitable for academic and professional evaluation

⚙️ Functional Features
✔ Account Management

Create bank accounts with unique account numbers

Store account holder name, email, and balance

Retrieve account details securely

✔ Transaction Operations

Deposit money

Withdraw money with balance validation

Transfer money between accounts

Prevent invalid and negative transactions

✔ Alert System

Automatic low-balance email alerts

Configurable balance threshold

Email sent to registered account holder

✔ Reporting & Logging

Transaction details stored in MySQL database

Transaction history written to a text file

Console logs for user visibility

🧱 System Architecture

The project follows a layered architecture, ensuring separation of concerns:

Presentation Layer
└── BankingApplication (Console Menu)

Service Layer
├── AccountService
├── TransactionService
└── AlertService

Repository Layer
├── AccountRepository
└── TransactionRepository

Utility Layer
├── DBConnection
├── FileReportUtil
└── EmailUtil

Model & Exceptions
├── Account
└── Custom Exception Classes

🛠 Technologies Used
Technology	Purpose
Java	Core application logic
JDBC	Database connectivity
MySQL	Transaction storage
JavaMail API	Email alerts
File I/O	Transaction reports
Git & GitHub	Version control
🧪 Exception Handling

Custom exceptions are used to ensure safe and controlled execution:

InvalidAmountException

AccountNotFoundException

InsufficientBalanceException

This prevents system crashes and improves user experience.

📧 Email Alert Mechanism

Uses SMTP with Gmail

Sends alerts when account balance falls below a predefined threshold

Demonstrates real-time notification systems used in banking

📄 File Reporting

Every transaction is logged into:

records/transaction_report.txt


This simulates audit logs used in real banking systems.

▶️ How to Execute the Application

Clone the repository:

git clone https://github.com/gujjasandhya17/Banking-Activity-Simulation-Platform.git


Configure:

MySQL database

Email credentials (App Password)

Run:

BankingApplication.java

📋 Sample Console Menu
1. Create Account
2. Deposit Money
3. Withdraw Money
4. Transfer Money
5. Show Account Details
6. List All Accounts
7. Exit

📚 Learning Outcomes

Through this project, I gained hands-on experience in:

Designing scalable Java applications

Applying object-oriented principles

Handling real-world exceptions

Integrating external services (Email, DB)

Writing maintainable and readable code

🔮 Future Enhancements

Web version using Spring Boot

REST APIs

Authentication & authorization

Transaction history viewer

PDF/Excel report generation
