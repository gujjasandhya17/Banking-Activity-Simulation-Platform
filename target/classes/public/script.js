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

    fetch(BASE_URL + "/accounts/create", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data)
    })
    .then(handleUnauthorized)
    .then(res => res.json())
    .then(result => {
        document.getElementById("create-result").innerText =
            "Account created successfully. Account No: " + result.accountNumber;
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
    .then(res => res.json())
    .then(result => {
        document.getElementById("deposit-result").innerText = result.message;
    })
    .catch(err => console.error(err));
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
    .then(res => res.json())
    .then(result => {
        document.getElementById("withdraw-result").innerText = result.message;
    })
    .catch(err => console.error(err));
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
    .then(res => res.json())
    .then(result => {
        document.getElementById("transfer-result").innerText = result.message;
    })
    .catch(err => console.error(err));
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
