# 📚 BankSimulator Project - Documentation Index

Welcome to the comprehensive documentation for the **Banking Activity Simulation Platform**!

This repository contains detailed documentation explaining the entire BankSimulator project, including code architecture, workflows, and usage examples.

---

## 📖 Documentation Files

### 1. [CODE_EXPLANATION.md](./CODE_EXPLANATION.md)
**Complete code analysis and architecture documentation**

This document provides:
- ✅ Project overview and objectives
- ✅ System architecture with detailed diagrams
- ✅ Technology stack breakdown
- ✅ Complete project structure
- ✅ Component-by-component code explanation:
  - Model layer (Account domain model)
  - Service layer (Business logic)
  - Repository layer (Data access)
  - Utility layer (Cross-cutting concerns)
  - Authentication system
  - Exception handling
- ✅ API endpoints reference with examples
- ✅ Data flow diagrams
- ✅ Security features and recommendations

**Best for:** Understanding the codebase architecture and how each component works

---

### 2. [WORKFLOW.md](./WORKFLOW.md)
**Complete workflow and process documentation**

This document provides:
- ✅ Application startup sequence
- ✅ User authentication workflows
- ✅ Account creation workflow
- ✅ Transaction workflows (Deposit, Withdraw, Transfer)
- ✅ Alert system workflow
- ✅ End-to-end user scenarios
- ✅ Error handling examples
- ✅ Multi-layer system architecture flow

**Best for:** Understanding how the application processes user requests and handles workflows

---

### 3. [README.md](./README.md)
**Project introduction and quick start guide**

This is the main project documentation containing:
- ✅ Project overview
- ✅ Key features
- ✅ Installation instructions
- ✅ Live deployment information
- ✅ Technologies used

**Best for:** Getting started with the project quickly

---

## 🎯 Quick Navigation Guide

### For New Developers
1. Start with [README.md](./README.md) for project overview
2. Read [CODE_EXPLANATION.md](./CODE_EXPLANATION.md) sections 1-4 for architecture understanding
3. Review [WORKFLOW.md](./WORKFLOW.md) section 1 for startup workflow
4. Explore specific components in [CODE_EXPLANATION.md](./CODE_EXPLANATION.md) section 5

### For Understanding Specific Features

