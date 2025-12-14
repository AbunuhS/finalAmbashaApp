let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const incomeEl = document.getElementById("incomeTotal");
const expenseEl = document.getElementById("expenseTotal");
const balanceEl = document.getElementById("balance");
const tableBody = document.getElementById("transactionsTable");

document.getElementById("transactionForm").addEventListener("submit", e => {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    description: description.value,
    amount: Number(amount.value),
    type: type.value,
    date: new Date().toLocaleString()
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  e.target.reset();
  render();
});

function render() {
  let income = 0;
  let expense = 0;
  tableBody.innerHTML = "";

  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${t.date}</td>
      <td>${t.description}</td>
      <td>${t.type}</td>
      <td>ETB ${t.amount}</td>
    `;
    tableBody.appendChild(row);
  });

  incomeEl.textContent = `ETB ${income}`;
  expenseEl.textContent = `ETB ${expense}`;
  balanceEl.textContent = `ETB ${income - expense}`;
}

function toggleTransactions() {
  document.getElementById("transactionsSection").classList.toggle("hidden");
}

function takeScreenshot() {
  html2canvas(document.getElementById("app"), { scale: 2 })
    .then(canvas => {
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "business_summary.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    })
    .catch(() => alert("Screenshot failed. Make sure internet is ON."));
}

function exportCSV() {
  if (transactions.length === 0) {
    alert("No transactions to export");
    return;
  }

  let csv = "Date,Description,Type,Amount (ETB)\n";
  transactions.forEach(t => {
    csv += `"${t.date}","${t.description}","${t.type}","${t.amount}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions_etb.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

function clearAll() {
  if (confirm("Delete all transactions?")) {
    transactions = [];
    localStorage.removeItem("transactions");
    render();
  }
}

render();

/* Service Worker Registration */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
