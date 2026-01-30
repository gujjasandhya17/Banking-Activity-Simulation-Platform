const BASE_URL = "";

/* ---------------- UI HELPERS ---------------- */
function showSection(id) {
    document.querySelectorAll(".section")
        .forEach(section => section.style.display = "none");
    document.getElementById(id).style.display = "block";
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

    const resultDiv = document.getElementById("create-result");

    fetch(BASE_URL + "/accounts/create", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data)
    })
    .then(res => {
        if (res.status === 401) {
            window.location.href = "/auth/login.html";
            throw new Error("Unauthorized");
        }
        if (!res.ok) throw new Error("Server error");
        return res.json();
    })
    .then(result => {
        resultDiv.innerText = "Account created successfully. Account No: " + result.accountNumber;
        resultDiv.style.color = "#27ae60";
        document.getElementById("c-name").value = "";
        document.getElementById("c-email").value = "";
        document.getElementById("c-balance").value = "";
    })
    .catch(err => {
        resultDiv.innerText = "Error: " + err.message;
        resultDiv.style.color = "#ff4757";
    });
}

/* ---------------- DEPOSIT ---------------- */
function depositMoney() {
    const data = {
        accNo: document.getElementById("d-acc").value,
        amount: parseFloat(document.getElementById("d-amount").value)
    };

    const resultDiv = document.getElementById("deposit-result");

    fetch(BASE_URL + "/accounts/deposit", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data)
    })
    .then(res => {
        if (res.status === 401) {
            window.location.href = "/auth/login.html";
            throw new Error("Unauthorized");
        }
        if (!res.ok) throw new Error("Server error");
        return res.json();
    })
    .then(result => {
        resultDiv.innerText = result.message;
        resultDiv.style.color = "#27ae60";
        document.getElementById("d-acc").value = "";
        document.getElementById("d-amount").value = "";
    })
    .catch(err => {
        resultDiv.innerText = "Error: " + err.message;
        resultDiv.style.color = "#ff4757";
    });
}

/* ---------------- WITHDRAW ---------------- */
function withdrawMoney() {
    const data = {
        accNo: document.getElementById("w-acc").value,
        amount: parseFloat(document.getElementById("w-amount").value)
    };

    const resultDiv = document.getElementById("withdraw-result");
    console.log("Withdraw button clicked with data:", data);

    fetch(BASE_URL + "/accounts/withdraw", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data)
    })
    .then(res => {
        console.log("Withdraw response status:", res.status);
        if (res.status === 401) {
            window.location.href = "/auth/login.html";
            throw new Error("Unauthorized");
        }
        if (!res.ok) throw new Error("Server error: " + res.status);
        return res.json();
    })
    .then(result => {
        console.log("Withdraw result:", result);
        resultDiv.innerText = result.message;
        resultDiv.style.color = "#27ae60";
        document.getElementById("w-acc").value = "";
        document.getElementById("w-amount").value = "";
    })
    .catch(err => {
        console.error("Withdraw error:", err);
        resultDiv.innerText = "Error: " + err.message;
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

    const resultDiv = document.getElementById("transfer-result");
    console.log("Transfer button clicked with data:", data);

    fetch(BASE_URL + "/accounts/transfer", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data)
    })
    .then(res => {
        console.log("Transfer response status:", res.status);
        if (res.status === 401) {
            window.location.href = "/auth/login.html";
            throw new Error("Unauthorized");
        }
        if (!res.ok) throw new Error("Server error: " + res.status);
        return res.json();
    })
    .then(result => {
        console.log("Transfer result:", result);
        resultDiv.innerText = result.message;
        resultDiv.style.color = "#27ae60";
        document.getElementById("t-from-acc").value = "";
        document.getElementById("t-to-acc").value = "";
        document.getElementById("t-amount").value = "";
    })
    .catch(err => {
        console.error("Transfer error:", err);
        resultDiv.innerText = "Error: " + err.message;
        resultDiv.style.color = "#ff4757";
    });
}

/* ---------------- VIEW ACCOUNT ---------------- */
function viewAccount() {
    const accNo = document.getElementById("v-acc").value;

    fetch(BASE_URL + "/accounts/" + accNo, {
        method: "GET",
        headers: { "Authorization": getToken() }
    })
    .then(handleUnauthorized)
    .then(res => res.json())
    .then(account => {
        document.getElementById("view-result").innerHTML = `
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
    })
    .catch(err => console.error(err));
}

/* ---------------- VIEW ALL ACCOUNTS ---------------- */
function viewAllAccounts() {
    fetch(BASE_URL + "/accounts/all", {
        method: "GET",
        headers: { "Authorization": getToken() }
    })
    .then(handleUnauthorized)
    .then(res => res.json())
    .then(accounts => {
        if (!accounts || accounts.length === 0) {
            document.getElementById("viewall-result").innerHTML = '<p style="text-align: center; color: #999;">No accounts found.</p>';
            return;
        }
        let output = `
            <table class="accounts-table">
                <thead>
                    <tr>
                        <th>Account No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
        `;

        accounts.forEach((acc, index) => {
            output += `
                <tr class="${index % 2 === 0 ? 'even' : 'odd'}">
                    <td><strong>${acc.accountNumber}</strong></td>
                    <td>${acc.holderName}</td>
                    <td>${acc.email}</td>
                    <td><strong>₹${acc.balance.toLocaleString()}</strong></td>
                </tr>
            `;
        });

        output += "</tbody></table>";
        document.getElementById("viewall-result").innerHTML = output;
    })
    .catch(err => console.error(err));
}
