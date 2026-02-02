const BASE_URL = "";

// Sorting state for View All Accounts
let accountsSortState = {
    sortBy: 'name', // default sort by name
    ascending: true
};

/* ---------------- UI HELPERS ---------------- */
function showSection(id) {
    document.querySelectorAll(".section")
        .forEach(section => section.style.display = "none");
    document.getElementById(id).style.display = "block";
    
    // Clear all response messages when switching sections
    const responseElements = [
        'create-result',
        'deposit-result',
        'withdraw-result',
        'transfer-result',
        'view-result'
    ];
    responseElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerText = "";
        }
    });
    
    // Clear all form inputs when switching sections
    const formInputs = [
        'c-name', 'c-email', 'c-balance',           // Create Account
        'd-acc', 'd-amount',                          // Deposit
        'w-acc', 'w-amount',                          // Withdraw
        't-from-acc', 't-to-acc', 't-amount',        // Transfer
        'v-acc'                                       // View Account
    ];
    formInputs.forEach(inputId => {
        const element = document.getElementById(inputId);
        if (element) {
            element.value = "";
        }
    });
    
    // Reset View All Accounts section to show placeholder
    if (id === 'viewall') {
        const resultDiv = document.getElementById("viewall-result");
        resultDiv.innerHTML = '<div class="table-placeholder">Click \'Load Accounts\' to view all account details.</div>';
    }
}

// Helper function to clear/reset form inputs
function clearForm(inputIds) {
    inputIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = "";
        }
    });
}

/* ---------------- AUTH ---------------- */
function getToken() {
    return localStorage.getItem("authToken");
}

function authHeaders() {
    return {
        "Authorization": getToken(),
        "Content-Type": "application/json"
    };
}

function handleUnauthorized(response) {
    if (response.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/auth/login.html";
        throw new Error("Unauthorized");
    }
    return response;
}

/* ---------------- CREATE ACCOUNT ---------------- */
function createAccount() {
    const data = {
        name: document.getElementById("c-name").value,
        email: document.getElementById("c-email").value,
        balance: document.getElementById("c-balance").value
    };

    fetch(BASE_URL + "/accounts/create", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data)
    })
    .then(handleUnauthorized)
    .then(res => res.json())
    .then(result => {
        const resultDiv = document.getElementById("create-result");
        resultDiv.innerText = "Account created successfully. Account No: " + result.accountNumber;
        resultDiv.style.color = "#27ae60";
        
        // Clear form inputs after successful submission
        clearForm(["c-name", "c-email", "c-balance"]);
    })
    .catch(err => console.error(err));
}

/* ---------------- DEPOSIT ---------------- */
function depositMoney() {
    const data = {
        accNo: document.getElementById("d-acc").value,
        amount: parseFloat(document.getElementById("d-amount").value)
    };

    fetch(BASE_URL + "/accounts/deposit", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data)
    })
    .then(handleUnauthorized)
    .then(res => {
        if (!res.ok) {
            return res.json().then(error => Promise.reject(error));
        }
        return res.json();
    })
    .then(result => {
        const resultDiv = document.getElementById("deposit-result");
        resultDiv.innerText = result.message;
        resultDiv.style.color = "#27ae60";
        
        // Clear form inputs after successful submission
        clearForm(["d-acc", "d-amount"]);
    })
    .catch(err => {
        const resultDiv = document.getElementById("deposit-result");
        resultDiv.innerText = err.message || "Deposit failed";
        resultDiv.style.color = "#ff4757";
    });
}

/* ---------------- WITHDRAW ---------------- */
function withdrawMoney() {
    const data = {
        accNo: document.getElementById("w-acc").value,
        amount: parseFloat(document.getElementById("w-amount").value)
    };

    fetch(BASE_URL + "/accounts/withdraw", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data)
    })
    .then(handleUnauthorized)
    .then(async response => {
        const resultDiv = document.getElementById("withdraw-result");
        const text = await response.text();
        try {
            const data = JSON.parse(text || "{}");
            resultDiv.innerText = data.message || (response.ok ? "Withdraw successful" : "Withdraw failed");
            resultDiv.style.color = response.ok ? "#27ae60" : "#ff4757";
            
            // Clear form inputs after successful submission
            if (response.ok) {
                clearForm(["w-acc", "w-amount"]);
            }
        } catch (e) {
            resultDiv.innerText = "Insufficient balance or session expired. Please try again.";
            resultDiv.style.color = "#ff4757";
        }
    })
    .catch(err => {
        const resultDiv = document.getElementById("withdraw-result");
        resultDiv.innerText = err.message || "Withdraw failed";
        resultDiv.style.color = "#ff4757";
    });
}

/* ---------------- TRANSFER ---------------- */
function transferMoney() {
    const data = {
        fromAcc: document.getElementById("t-from-acc").value,
        toAcc: document.getElementById("t-to-acc").value,
        amount: parseFloat(document.getElementById("t-amount").value)
    };

    fetch(BASE_URL + "/accounts/transfer", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data)
    })
    .then(handleUnauthorized)
    .then(async response => {
        const resultDiv = document.getElementById("transfer-result");
        const text = await response.text();
        try {
            const data = JSON.parse(text || "{}");
            resultDiv.innerText = data.message || (response.ok ? "Transfer successful" : "Transfer failed");
            resultDiv.style.color = response.ok ? "#27ae60" : "#ff4757";
            
            // Clear form inputs after successful submission
            if (response.ok) {
                clearForm(["t-from-acc", "t-to-acc", "t-amount"]);
            }
        } catch (e) {
            resultDiv.innerText = "Insufficient balance or session expired. Please try again.";
            resultDiv.style.color = "#ff4757";
        }
    })
    .catch(err => {
        const resultDiv = document.getElementById("transfer-result");
        resultDiv.innerText = err.message || "Transfer failed";
        resultDiv.style.color = "#ff4757";
    });
}

/* ---------------- VIEW ACCOUNT ---------------- */
function viewAccount() {
    const accNo = document.getElementById("v-acc").value;
    const resultDiv = document.getElementById("view-result");

    if (!accNo) {
        resultDiv.innerHTML = '<p style="text-align: center; color: #ff4757; font-weight: bold;">Please enter an account number</p>';
        return;
    }

    fetch(BASE_URL + "/accounts/" + accNo, {
        method: "GET",
        headers: { "Authorization": getToken() }
    })
    .then(res => {
        if (res.status === 401) {
            window.location.href = "/auth/login.html";
            throw new Error("Unauthorized");
        }
        if (res.status === 404) {
            throw new Error("Account not found");
        }
        if (!res.ok) throw new Error("Server error");
        return res.json();
    })
    .then(account => {
        const output = `
            <div class="account-detail-card">
                <div class="detail-row">
                    <div class="detail-label">Account Number</div>
                    <div class="detail-value">${account.accountNumber}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Holder Name</div>
                    <div class="detail-value">${account.holderName}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${account.email}</div>
                </div>
                <div class="detail-row highlight">
                    <div class="detail-label">Account Balance</div>
                    <div class="detail-value balance">₹${account.balance.toLocaleString()}</div>
                </div>
            </div>
        `;
        resultDiv.innerHTML = output;
        document.getElementById("v-acc").value = "";
    })
    .catch(err => {
        resultDiv.innerHTML = `<p style="text-align: center; color: #ff4757; font-weight: bold;">❌ ${err.message}</p>`;
    });
}

/* ---------------- VIEW ALL ACCOUNTS ---------------- */
function viewAllAccounts() {
    const resultDiv = document.getElementById("viewall-result");
    
    fetch(BASE_URL + "/accounts/all", {
        method: "GET",
        headers: { "Authorization": getToken() }
    })
    .then(handleUnauthorized)
    .then(res => res.json())
    .then(accounts => {
        if (!accounts || accounts.length === 0) {
            resultDiv.innerHTML = '<div class="table-placeholder">No accounts found. Create an account to get started.</div>';
            return;
        }
        
        // Sort accounts by default (by name ascending)
        sortAccounts(accounts);
        
        // Render the table with sort controls
        renderAccountsTable(accounts);
    })
    .catch(err => console.error(err));
}

// Function to sort accounts based on current sort state
function sortAccounts(accounts) {
    accounts.sort((a, b) => {
        let valueA, valueB;
        
        if (accountsSortState.sortBy === 'name') {
            valueA = a.holderName.toLowerCase();
            valueB = b.holderName.toLowerCase();
        } else if (accountsSortState.sortBy === 'accNo') {
            valueA = parseInt(a.accountNumber);
            valueB = parseInt(b.accountNumber);
        }
        
        if (valueA < valueB) {
            return accountsSortState.ascending ? -1 : 1;
        } else if (valueA > valueB) {
            return accountsSortState.ascending ? 1 : -1;
        }
        return 0;
    });
}

// Function to render the accounts table with sort controls
function renderAccountsTable(accounts) {
    const resultDiv = document.getElementById("viewall-result");
    
    // Determine sort indicator for headers
    const nameIndicator = accountsSortState.sortBy === 'name' 
        ? (accountsSortState.ascending ? ' ▲' : ' ▼') 
        : '';
    const accNoIndicator = accountsSortState.sortBy === 'accNo' 
        ? (accountsSortState.ascending ? ' ▲' : ' ▼') 
        : '';
    
    let output = `
        <div class="sort-controls">
            <button class="sort-btn ${accountsSortState.sortBy === 'name' ? 'active' : ''}" onclick="changeSortBy('name')">
                Sort by Name${nameIndicator}
            </button>
            <button class="sort-btn ${accountsSortState.sortBy === 'accNo' ? 'active' : ''}" onclick="changeSortBy('accNo')">
                Sort by Account No${accNoIndicator}
            </button>
        </div>
        <table class="accounts-table">
            <thead>
                <tr>
                    <th onclick="toggleSort('accNo')">Account No</th>
                    <th onclick="toggleSort('name')">Name</th>
                    <th>Email</th>
                    <th>Balance</th>
                </tr>
            </thead>
            <tbody>
    `;

    accounts.forEach((acc, index) => {
        output += `
            <tr class="${index % 2 === 0 ? 'even' : 'odd'}">
                <td data-label="Account No"><strong>${acc.accountNumber}</strong></td>
                <td data-label="Name">${acc.holderName}</td>
                <td data-label="Email">${acc.email}</td>
                <td data-label="Balance"><strong>₹${acc.balance.toLocaleString()}</strong></td>
            </tr>
        `;
    });

    output += "</tbody></table>";
    resultDiv.innerHTML = output;
}

// Function to change sort by field
function changeSortBy(sortBy) {
    if (accountsSortState.sortBy === sortBy) {
        // If clicking the same sort button, toggle ascending/descending
        accountsSortState.ascending = !accountsSortState.ascending;
    } else {
        // If clicking a different sort button, set it as primary sort (ascending)
        accountsSortState.sortBy = sortBy;
        accountsSortState.ascending = true;
    }
    
    // Re-fetch and re-render with new sort
    viewAllAccounts();
}

// Function to toggle sort (called from table headers)
function toggleSort(sortBy) {
    changeSortBy(sortBy);
}
