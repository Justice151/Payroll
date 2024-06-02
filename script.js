class Worker {
    constructor(name, hoursWorked = 0, hourlyWage = 0) {
        this.name = name;
        this.hoursWorked = hoursWorked;
        this.hourlyWage = hourlyWage;
        this.transactions = [];
    }

    calculatePay() {
        let basePay = this.hoursWorked * this.hourlyWage;
        let totalEarnings = this.transactions
            .filter(t => t.type === 'earning')
            .reduce((sum, t) => sum + t.amount, 0);
        let totalDeductions = this.transactions
            .filter(t => t.type === 'deduction')
            .reduce((sum, t) => sum + t.amount, 0);
        return basePay + totalEarnings - totalDeductions;
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
    }
}

class Transaction {
    constructor(description, amount, type) {
        this.description = description;
        this.amount = amount;
        this.type = type;
    }
}

let workers = JSON.parse(localStorage.getItem('workers')) || {};

function addOrUpdateWorker() {
    let name = document.getElementById('worker-name').value;
    let hoursWorked = parseFloat(document.getElementById('hours-worked').value);
    let hourlyWage = parseFloat(document.getElementById('hourly-wage').value);

    if (name && !isNaN(hoursWorked) && !isNaN(hourlyWage)) {
        if (!workers[name]) {
            workers[name] = new Worker(name, hoursWorked, hourlyWage);
        } else {
            workers[name].hoursWorked = hoursWorked;
            workers[name].hourlyWage = hourlyWage;
        }
        saveWorkers();
        alert('Worker added/updated successfully');
    } else {
        alert('Please fill all fields correctly');
    }
}

function addTransaction() {
    let workerName = document.getElementById('transaction-worker-name').value;
    let description = document.getElementById('transaction-description').value;
    let amount = parseFloat(document.getElementById('transaction-amount').value);
    let type = document.getElementById('transaction-type').value;

    if (workerName && description && !isNaN(amount) && type) {
        if (workers[workerName]) {
            let transaction = new Transaction(description, amount, type);
            workers[workerName].addTransaction(transaction);
            saveWorkers();
            alert('Transaction added successfully');
        } else {
            alert('Worker not found');
        }
    } else {
        alert('Please fill all fields correctly');
    }
}

function displaySummary() {
    let summaryContent = document.getElementById('summary-content');
    summaryContent.innerHTML = '';

    for (let name in workers) {
        let worker = workers[name];
        let pay = worker.calculatePay();
        summaryContent.innerHTML += `<p>Worker: ${worker.name}, Total Pay: $${pay.toFixed(2)}</p>`;
    }
}

function displayTransactions() {
    let workerName = document.getElementById('transaction-worker-name-view').value;
    let transactionContent = document.getElementById('transaction-content');
    transactionContent.innerHTML = '';

    if (workers[workerName]) {
        let transactions = workers[workerName].transactions;
        transactions.forEach(t => {
            transactionContent.innerHTML += `<p>Description: ${t.description}, Amount: $${t.amount.toFixed(2)}, Type: ${t.type}</p>`;
        });
    } else {
        alert('Worker not found');
    }
}

function saveWorkers() {
    localStorage.setItem('workers', JSON.stringify(workers));
}
