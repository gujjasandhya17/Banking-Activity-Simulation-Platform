# 🏦 Banking Activity Simulation Platform

## 📌 Project Overview

The **Banking Activity Simulation Platform** is a Java-based console application that simulates core banking operations in a structured and realistic manner.  
The project demonstrates:

- Object-Oriented Programming (OOP)
- Exception Handling
- Layered Architecture
- Database Interaction
- File Handling
- Email Integration

This application mimics a real banking backend by separating responsibilities into **Repository, Service, Utility, and Model layers**.

---

## 🎯 Project Objectives

- Understand real-world banking workflows  
- Implement clean, modular Java code  
- Practice exception-driven programming  
- Integrate database, file system, and email services  
- Build a project suitable for academic and professional evaluation  

---

## ⚙️ Functional Features

### ✔ Account Management
- Create bank accounts with unique account numbers  
- Store account holder name, email, and balance  
- Retrieve account details securely  

### ✔ Transaction Operations
- Deposit money  
- Withdraw money with balance validation  
- Transfer money between accounts  
- Prevent invalid and negative transactions  

### ✔ Alert System
- Automatic low-balance email alerts  
- Configurable balance threshold  
- Email sent to the registered account holder  

### ✔ Reporting & Logging
- Transaction details stored in **MySQL database**  
- Transaction history written to a **text file**  
- Console logs for user visibility  

---

## 🧱 System Architecture
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


---

## 🛠 Technologies Used

| Technology | Purpose |
|---------|--------|
| Java | Core application logic |
| JDBC | Database connectivity |
| MySQL | Transaction storage |
| JavaMail API | Email alerts |
| File I/O | Transaction reports |
| Git & GitHub | Version control |

---

## 🧪 Exception Handling

Custom exceptions are used to ensure safe and controlled execution:

- `InvalidAmountException`
- `AccountNotFoundException`
- `InsufficientBalanceException`

This prevents system crashes and improves user experience.

---

## 📧 Email Alert Mechanism

- Uses **SMTP with Gmail**
- Sends alerts when account balance falls below a predefined threshold
- Demonstrates real-time notification systems used in banking applications

---

## 📄 File Reporting

Every transaction is logged into:


This simulates **audit logs** used in real banking systems.

---

## ▶️ How to Execute the Application

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/gujjasandhya17/Banking-Activity-Simulation-Platform.git


📚 Learning Outcomes

Through this project, I gained hands-on experience in:

Designing scalable Java applications

Applying object-oriented principles

Handling real-world exceptions

Integrating external services (Email & Database)

Writing maintainable and readable code

🔮 Future Enhancements

Web version using Spring Boot

REST APIs

Authentication & authorization

Transaction history viewer

PDF / Excel report generation

The project follows a **layered architecture**, ensuring separation of concerns:

