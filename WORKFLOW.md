# 🔄 BankSimulator - Workflow Documentation

## Table of Contents
1. [Application Startup Workflow](#application-startup-workflow)
2. [User Authentication Workflow](#user-authentication-workflow)
3. [Account Creation Workflow](#account-creation-workflow)
4. [Transaction Workflows](#transaction-workflows)
5. [Alert System Workflow](#alert-system-workflow)
6. [Complete End-to-End Scenarios](#complete-end-to-end-scenarios)
7. [System Architecture Flow](#system-architecture-flow)

---

## 1. Application Startup Workflow

### Server Initialization Sequence

```
┌─────────────────────────────────────────────────────┐
│         Application Startup (ApiServer.java)        │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ 1. Read PORT env var │
        │    Default: 8085     │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ 2. Configure Spark   │
        │    - Set port        │
        │    - Set static files│
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │ 3. Initialize Components      │
        │  - Gson (JSON parser)         │
        │  - AccountRepository          │
        │  - AccountService             │
        │  - TransactionRepository      │
        │  - AlertService (threshold=1000)│
        │  - TransactionService         │
        └──────────┬────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ 4. Setup Routes       │
        │  - Auth routes        │
        │  - Account routes     │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ 5. Apply AuthFilter   │
        │    (Secure endpoints) │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ 6. Server Ready       │
        │    Listening on port  │
        └───────────────────────┘
```

**Step-by-Step Explanation:**

1. **Port Configuration**
   - Reads `PORT` environment variable
   - Falls back to 8085 for local development
   - Supports cloud deployment (Railway, Heroku, etc.)

2. **Spark Web Framework Setup**
   - `port(port)`: Configures server port
   - `staticFiles.location("/public")`: Serves HTML/CSS/JS from resources/public

3. **Dependency Injection (Manual)**
   - Creates repository instances
   - Creates service instances with dependencies
   - Sets up alert threshold at ₹1000

4. **Route Registration**
   - `AuthController.routes()`: Registers /register and /login
   - API routes: /accounts/create, /accounts/deposit, etc.

5. **Security Filter Application**
   - `AuthFilter.apply()`: Protects /accounts/* endpoints
   - Requires valid token in Authorization header

6. **Server Ready**
   - Prints "Server started on port 8085"
   - Ready to accept HTTP requests

---

## 2. User Authentication Workflow

### Registration Flow

```
┌──────────────┐
│  User Opens  │
│register.html │
└──────┬───────┘
       │
       │ Fills: username, password
       │ Clicks "Register"
       │
       ▼
┌────────────────────────────────────────┐
│  Frontend (auth.js)                    │
│  - Validates form                      │
│  - Sends POST /register                │
│  - Form data: username, password       │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│  AuthController.routes()                │
│  POST /register endpoint                │
│  1. Extract username, password          │
│  2. Call UserRepository.register()      │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│  UserRepository                         │
│  1. Check if username exists            │
│  2. If exists → return false            │
│  3. If new → save to HashMap            │
│  4. Return true                         │
└──────────────┬─────────────────────────┘
               │
               ▼
         ┌─────┴─────┐
         │  Success? │
         └─────┬─────┘
               │
       ┌───────┴────────┐
       │                │
      YES              NO
       │                │
       ▼                ▼
┌──────────────┐  ┌───────────────────┐
│ Return 200   │  │ Return 400        │
│"Registration │  │"User already      │
│ successful"  │  │ exists"           │
└──────┬───────┘  └─────┬─────────────┘
       │                │
       ▼                ▼
┌──────────────────────────────────────┐
│  Frontend displays result             │
│  - Success: Redirect to login         │
│  - Error: Show error message          │
└───────────────────────────────────────┘
```

---

### Login Flow

```
┌──────────────┐
│  User Opens  │
│  login.html  │
└──────┬───────┘
       │
       │ Enters: username, password
       │ Clicks "Login"
       │
       ▼
┌────────────────────────────────────────┐
│  Frontend (auth.js)                    │
│  - Validates form                      │
│  - Sends POST /login                   │
│  - Form data: username, password       │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│  AuthController.routes()                │
│  POST /login endpoint                   │
│  1. Extract username, password          │
│  2. Call AuthService.login()            │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│  AuthService.login()                    │
│  1. Call UserRepository.validate()      │
│  2. If valid:                           │
│     - Generate UUID token               │
│     - Store in activeTokens set         │
│     - Return token                      │
│  3. If invalid:                         │
│     - Return null                       │
└──────────────┬─────────────────────────┘
               │
               ▼
         ┌─────┴─────┐
         │  Valid?   │
         └─────┬─────┘
               │
       ┌───────┴────────┐
       │                │
      YES              NO
       │                │
       ▼                ▼
┌──────────────┐  ┌───────────────────┐
│ Return 200   │  │ Return 401        │
│ <UUID-TOKEN> │  │"Invalid           │
│              │  │ credentials"      │
└──────┬───────┘  └─────┬─────────────┘
       │                │
       ▼                ▼
┌────────────────────────────────────────┐
│  Frontend receives response            │
│  - Success:                            │
│    • Store token in localStorage       │
│    • Redirect to banking.html          │
│  - Error:                              │
│    • Show error message                │
│    • Stay on login page                │
└────────────────────────────────────────┘
```

---

### Authenticated Request Flow

```
┌───────────────────────────────────────┐
│  User makes request to protected      │
│  endpoint (e.g., POST /accounts/create)│
└────────────────┬──────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│  Frontend (script.js)                  │
│  - Gets token from localStorage        │
│  - Adds Authorization header           │
│  - Sends request                       │
└────────────────┬───────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│  AuthFilter.apply()                    │
│  - Intercepts request to /accounts/*   │
│  - Extracts Authorization header       │
│  - Calls AuthService.isAuthorized()    │
└────────────────┬───────────────────────┘
                 │
                 ▼
         ┌───────┴────────┐
         │  Token Valid?  │
         └───────┬────────┘
                 │
         ┌───────┴────────┐
         │                │
        YES              NO
         │                │
         ▼                ▼
┌─────────────────┐  ┌──────────────┐
│ Allow request   │  │ Halt request │
│ Continue to     │  │ Return 401   │
│ endpoint        │  │"Unauthorized"│
└─────────────────┘  └──────────────┘
```

---

## 3. Account Creation Workflow

### Complete Account Creation Flow

```
┌─────────────────────────────────────┐
│  User in banking.html               │
│  - Fills: Name, Email, Balance      │
│  - Clicks "Create Account"          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Frontend (script.js)               │
│  createAccount() function           │
│  1. Get form values                 │
│  2. Validate inputs                 │
│  3. Get token from localStorage     │
│  4. Send POST /accounts/create      │
│     Headers: Authorization token    │
│     Body: {name, email, balance}    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  AuthFilter validates token         │
│  (If invalid → 401 Unauthorized)    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  ApiServer                          │
│  POST /accounts/create endpoint     │
│  1. Parse JSON body using Gson      │
│  2. Extract name, email, balance    │
│  3. Call accountService.createAccount()│
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  AccountService.createAccount()     │
│  1. Validate: balance >= 0          │
│  2. If invalid:                     │
│     throw InvalidAmountException    │
│  3. Create new Account object       │
│     (auto-generates account number) │
│  4. Call repo.save()                │
│  5. Return account object           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Account Constructor                │
│  1. Generate account number:        │
│     COUNTER.getAndIncrement()       │
│     (e.g., 1000000, 1000001, ...)   │
│  2. Set holderName, email, balance  │
│  3. Return Account object           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  AccountRepository.save()           │
│  1. Store in HashMap:               │
│     accounts.put(accNo, account)    │
│  2. Account is now retrievable      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  ApiServer returns Account as JSON  │
│  {                                  │
│    "accountNumber": "1000000",      │
│    "holderName": "John Doe",        │
│    "email": "john@example.com",     │
│    "balance": 5000.00               │
│  }                                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Frontend (script.js)               │
│  1. Parse JSON response             │
│  2. Display success message         │
│  3. Show account number             │
│  4. Clear form                      │
│  5. Refresh account list            │
└─────────────────────────────────────┘
```

**Key Points:**
- Account numbers are **auto-generated** starting from 1000000
- Uses **AtomicLong** for thread-safe counter increment
- Account is stored in **in-memory HashMap** (lost on restart)
- **No database storage** for accounts (design choice for simplicity)

---

## 4. Transaction Workflows

### 4.1 Deposit Workflow

```
┌─────────────────────────────────────┐
│  User enters:                       │
│  - Account Number                   │
│  - Amount                           │
│  Clicks "Deposit"                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Frontend validates & sends         │
│  POST /accounts/deposit             │
│  Body: {accNo, amount}              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  TransactionService.deposit()       │
│                                     │
│  Step 1: Validate amount > 0        │
│  ├─ If invalid → throw               │
│  │   InvalidAmountException         │
│  │                                   │
│  Step 2: Get account                │
│  ├─ accountService.getAccount(accNo)│
│  ├─ If not found → throw             │
│  │   AccountNotFoundException       │
│  │                                   │
│  Step 3: Credit account             │
│  ├─ account.credit(amount)          │
│  │   └─ balance = balance + amount  │
│  │                                   │
│  Step 4: Log to file                │
│  ├─ FileReportUtil.writeLine()      │
│  │   "DEPOSIT | Acc: X | Amount: Y" │
│  │                                   │
│  Step 5: Log to database            │
│  ├─ transactionRepository           │
│  │   .logTransaction("DEPOSIT",...)  │
│  │                                   │
│  Step 6: Check for alerts           │
│  └─ alertService.checkBalance()     │
│      (Usually no alert for deposit) │
└─────────────────────────────────────┘
```

**Parallel Activities:**

```
         ┌─ Deposit Transaction ─┐
         │                       │
    ┌────▼────┐           ┌─────▼──────┐
    │  File   │           │  Database  │
    │ Logging │           │  Logging   │
    └─────────┘           └────────────┘
         │                      │
         └──────────┬───────────┘
                    │
                    ▼
            ┌───────────────┐
            │ Alert Check   │
            │ (Balance OK?) │
            └───────────────┘
```

---

### 4.2 Withdraw Workflow

```
┌─────────────────────────────────────┐
│  User enters:                       │
│  - Account Number                   │
│  - Amount                           │
│  Clicks "Withdraw"                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Frontend validates & sends         │
│  POST /accounts/withdraw            │
│  Body: {accNo, amount}              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  TransactionService.withdraw()      │
│                                     │
│  Step 1: Validate amount > 0        │
│  ├─ If invalid → throw               │
│  │   InvalidAmountException         │
│  │                                   │
│  Step 2: Get account                │
│  ├─ accountService.getAccount(accNo)│
│  ├─ If not found → throw             │
│  │   AccountNotFoundException       │
│  │                                   │
│  Step 3: Check sufficient balance   │
│  ├─ if (balance < amount)           │
│  │   throw InsufficientBalance      │
│  │         Exception                │
│  │                                   │
│  Step 4: Debit account              │
│  ├─ account.debit(amount)           │
│  │   └─ balance = balance - amount  │
│  │                                   │
│  Step 5: Log to file                │
│  ├─ FileReportUtil.writeLine()      │
│  │   "WITHDRAW | Acc: X | Amount: Y"│
│  │                                   │
│  Step 6: Log to database            │
│  ├─ transactionRepository           │
│  │   .logTransaction("WITHDRAW",..) │
│  │                                   │
│  Step 7: Check for low balance      │
│  └─ alertService.checkBalance()     │
│      └─ if (balance <= threshold)   │
│         Send email alert            │
└─────────────────────────────────────┘
```

**Balance Check Logic:**

```
┌─────────────────────────────────┐
│  Account Balance: 1500          │
│  Withdraw Amount: 700           │
└────────────┬────────────────────┘
             │
             ▼
      ┌──────────────┐
      │ Balance Check│
      │ 1500 >= 700? │
      └──────┬───────┘
             │
             ▼ YES
┌─────────────────────────────────┐
│  Debit: 1500 - 700 = 800        │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Alert Check                    │
│  800 <= 1000? → YES             │
│  Send low balance email!        │
└─────────────────────────────────┘
```

---

### 4.3 Transfer Workflow

```
┌─────────────────────────────────────┐
│  User enters:                       │
│  - From Account (Sender)            │
│  - To Account (Receiver)            │
│  - Amount                           │
│  Clicks "Transfer"                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Frontend validates & sends         │
│  POST /accounts/transfer            │
│  Body: {fromAcc, toAcc, amount}     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  TransactionService.transfer()      │
│                                     │
│  Step 1: Validate amount > 0        │
│  ├─ If invalid → throw               │
│  │   IllegalArgumentException       │
│  │                                   │
│  Step 2: Get sender account         │
│  ├─ sender = getAccount(fromAcc)    │
│  ├─ If not found → throw             │
│  │   AccountNotFoundException       │
│  │                                   │
│  Step 3: Get receiver account       │
│  ├─ receiver = getAccount(toAcc)    │
│  ├─ If not found → throw             │
│  │   AccountNotFoundException       │
│  │                                   │
│  Step 4: Check sender balance       │
│  ├─ if (sender.balance < amount)    │
│  │   throw InsufficientBalance      │
│  │         Exception                │
│  │                                   │
│  Step 5: Execute transfer           │
│  ├─ sender.debit(amount)            │
│  └─ receiver.credit(amount)         │
│      (Atomic operation)             │
│                                     │
│  Step 6: Log to file                │
│  ├─ FileReportUtil.writeLine()      │
│  │   "TRANSFER | From: X | To: Y |  │
│  │    Amount: Z"                    │
│  │                                   │
│  Step 7: Log to database            │
│  ├─ transactionRepository           │
│  │   .logTransaction("TRANSFER",..) │
│  │                                   │
│  Step 8: Check both balances        │
│  ├─ alertService.checkBalance(sender)│
│  └─ alertService.checkBalance(receiver)│
│      (Either might need alert)      │
└─────────────────────────────────────┘
```

**Transfer Visualization:**

```
Before Transfer:
┌─────────────────┐            ┌─────────────────┐
│ Sender Account  │            │Receiver Account │
│ Acc: 1000000    │            │ Acc: 1000001    │
│ Balance: 2000   │            │ Balance: 500    │
└─────────────────┘            └─────────────────┘

Transfer Amount: 1200

During Transfer:
┌─────────────────┐            ┌─────────────────┐
│ Sender Account  │──Transfer──▶│Receiver Account │
│ Debit: -1200    │   1200     │ Credit: +1200   │
└─────────────────┘            └─────────────────┘

After Transfer:
┌─────────────────┐            ┌─────────────────┐
│ Sender Account  │            │Receiver Account │
│ Acc: 1000000    │            │ Acc: 1000001    │
│ Balance: 800    │            │ Balance: 1700   │
│ ⚠ LOW BALANCE! │            └─────────────────┘
└─────────────────┘
       │
       ▼
┌─────────────────┐
│  Email Alert    │
│  Sent to Sender │
└─────────────────┘
```

**Thread Safety in Transfer:**

The transfer operation is thread-safe because:
1. `account.debit()` is synchronized
2. `account.credit()` is synchronized
3. Even if multiple threads transfer simultaneously, balance updates are atomic

---

## 5. Alert System Workflow

### Low Balance Alert Trigger

```
┌─────────────────────────────────────┐
│  Any Transaction Completes          │
│  (Deposit, Withdraw, Transfer)      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  TransactionService calls           │
│  alertService.checkBalance(account) │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  AlertService.checkBalance()        │
│                                     │
│  Compare: account.balance vs threshold│
│  Default threshold: 1000            │
└──────────────┬──────────────────────┘
               │
               ▼
         ┌─────┴──────┐
         │  Balance   │
         │  <= 1000?  │
         └─────┬──────┘
               │
       ┌───────┴────────┐
       │                │
      YES              NO
       │                │
       ▼                ▼
┌──────────────┐  ┌────────────┐
│ Send Alert   │  │ Do Nothing │
│              │  │            │
└──────┬───────┘  └────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Compose Email Message:             │
│                                     │
│  Subject: ⚠ Low Balance Alert       │
│                                     │
│  Body:                              │
│  "Dear [Name],                      │
│   Your account balance has fallen   │
│   below the minimum threshold.      │
│                                     │
│   Current Balance: [amount]         │
│   Account Number: [accNo]           │
│   ...                               │
│  "                                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  EmailUtil.sendEmail()              │
│  - Configure SMTP (Gmail)           │
│  - Authenticate with app password   │
│  - Send email to account.email      │
└──────────────┬──────────────────────┘
               │
               ▼
         ┌─────┴──────┐
         │  Success?  │
         └─────┬──────┘
               │
       ┌───────┴────────┐
       │                │
      YES              NO
       │                │
       ▼                ▼
┌──────────────┐  ┌─────────────────┐
│ Log Success  │  │ Log Error       │
│ Console:     │  │ Console:        │
│ "Email sent  │  │ "Email failed:  │
│  to: [email]"│  │  [error]"       │
└──────────────┘  └─────────────────┘
```

### Email Sending Flow (EmailUtil)

```
┌─────────────────────────────────────┐
│  EmailUtil.sendEmail()              │
│  Parameters: to, subject, body      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Configure SMTP Properties          │
│  - mail.smtp.auth = true            │
│  - mail.smtp.starttls.enable = true │
│  - mail.smtp.host = smtp.gmail.com  │
│  - mail.smtp.port = 587             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Create Mail Session                │
│  - Authenticator with credentials   │
│  - FROM_EMAIL: 17sandhya23@gmail.com│
│  - APP_PASSWORD: (Gmail app pwd)    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Create MimeMessage                 │
│  - Set From address                 │
│  - Set To address (recipient)       │
│  - Set Subject                      │
│  - Set Body (text/plain)            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Transport.send(message)            │
│  - Connects to Gmail SMTP           │
│  - Authenticates                    │
│  - Sends email                      │
│  - Closes connection                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Email delivered to recipient       │
│  ✉️ Inbox: Low Balance Alert        │
└─────────────────────────────────────┘
```

---

## 6. Complete End-to-End Scenarios

### Scenario 1: New User Complete Journey

```
Step 1: Registration
User → register.html → POST /register
  ├─ Username: "alice"
  ├─ Password: "password123"
  └─ Result: "Registration successful"

Step 2: Login
User → login.html → POST /login
  ├─ Username: "alice"
  ├─ Password: "password123"
  └─ Result: Token "abc-123-xyz-789"
           Store in localStorage

Step 3: Create Account
User → banking.html → POST /accounts/create
  ├─ Authorization: "abc-123-xyz-789"
  ├─ Name: "Alice Johnson"
  ├─ Email: "alice@email.com"
  ├─ Balance: 5000
  └─ Result: Account "1000000" created

Step 4: Deposit Money
User → POST /accounts/deposit
  ├─ Authorization: "abc-123-xyz-789"
  ├─ Account: "1000000"
  ├─ Amount: 2000
  └─ Result: New balance = 7000
           No alert (balance > 1000)

Step 5: Withdraw Money
User → POST /accounts/withdraw
  ├─ Authorization: "abc-123-xyz-789"
  ├─ Account: "1000000"
  ├─ Amount: 6500
  └─ Result: New balance = 500
           ⚠ Alert sent to alice@email.com
           "Your balance is below 1000"

Step 6: View Account
User → GET /accounts/1000000
  ├─ Authorization: "abc-123-xyz-789"
  └─ Result: Display balance = 500
```

---

### Scenario 2: Money Transfer Between Accounts

```
Initial State:
┌──────────────────────────┐  ┌──────────────────────────┐
│ Account A (Sender)       │  │ Account B (Receiver)     │
│ - Number: 1000000        │  │ - Number: 1000001        │
│ - Holder: Alice          │  │ - Holder: Bob            │
│ - Balance: 3000          │  │ - Balance: 500           │
└──────────────────────────┘  └──────────────────────────┘

Action: Alice transfers 2500 to Bob

POST /accounts/transfer
├─ Authorization: <alice-token>
├─ fromAcc: "1000000"
├─ toAcc: "1000001"
└─ amount: 2500

Processing:
1. Validate amount > 0 ✓
2. Get Account A (Alice) ✓
3. Get Account B (Bob) ✓
4. Check Alice balance >= 2500 ✓ (3000 >= 2500)
5. Alice.debit(2500) → Balance = 500
6. Bob.credit(2500) → Balance = 3000
7. Log to file:
   "TRANSFER | From: 1000000 | To: 1000001 | Amount: 2500"
8. Log to database:
   INSERT INTO transactions (type, account_number, amount, target_account)
   VALUES ('TRANSFER', '1000000', 2500, '1000001')
9. Check Alice balance: 500 <= 1000 → Send alert email ⚠️
10. Check Bob balance: 3000 > 1000 → No alert

Final State:
┌──────────────────────────┐  ┌──────────────────────────┐
│ Account A (Sender)       │  │ Account B (Receiver)     │
│ - Number: 1000000        │  │ - Number: 1000001        │
│ - Holder: Alice          │  │ - Holder: Bob            │
│ - Balance: 500 ⚠         │  │ - Balance: 3000          │
│ - Email alert sent!      │  │                          │
└──────────────────────────┘  └──────────────────────────┘

Result: "Transfer successful"
```

---

### Scenario 3: Error Handling Examples

#### **Error 1: Insufficient Balance**

```
Account Balance: 1000
Withdraw Amount: 1500

POST /accounts/withdraw
├─ accNo: "1000000"
└─ amount: 1500

Flow:
1. Validate amount > 0 ✓
2. Get account ✓
3. Check balance: 1000 >= 1500? ✗
4. Throw InsufficientBalanceException
5. ApiServer catches exception
6. Return 400 Bad Request
   { "error": "Insufficient Balance" }

User sees: "Transaction failed: Insufficient Balance"
```

---

#### **Error 2: Account Not Found**

```
POST /accounts/deposit
├─ accNo: "9999999"  (doesn't exist)
└─ amount: 500

Flow:
1. Validate amount > 0 ✓
2. Get account from repo → null
3. Throw AccountNotFoundException
4. ApiServer catches exception
5. Return 404 Not Found
   { "error": "Account not found: 9999999" }

User sees: "Account 9999999 does not exist"
```

---

#### **Error 3: Invalid Amount**

```
POST /accounts/deposit
├─ accNo: "1000000"
└─ amount: -500  (negative)

Flow:
1. Validate amount > 0 ✗
2. Throw InvalidAmountException
3. ApiServer catches exception
4. Return 400 Bad Request
   { "error": "Amount should not be negative" }

User sees: "Invalid amount. Must be positive."
```

---

#### **Error 4: Unauthorized Access**

```
POST /accounts/create
├─ Authorization: "invalid-token"
├─ name: "John"
├─ email: "john@email.com"
└─ balance: 5000

Flow:
1. AuthFilter intercepts request
2. Extract Authorization header: "invalid-token"
3. Call AuthService.isAuthorized("invalid-token")
4. Token not in activeTokens set
5. Return false
6. AuthFilter halts request
7. Return 401 Unauthorized

User sees: "Unauthorized. Please login again."
Frontend redirects to login page
```

---

## 7. System Architecture Flow

### Multi-Layer Request Processing

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│  Web Browser → HTML/CSS/JS (banking.html, script.js)   │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ HTTP Request
                         │ (JSON payload)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                PRESENTATION LAYER                       │
│  ┌──────────────┐    ┌─────────────────────────┐       │
│  │ AuthFilter   │───▶│   ApiServer.java        │       │
│  │ Token Check  │    │   Route Handlers        │       │
│  └──────────────┘    └──────────┬──────────────┘       │
└────────────────────────────────┬────────────────────────┘
                                 │
                                 │ Deserialize JSON
                                 │ Extract parameters
                                 ▼
┌─────────────────────────────────────────────────────────┐
│                  SERVICE LAYER                          │
│  ┌────────────────┐  ┌──────────────────┐              │
│  │ AccountService │  │TransactionService│              │
│  │ Business Logic │◀─┤  Orchestration   │              │
│  └────────────────┘  └────────┬─────────┘              │
│                               │                         │
│                     ┌─────────┴─────────┐               │
│                     │                   │               │
│              ┌──────▼─────┐     ┌──────▼────────┐      │
│              │AlertService│     │ File/DB/Email │      │
│              │            │     │   Utilities    │      │
│              └────────────┘     └───────────────┘      │
└────────────────────────────────┬────────────────────────┘
                                 │
                                 │ Data Operations
                                 ▼
┌─────────────────────────────────────────────────────────┐
│                REPOSITORY LAYER                         │
│  ┌──────────────────┐    ┌────────────────────────┐    │
│  │AccountRepository │    │TransactionRepository   │    │
│  │   (HashMap)      │    │     (MySQL)            │    │
│  └──────────────────┘    └────────────────────────┘    │
└────────────────────────────────┬────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────┐
│                  DATA LAYER                             │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌──────────┐ │
│  │ In-Mem  │  │  MySQL  │  │ File Sys │  │ SMTP     │ │
│  │ HashMap │  │Database │  │  .txt    │  │ Gmail    │ │
│  └─────────┘  └─────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

### Data Flow Summary

1. **Client makes request** → banking.html (JavaScript)
2. **HTTP request sent** → POST /accounts/transfer with JSON
3. **AuthFilter validates** → Checks Authorization token
4. **ApiServer receives** → Parses JSON, extracts data
5. **Service processes** → Business logic, validations
6. **Repository stores** → Persist to storage (memory/DB)
7. **Utilities execute** → File logging, email alerts
8. **Response returned** → JSON success/error message
9. **Client displays** → Update UI with result

---

## Summary

The BankSimulator workflow demonstrates:

✅ **Authentication Flow**: Token-based security for API access
✅ **Account Management**: Creation, retrieval, and listing
✅ **Transaction Processing**: Deposit, withdraw, transfer with validations
✅ **Alert System**: Automatic low-balance email notifications
✅ **Error Handling**: Graceful exception handling with meaningful messages
✅ **Audit Trail**: File and database logging for compliance
✅ **Thread Safety**: Synchronized operations for concurrent access

This comprehensive workflow documentation helps understand how all components interact to provide a complete banking simulation experience.
