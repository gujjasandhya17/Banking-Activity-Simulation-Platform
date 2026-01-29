# 📖 BankSimulator - Comprehensive Code Explanation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Component Explanation](#component-explanation)
6. [Data Flow](#data-flow)
7. [API Endpoints](#api-endpoints)
8. [Exception Handling](#exception-handling)
9. [Security Features](#security-features)

---

## 1. Project Overview

**BankSimulator** is a comprehensive Banking Activity Simulation Platform built using Java. It simulates real-world banking operations including account management, transactions, alerts, and authentication. The application demonstrates professional software engineering practices including:

- **Layered Architecture** (Presentation → Service → Repository)
- **RESTful API** design using Spark Java framework
- **Database Integration** with MySQL using JDBC
- **Email Notifications** using Jakarta Mail API
- **File-based Logging** for transaction audit trails
- **Token-based Authentication** for secure API access
- **Exception-driven Error Handling**

The application can run as:
1. **Console Application** (commented out in BankingApplication.java)
2. **Web-based REST API Server** (active implementation in ApiServer.java)

---

## 2. Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  ┌─────────────────────┐      ┌─────────────────────────┐  │
│  │   ApiServer.java    │      │  HTML/JS Frontend       │  │
│  │  (REST Endpoints)   │◄────►│  (banking.html)         │  │
│  └─────────────────────┘      └─────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                      SERVICE LAYER                           │
│  ┌──────────────┐  ┌─────────────────┐  ┌──────────────┐   │
│  │ AccountService│  │TransactionService│  │AlertService  │   │
│  │              │  │                 │  │              │   │
│  │ - Create     │  │ - Deposit       │  │ - Check      │   │
│  │ - Retrieve   │  │ - Withdraw      │  │   Balance    │   │
│  │ - List All   │  │ - Transfer      │  │ - Send Email │   │
│  └──────┬───────┘  └────────┬────────┘  └──────────────┘   │
└─────────┼──────────────────┼─────────────────────────────────┘
          │                  │
┌─────────▼──────────────────▼─────────────────────────────────┐
│                    REPOSITORY LAYER                           │
│  ┌──────────────────┐      ┌──────────────────────────┐      │
│  │ AccountRepository│      │ TransactionRepository    │      │
│  │ (In-Memory)      │      │ (MySQL Database)         │      │
│  └──────────────────┘      └──────────────────────────┘      │
└───────────────────────────────────────────────────────────────┘
          │                              │
┌─────────▼──────────────────────────────▼───────────────────┐
│                      UTILITY LAYER                          │
│  ┌────────────┐  ┌───────────────┐  ┌──────────────┐      │
│  │ EmailUtil  │  │FileReportUtil │  │DBConnection  │      │
│  │(SMTP/Gmail)│  │(Transaction   │  │(MySQL JDBC)  │      │
│  │            │  │ Logging)      │  │              │      │
│  └────────────┘  └───────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
          │                  │                   │
┌─────────▼──────────────────▼───────────────────▼────────────┐
│                    EXTERNAL SYSTEMS                          │
│   📧 Gmail SMTP        📄 File System       🗄️  MySQL DB    │
└──────────────────────────────────────────────────────────────┘
```

### Layered Architecture Explained

#### **1. Presentation Layer**
- **ApiServer.java**: Entry point of the application. Configures and starts the Spark web server
- **REST Endpoints**: Handle HTTP requests and responses
- **Frontend**: HTML/CSS/JavaScript files for user interface

#### **2. Service Layer (Business Logic)**
- **AccountService**: Manages account creation, retrieval, and listing
- **TransactionService**: Handles deposit, withdraw, and transfer operations
- **AlertService**: Monitors account balances and triggers email alerts

#### **3. Repository Layer (Data Access)**
- **AccountRepository**: In-memory storage using HashMap for quick access
- **TransactionRepository**: Persists transaction logs to MySQL database

#### **4. Utility Layer (Cross-cutting Concerns)**
- **EmailUtil**: Sends email notifications via Gmail SMTP
- **FileReportUtil**: Writes transaction logs to text files
- **DBConnection**: Manages database connections
- **AuthFilter**: JWT token validation for secured endpoints

---

## 3. Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Java** | 8+ | Core programming language |
| **Maven** | 3.x | Build automation and dependency management |
| **Spark Java** | 2.9.4 | Lightweight web framework for REST APIs |
| **MySQL** | 8.x | Relational database for transaction storage |
| **JDBC** | 8.3.0 | Database connectivity |
| **Jakarta Mail** | 2.0.1 | Email notifications (SMTP) |
| **Gson** | 2.10.1 | JSON serialization/deserialization |
| **JUnit** | 3.8.1 | Unit testing framework |

---

## 4. Project Structure

```
Banking-Activity-Simulation-Platform/
│
├── src/
│   ├── main/
│   │   ├── java/com/bank/BankSimulator/
│   │   │   ├── ApiServer.java              # Main entry point (web server)
│   │   │   ├── BankingApplication.java     # Console app (deprecated)
│   │   │   │
│   │   │   ├── model/
│   │   │   │   └── Account.java            # Account domain model
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── AccountService.java     # Account business logic
│   │   │   │   ├── TransactionService.java # Transaction business logic
│   │   │   │   └── AlertService.java       # Balance alert logic
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── AccountRepository.java      # In-memory account storage
│   │   │   │   ├── TransactionRepository.java  # DB transaction logging
│   │   │   │   └── DBConnection.java           # Database connection
│   │   │   │
│   │   │   ├── exception/
│   │   │   │   ├── InvalidAmountException.java
│   │   │   │   ├── AccountNotFoundException.java
│   │   │   │   └── InsufficientBalanceException.java
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── User.java               # User model
│   │   │   │   ├── UserRepository.java     # User storage
│   │   │   │   ├── AuthService.java        # Authentication logic
│   │   │   │   └── AuthController.java     # Login/Register endpoints
│   │   │   │
│   │   │   └── util/
│   │   │       ├── EmailUtil.java          # Email sending utility
│   │   │       ├── FileReportUtil.java     # File logging utility
│   │   │       └── AuthFilter.java         # Request authentication filter
│   │   │
│   │   └── resources/
│   │       └── public/
│   │           ├── index.html              # Landing page
│   │           ├── banking.html            # Main banking interface
│   │           ├── script.js               # Frontend logic
│   │           ├── style.css               # Styling
│   │           └── auth/
│   │               ├── login.html          # Login page
│   │               ├── register.html       # Registration page
│   │               ├── auth.js             # Auth frontend logic
│   │               └── auth.css            # Auth styling
│   │
│   └── test/
│       └── java/com/bank/BankSimulator/
│           ├── AccountTest.java
│           ├── TransactionTest.java
│           └── AlertTest.java
│
├── records/
│   └── transaction_report.txt              # Transaction audit log
│
├── pom.xml                                 # Maven configuration
└── README.md                               # Project documentation
```

---

## 5. Component Explanation

### 5.1 Model Layer

#### **Account.java**
The core domain model representing a bank account.

```java
public class Account {
    private static final AtomicLong COUNTER = new AtomicLong(1000000L);
    private final String accountNumber;
    private String holderName;
    private String email;
    private BigDecimal balance;
}
```

**Key Features:**
- **Atomic Counter**: Thread-safe account number generation starting from 1000000
- **Immutable Account Number**: Once created, cannot be changed
- **BigDecimal for Money**: Ensures precise decimal calculations (no floating-point errors)
- **Synchronized Methods**: `credit()` and `debit()` are thread-safe for concurrent transactions

**Methods:**
- `credit(BigDecimal amount)`: Adds money to the account
- `debit(BigDecimal amount)`: Subtracts money from the account
- `getBalance()`: Returns current balance
- `toString()`: Formats account details for display

---

### 5.2 Service Layer

#### **AccountService.java**
Handles account-related business operations.

```java
public class AccountService {
    private AccountRepository repo;
    
    public Account createAccount(String holderName, String email, 
                                BigDecimal openingBalance) 
                                throws InvalidAmountException
    
    public Account getAccount(String accountNumber) 
                             throws AccountNotFoundException
    
    public Collection<Account> listAll()
}
```

**Business Rules:**
- Opening balance cannot be negative
- Account numbers are auto-generated
- Throws `InvalidAmountException` if balance < 0
- Throws `AccountNotFoundException` if account doesn't exist

---

#### **TransactionService.java**
Manages financial transactions with comprehensive validation.

```java
public class TransactionService {
    private AccountService accountService;
    private TransactionRepository transactionRepository;
    private AlertService alertService;
    
    public void deposit(String accNo, BigDecimal amount)
    public void withdraw(String accNo, BigDecimal amount)
    public void transfer(String fromAcc, String toAcc, BigDecimal amount)
}
```

**Transaction Flow:**

**Deposit:**
1. Validate amount (must be positive)
2. Retrieve account from AccountService
3. Credit the amount to account
4. Log transaction to file (FileReportUtil)
5. Log transaction to database (TransactionRepository)
6. Check balance for alerts (AlertService)

**Withdraw:**
1. Validate amount (must be positive)
2. Retrieve account from AccountService
3. Check sufficient balance
4. Debit the amount from account
5. Log transaction to file and database
6. Check balance for low-balance alert

**Transfer:**
1. Validate amount (must be positive)
2. Retrieve both sender and receiver accounts
3. Check sender has sufficient balance
4. Debit from sender account
5. Credit to receiver account
6. Log transaction with both account details
7. Check both accounts for balance alerts

**Validation Rules:**
- Amount must be positive
- Account must exist
- Sufficient balance for withdraw/transfer
- Thread-safe operations (synchronized methods in Account)

---

#### **AlertService.java**
Monitors account balances and sends email notifications.

```java
public class AlertService {
    private final BigDecimal threshold;
    
    public AlertService(BigDecimal threshold) {
        this.threshold = threshold; // Default: 1000
    }
    
    public void checkBalance(Account account) {
        if (account.getBalance().compareTo(threshold) <= 0) {
            // Send low balance email alert
        }
    }
}
```

**Alert Logic:**
- Checks if balance ≤ threshold (default: 1000)
- Composes professional email message
- Sends email using EmailUtil to account holder's registered email
- Called automatically after every transaction

---

### 5.3 Repository Layer

#### **AccountRepository.java**
In-memory storage for fast account access.

```java
public class AccountRepository {
    private final Map<String, Account> accounts = new HashMap<>();
    
    public void save(Account account)
    public Account findAccountByNumber(String accountNumber)
    public Collection<Account> findAll()
}
```

**Design Choice:**
- Uses `HashMap` for O(1) lookup time
- In-memory storage (data lost on restart)
- Simple implementation suitable for simulation
- Production systems would use database storage

---

#### **TransactionRepository.java**
Persists transaction logs to MySQL database.

```java
public class TransactionRepository {
    public void logTransaction(String type, String accNo, 
                              double amount, String target_number)
}
```

**Database Schema (transactions table):**
```sql
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(20),           -- DEPOSIT, WITHDRAW, TRANSFER
    account_number VARCHAR(50),
    amount DOUBLE,
    target_account VARCHAR(50), -- For transfers (receiver account)
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Transaction Types:**
- `DEPOSIT`: Single account transaction
- `WITHDRAW`: Single account transaction
- `TRANSFER`: Two-account transaction (sender → receiver)

---

#### **DBConnection.java**
Database connection management using JDBC.

```java
public class DBConnection {
    private static final String url = "jdbc:mysql://localhost:3306/banking_simulator";
    private static final String username = "root";
    private static final String password = "1234";
    
    public static Connection getConnection()
}
```

**Connection Management:**
- Static method provides database connection
- Uses MySQL JDBC driver
- Connection parameters hardcoded (should use environment variables in production)
- Implements try-with-resources for automatic connection cleanup

---

### 5.4 Utility Layer

#### **EmailUtil.java**
Sends email notifications using Gmail SMTP.

```java
public class EmailUtil {
    private static final String FROM_EMAIL = "17sandhya23@gmail.com";
    private static final String APP_PASSWORD = "voprfyfdhepbthce";
    
    public static void sendEmail(String to, String subject, String body)
}
```

**Email Configuration:**
- **SMTP Server**: smtp.gmail.com
- **Port**: 587 (TLS)
- **Authentication**: Gmail App Password
- **Security**: STARTTLS encryption

**Usage Example:**
```java
EmailUtil.sendEmail(
    "customer@example.com",
    "⚠ Low Balance Alert",
    "Your balance is below threshold..."
);
```

**⚠️ Security Note:**
- App password is hardcoded (NOT recommended for production)
- Should use environment variables or secure configuration management

---

#### **FileReportUtil.java**
Creates audit trail by logging transactions to a text file.

```java
public class FileReportUtil {
    private static final String REPORT_FOLDER = "records";
    private static final String REPORT_FILE = "records/transaction_report.txt";
    
    public static void writeLine(String line)
}
```

**Log Format:**
```
DEPOSIT | Acc: 1000000 | Amount: 5000.00
WITHDRAW | Acc: 1000001 | Amount: 200.00
TRANSFER | FromAcc: 1000000 | ToAccount: 1000001 | Amount 1000.00
```

**Features:**
- Automatic folder creation
- Append mode (doesn't overwrite)
- Thread-safe file operations
- Provides audit trail for compliance

---

### 5.5 Authentication System

#### **User.java**
Simple user model for authentication.

```java
public class User {
    private String username;
    private String password;
}
```

---

#### **UserRepository.java**
In-memory user storage.

```java
public class UserRepository {
    private static final Map<String, String> users = new HashMap<>();
    
    public static boolean register(String username, String password)
    public static boolean validate(String username, String password)
}
```

**Features:**
- Stores username → password mapping
- Prevents duplicate usernames
- Validates credentials during login

---

#### **AuthService.java**
Manages authentication tokens.

```java
public class AuthService {
    private static final Set<String> activeTokens = new HashSet<>();
    
    public static String login(String username, String password)
    public static boolean isAuthorized(String token)
}
```

**Token-based Authentication:**
1. User logs in with username/password
2. System validates credentials
3. Generates UUID token
4. Stores token in active tokens set
5. Returns token to client
6. Client includes token in subsequent requests

---

#### **AuthFilter.java**
Spark filter to secure API endpoints.

```java
public class AuthFilter {
    public static void apply() {
        before("/accounts/*", (req, res) -> {
            String token = req.headers("Authorization");
            if (token == null || !AuthService.isAuthorized(token)) {
                halt(401, "Unauthorized");
            }
        });
    }
}
```

**How It Works:**
- Intercepts all requests to `/accounts/*` endpoints
- Checks for `Authorization` header
- Validates token with AuthService
- Returns 401 Unauthorized if invalid
- Allows request to proceed if valid

---

### 5.6 Exception Handling

#### **Custom Exceptions**

**InvalidAmountException**
```java
public class InvalidAmountException extends Exception {
    public InvalidAmountException(String msg) {
        super(msg);
    }
}
```
- Thrown when amount is negative or zero
- Used in deposit, withdraw, and account creation

---

**AccountNotFoundException**
```java
public class AccountNotFoundException extends Exception {
    public AccountNotFoundException(String msg) {
        super(msg);
    }
}
```
- Thrown when account number doesn't exist
- Used in all account retrieval operations

---

**InsufficientBalanceException**
```java
public class InsufficientBalanceException extends Exception {
    public InsufficientBalanceException(String msg) {
        super(msg);
    }
}
```
- Thrown when withdraw/transfer amount exceeds balance
- Prevents negative balances

---

## 6. Data Flow

### Complete Transaction Flow Example: Money Transfer

```
User (Frontend)
    │
    │ POST /accounts/transfer
    │ { fromAcc: "1000000", toAcc: "1000001", amount: 500 }
    │
    ▼
┌───────────────────────────────────────┐
│        AuthFilter                      │
│  - Validate Authorization token        │
│  - Continue if valid, else 401        │
└───────────────┬───────────────────────┘
                │
                ▼
┌───────────────────────────────────────┐
│     ApiServer (POST /accounts/transfer)│
│  1. Parse JSON request body            │
│  2. Extract fromAcc, toAcc, amount     │
└───────────────┬───────────────────────┘
                │
                ▼
┌───────────────────────────────────────┐
│      TransactionService.transfer()     │
│  1. Validate amount > 0                │
│  2. Get sender account                 │
│  3. Get receiver account               │
│  4. Check sender balance >= amount     │
│  5. sender.debit(amount)               │
│  6. receiver.credit(amount)            │
└───────────────┬───────────────────────┘
                │
                ├────────────────────────────┐
                │                            │
                ▼                            ▼
    ┌──────────────────────┐    ┌──────────────────────┐
    │  FileReportUtil      │    │ TransactionRepository│
    │  Write to text file  │    │  Log to MySQL DB     │
    └──────────────────────┘    └──────────────────────┘
                │
                ▼
    ┌──────────────────────┐
    │    AlertService      │
    │  Check sender balance│
    │  Check receiver bal. │
    │  Send email if low   │
    └──────────────────────┘
                │
                ▼
    ┌──────────────────────┐
    │   Response to User   │
    │ { message: "success" }│
    └──────────────────────┘
```

---

## 7. API Endpoints

### Authentication Endpoints (No Auth Required)

#### **POST /register**
Register a new user.

**Parameters (Form Data):**
- `username`: String
- `password`: String

**Response:**
- Success: `"Registration successful"`
- Failure: `"User already exists"` (400)

---

#### **POST /login**
Login and receive authentication token.

**Parameters (Form Data):**
- `username`: String
- `password`: String

**Response:**
- Success: `"<UUID-TOKEN>"`
- Failure: `"Invalid credentials"` (401)

---

### Account Endpoints (Auth Required)

All endpoints below require `Authorization` header with valid token.

#### **POST /accounts/create**
Create a new bank account.

**Request Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "balance": 5000.00
}
```

**Response (JSON):**
```json
{
  "accountNumber": "1000000",
  "holderName": "John Doe",
  "email": "john@example.com",
  "balance": 5000.00
}
```

---

#### **POST /accounts/deposit**
Deposit money into an account.

**Request Body (JSON):**
```json
{
  "accNo": "1000000",
  "amount": 1000.00
}
```

**Response (JSON):**
```json
{
  "message": "Deposit successful"
}
```

---

#### **POST /accounts/withdraw**
Withdraw money from an account.

**Request Body (JSON):**
```json
{
  "accNo": "1000000",
  "amount": 500.00
}
```

**Response (JSON):**
```json
{
  "message": "Withdraw successful"
}
```

**Errors:**
- 400: Invalid amount or insufficient balance

---

#### **POST /accounts/transfer**
Transfer money between accounts.

**Request Body (JSON):**
```json
{
  "fromAcc": "1000000",
  "toAcc": "1000001",
  "amount": 250.00
}
```

**Response (JSON):**
```json
{
  "message": "Transfer successful"
}
```

---

#### **GET /accounts/all**
List all accounts.

**Response (JSON):**
```json
[
  {
    "accountNumber": "1000000",
    "holderName": "John Doe",
    "email": "john@example.com",
    "balance": 5000.00
  },
  {
    "accountNumber": "1000001",
    "holderName": "Jane Smith",
    "email": "jane@example.com",
    "balance": 3000.00
  }
]
```

---

#### **GET /accounts/:accNo**
Get specific account details.

**Parameters:**
- `accNo`: Account number (path parameter)

**Response (JSON):**
```json
{
  "accountNumber": "1000000",
  "holderName": "John Doe",
  "email": "john@example.com",
  "balance": 5000.00
}
```

**Errors:**
- 404: Account not found

---

## 8. Exception Handling

### Exception Hierarchy

```
Exception
├── InvalidAmountException (Checked)
│   - Thrown when amount ≤ 0
│   - Used in: deposit, withdraw, createAccount
│
├── AccountNotFoundException (Checked)
│   - Thrown when account doesn't exist
│   - Used in: getAccount, deposit, withdraw, transfer
│
└── InsufficientBalanceException (Checked)
    - Thrown when balance < withdrawal amount
    - Used in: withdraw, transfer
```

### Exception Handling in API

```java
try {
    trxService.deposit(accNo, amount);
    return gson.toJson(Map.of("message", "Deposit successful"));
} catch (InvalidAmountException e) {
    res.status(400);
    return gson.toJson(Map.of("error", e.getMessage()));
} catch (AccountNotFoundException e) {
    res.status(404);
    return gson.toJson(Map.of("error", e.getMessage()));
}
```

---

## 9. Security Features

### 9.1 Authentication & Authorization
- **Token-based authentication** using UUID
- **AuthFilter** protects all `/accounts/*` endpoints
- **Session management** with active token tracking

### 9.2 Data Validation
- **Amount validation**: Prevents negative transactions
- **Balance validation**: Prevents overdrafts
- **Account existence validation**: Prevents operations on non-existent accounts

### 9.3 Thread Safety
- **Synchronized methods** in Account class for concurrent transactions
- **AtomicLong** for thread-safe account number generation

### 9.4 Audit Trail
- **Database logging**: All transactions stored in MySQL
- **File logging**: Transaction audit trail in text file
- **Email notifications**: Alert system for low balances

### ⚠️ Security Improvements Needed for Production
1. **Password hashing**: Currently stores plain text passwords
2. **Environment variables**: Database credentials and email password hardcoded
3. **HTTPS**: Should use TLS/SSL for secure communication
4. **Token expiration**: Tokens never expire currently
5. **Rate limiting**: No protection against brute force attacks
6. **Input sanitization**: Should validate and sanitize all user inputs
7. **SQL injection prevention**: Using PreparedStatements (✓ already implemented)

---

## Summary

The **BankSimulator** project demonstrates:
✅ Clean layered architecture
✅ RESTful API design
✅ Database integration
✅ Email notifications
✅ File-based logging
✅ Exception-driven error handling
✅ Token-based authentication
✅ Thread-safe concurrent operations
✅ Professional code organization

This project serves as an excellent learning resource for understanding enterprise Java application development and banking system workflows.