#### Account Management
- Code: [CODE_EXPLANATION.md - Section 5.1 & 5.2](./CODE_EXPLANATION.md#51-model-layer)
- Workflow: [WORKFLOW.md - Section 3](./WORKFLOW.md#3-account-creation-workflow)

#### Transactions (Deposit/Withdraw/Transfer)
- Code: [CODE_EXPLANATION.md - Section 5.2](./CODE_EXPLANATION.md#transactionservicejava)
- Workflow: [WORKFLOW.md - Section 4](./WORKFLOW.md#4-transaction-workflows)

#### Authentication System
- Code: [CODE_EXPLANATION.md - Section 5.5](./CODE_EXPLANATION.md#55-authentication-system)
- Workflow: [WORKFLOW.md - Section 2](./WORKFLOW.md#2-user-authentication-workflow)

#### Alert System
- Code: [CODE_EXPLANATION.md - Section 5.2](./CODE_EXPLANATION.md#alertservicejava)
- Workflow: [WORKFLOW.md - Section 5](./WORKFLOW.md#5-alert-system-workflow)

#### API Reference
- Endpoints: [CODE_EXPLANATION.md - Section 7](./CODE_EXPLANATION.md#7-api-endpoints)
- Request Flow: [WORKFLOW.md - Section 7](./WORKFLOW.md#7-system-architecture-flow)

---

## 🏗️ Project Architecture Quick Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│               Web Browser (HTML/JS)                     │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST API
                         ▼
┌─────────────────────────────────────────────────────────┐
│              PRESENTATION LAYER                         │
│         ApiServer + REST Endpoints                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                SERVICE LAYER                            │
│  AccountService | TransactionService | AlertService     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              REPOSITORY LAYER                           │
│    AccountRepository (Memory) | TransactionRepo (DB)    │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 DATA STORAGE                            │
│   HashMap | MySQL Database | File System | Email SMTP   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Features Explained

### 1. **Account Management**
Create, retrieve, and list bank accounts with auto-generated account numbers starting from 1000000.

**Learn more:**
- [Account Model Explanation](./CODE_EXPLANATION.md#51-model-layer)
- [Account Creation Workflow](./WORKFLOW.md#3-account-creation-workflow)

---

### 2. **Transaction Operations**
Perform deposits, withdrawals, and transfers with comprehensive validation and error handling.

**Learn more:**
- [Transaction Service Code](./CODE_EXPLANATION.md#transactionservicejava)
- [Transaction Workflows](./WORKFLOW.md#4-transaction-workflows)

---

### 3. **Alert System**
Automatic email notifications when account balance falls below threshold (default: ₹1000).

**Learn more:**
- [Alert Service Code](./CODE_EXPLANATION.md#alertservicejava)
- [Alert Workflow](./WORKFLOW.md#5-alert-system-workflow)

---

### 4. **Authentication & Security**
Token-based authentication protecting all account endpoints with UUID tokens.

**Learn more:**
- [Authentication System](./CODE_EXPLANATION.md#55-authentication-system)
- [Auth Workflows](./WORKFLOW.md#2-user-authentication-workflow)

---

### 5. **Audit Trail**
Dual logging system with both file-based logs and MySQL database records.

**Learn more:**
- [File Logging Utility](./CODE_EXPLANATION.md#filereportutiljava)
- [Transaction Repository](./CODE_EXPLANATION.md#transactionrepositoryjava)

---

## 🧪 Example Usage Scenarios

### Scenario 1: Create Account and Deposit Money
```javascript
// 1. Register user
POST /register
Body: { username: "alice", password: "pass123" }

// 2. Login
POST /login
Body: { username: "alice", password: "pass123" }
Response: "token-abc-123"

// 3. Create account
POST /accounts/create
Headers: { Authorization: "token-abc-123" }
Body: { name: "Alice", email: "alice@email.com", balance: 5000 }
Response: { accountNumber: "1000000", balance: 5000 }

// 4. Deposit money
POST /accounts/deposit
Headers: { Authorization: "token-abc-123" }
Body: { accNo: "1000000", amount: 2000 }
Response: { message: "Deposit successful" }
```

**See detailed workflow:** [WORKFLOW.md - Scenario 1](./WORKFLOW.md#scenario-1-new-user-complete-journey)

---

### Scenario 2: Transfer Money Between Accounts
```javascript
// Transfer 1500 from Account A to Account B
POST /accounts/transfer
Headers: { Authorization: "token-abc-123" }
Body: { 
  fromAcc: "1000000", 
  toAcc: "1000001", 
  amount: 1500 
}
Response: { message: "Transfer successful" }

// If sender balance drops below 1000:
// → Email alert sent automatically ⚠️
```

**See detailed workflow:** [WORKFLOW.md - Scenario 2](./WORKFLOW.md#scenario-2-money-transfer-between-accounts)

---

## 🔒 Security Considerations

### Current Implementation
✅ Token-based authentication
✅ Input validation (amount, account existence)
✅ Balance checks (prevent overdrafts)
✅ Thread-safe operations
✅ SQL injection prevention (PreparedStatements)

### Recommended Improvements (For Production)
⚠️ Password hashing (currently plain text)
⚠️ Token expiration mechanism
⚠️ HTTPS/TLS encryption
⚠️ Rate limiting
⚠️ Environment variables for secrets
⚠️ Input sanitization enhancements

**See full security analysis:** [CODE_EXPLANATION.md - Section 9](./CODE_EXPLANATION.md#9-security-features)

---

## 📊 Technology Stack Summary

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Language** | Java 8+ | Core application |
| **Web Framework** | Spark Java | REST API server |
| **Database** | MySQL 8.x | Transaction logging |
| **Email** | Jakarta Mail | Alert notifications |
| **JSON** | Gson | Serialization |
| **Build Tool** | Maven | Dependency management |
| **Frontend** | HTML/CSS/JS | User interface |

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/gujjasandhya17/Banking-Activity-Simulation-Platform.git
   cd Banking-Activity-Simulation-Platform
   ```

2. **Setup MySQL Database**
   ```sql
   CREATE DATABASE banking_simulator;
   USE banking_simulator;
   CREATE TABLE transactions (
       id INT AUTO_INCREMENT PRIMARY KEY,
       type VARCHAR(20),
       account_number VARCHAR(50),
       amount DOUBLE,
       target_account VARCHAR(50),
       timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **Build and Run**
   ```bash
   mvn clean install
   mvn exec:java -Dexec.mainClass="com.bank.BankSimulator.ApiServer"
   ```

4. **Access the Application**
   - Open browser: `http://localhost:8085`
   - Navigate to registration page
   - Create account and start banking!

---

## 📞 Support & Contribution

For questions or contributions:
- Review the documentation files in this repository
- Check the [README.md](./README.md) for contact information
- Explore the code with guidance from [CODE_EXPLANATION.md](./CODE_EXPLANATION.md)

---

## 📝 Documentation Summary

This documentation package provides:
- ✅ **76 KB** of comprehensive documentation
- ✅ **2 detailed guides** (Code + Workflow)
- ✅ **20+ diagrams** (ASCII art flow charts)
- ✅ **30+ code examples** with explanations
- ✅ **10+ complete scenarios** with step-by-step walkthroughs
- ✅ **Complete API reference** with request/response examples

**Happy Learning! 🎓**

---

*Last Updated: January 2026*
*Project: Banking Activity Simulation Platform*
*Author: Comprehensive documentation created for educational purposes*
