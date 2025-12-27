🏦 Banking Activity Simulation Platform

A Java-based console banking application that simulates real-world banking operations such as account creation, deposits, withdrawals, transfers, transaction logging, file reporting, and automated email alerts for low balances.

This project is designed with clean architecture, layered design, and real backend practices, making it ideal for learning core Java, OOP, exception handling, and service-based design.

✨ Features

✔ Create bank accounts
✔ Deposit money
✔ Withdraw money with balance validation
✔ Transfer money between accounts
✔ Low balance email alerts
✔ Transaction logging into database
✔ File-based transaction reports
✔ Console-based interactive menu
✔ Exception-safe operations

🧠 Project Architecture

The application follows a layered architecture, similar to real-world backend systems:

UI Layer
│
├── BankingApplication (Main Class)
│
Service Layer
│   ├── AccountService
│   ├── TransactionService
│   └── AlertService
│
Repository Layer
│   ├── AccountRepository
│   └── TransactionRepository
│
Utility Layer
│   ├── EmailUtil
│   └── FileReportUtil
│
Model & Exceptions

🛠 Technologies Used

Java (Core + OOP concepts)

JDBC (Database interaction)

MySQL (Transaction storage)

JavaMail API (Email alerts)

File I/O (Transaction reports)

BigDecimal (Accurate monetary calculations)

Git & GitHub

📂 Modules Overview
🔹 Account Management

Create accounts with name, email, and opening balance

Auto-generated unique account numbers

🔹 Transaction Management

Deposit

Withdraw (with insufficient balance checks)

Transfer between accounts

🔹 Alerts & Notifications

Automatic low balance email alerts

Threshold configurable via AlertService

🔹 Reporting

Transaction logs stored in:

Database

Text file (transaction_report.txt)

📧 Email Alert System

Uses Gmail SMTP

Sends alerts when balance falls below a defined threshold

Implemented using JavaMail API

Secure authentication using App Passwords

📄 File Reporting

All transactions are recorded in a file for auditing:

records/transaction_report.txt


Example:

WITHDRAW | Acc: 1000001 | Amount: 4500
DEPOSIT  | Acc: 1000002 | Amount: 2000

▶ How to Run the Project

Clone the repository:

git clone https://github.com/gujjasandhya17/Banking-Activity-Simulation-Platform.git


Open in VS Code / IntelliJ

Configure:

Database connection (JDBC)

Email credentials (Gmail App Password)

Run:

BankingApplication.java

🧪 Sample Console Menu
1. Create Account
2. Deposit Money
3. Withdraw Money
4. Transfer Money
5. Show Account Details
6. List All Accounts
7. Exit

🚀 Future Enhancements

Spring Boot conversion

REST APIs

User authentication

Admin dashboard

PDF transaction reports

Unit testing with JUnit
