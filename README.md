# 🏦 Banking Activity Simulation Platform

[![Deploy on Railway](https://railway.app/button.svg)](https://banking-activity-simulation-platform-production.up.railway.app)


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

## 📚 Learning Outcomes

Through this project, I gained hands-on experience in:

- Designing scalable Java applications  
- Applying object-oriented programming principles  
- Handling real-world exceptions effectively  
- Integrating external services such as **Email** and **Database (MySQL)**  
- Writing clean, maintainable, and readable code  

---

## 🔮 Future Enhancements

The following features can be added to improve and extend the project:

- Web-based version using **Spring Boot**  
- RESTful APIs for banking operations  
- User authentication and authorization  
- Transaction history viewer with filters  
- PDF / Excel report generation for transactions

---

## 🚀 Live Deployment (Railway)

The **Banking Activity Simulation Platform** is deployed on **Railway** and accessible at:

🔗 **Live URL:**  
👉 [https://banking-activity-simulation-platform-production.up.railway.app](https://banking-activity-simulation-platform-production.up.railway.app)

⚠️ **Note:**  
- This application exposes backend APIs (**Spark Java**) and does **not have a UI**.  
- Use **Postman** or **browser endpoints** to test the APIs.


---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/gujjasandhya17/Banking-Activity-Simulation-Platform.git

