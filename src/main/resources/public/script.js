const BASE_URL = "";


function showSection(id){
    document.querySelectorAll(".section").forEach(section => section.style.display = "none");
    document.getElementById(id).style.display = "block";    
}

// Create Account
function createAccount(){
    const data = {
        name: document.getElementById("c-name").value,
        email: document.getElementById("c-email").value,
        balance: document.getElementById("c-balance").value
    };
    fetch(BASE_URL+"/accounts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        document.getElementById("create-result").innerText = 
            "Account created successfully with ID: " + result.accountNumber;

        console.log("Account Creation Response:", result);
    })
    
}

// Deposit
function depositMoney(){
    const data = {
        accNo: document.getElementById("d-acc").value,
        amount: parseFloat(document.getElementById("d-amount").value)
    };
    fetch(BASE_URL +"/accounts/deposit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
})
.then(response => {
    if (!response.ok) {
        throw new Error("Deposit failed (API not found)");
    }
    return response.json();
})
.then(data => {
    document.getElementById("deposit-result").innerText = data.message;
})
.catch(err => {
    document.getElementById("deposit-result").innerText = err.message;
});
    
    
}

// Withdraw
function withdrawMoney(){
    const data = {
        accNo: document.getElementById("w-acc").value,
        amount: document.getElementById("w-amount").value
    };
    fetch(BASE_URL+"/accounts/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Withdraw failed");
        }
        return response.json(); // ✅ parse JSON
    })
    .then(result => {
        document.getElementById("withdraw-result").innerText = result.message;
        console.log("Amount is withdrawn successfully..!");
    })
    .catch(error => {
        document.getElementById("withdraw-result").innerText =
            "Error while withdrawing amount";
        console.error(error);
    });
}

// Transfer
function transferMoney(){
    const data = {
        fromAcc: document.getElementById("t-from-acc").value,
        toAcc: document.getElementById("t-to-acc").value,
        amount: document.getElementById("t-amount").value
    };
    fetch(BASE_URL+"/accounts/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Transfer failed");
        }
        return response.json(); // ✅ parse JSON
    })
    .then(result => {
        document.getElementById("transfer-result").innerText = result.message;
        console.log("Amount is transferred successfully..!");
    })
    .catch(error => {
        document.getElementById("transfer-result").innerText =
            "Error while transferring amount";
        console.error(error);
    });
}

// View Account
function viewAccount(){
    const accNo = document.getElementById("v-acc").value;

    fetch(BASE_URL + "/accounts/" + accNo)
    .then(response => {
        if (!response.ok) {
            throw new Error("Account not found");
        }
        return response.json();
    })
    .then(account => {
        document.getElementById("view-result").innerHTML = `
            <b>Account Number:</b> ${account.accountNumber}<br>
            <b>Account Holder:</b> ${account.holderName}<br>
            <b>Email:</b> ${account.email}<br>
            <b>Balance:</b> ₹${account.balance}
        `;
    })
    .catch(error => {
        document.getElementById("view-result").innerText =
            "Account not found";
        console.error(error);
    });
}


// View All Accounts
function viewAllAccounts(){
    fetch(BASE_URL+"/accounts/all", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
     .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch accounts");
        }
        return response.json();
    })
    .then(accounts => {
        let output = `
            <table border="1" cellpadding="8">
                <tr>
                    <th>Account Number</th>
                    <th>Holder Name</th>
                    <th>Email</th>
                    <th>Balance</th>
                </tr>
        `;
        
         accounts.forEach(acc => {
            output += `
                <tr>
                    <td>${acc.accountNumber}</td>
                    <td>${acc.holderName}</td>
                    <td>${acc.email}</td>
                    <td>₹${acc.balance}</td>
                </tr>
            `;
        });

        output += `</table>`;
        document.getElementById("viewall-result").innerHTML = output;
    })
    .catch(error => {
        document.getElementById("viewall-result").innerText =
            "Error loading accounts";
    });
}