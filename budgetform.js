let budgetArray = [];
const budgetForm = document.querySelector('#budgetForm');
const itemList = document.querySelector('#transaction');
const totalIncomeEl = document.querySelector('#totalIncome');
const totalExpenseEl = document.querySelector('#totalExpense');
const balanceEl = document.querySelector('#balance');


budgetForm.addEventListener('submit', function (event) {
    event.preventDefault();


    const name = document.querySelector('#item').value.trim();
    const amount = parseFloat(document.querySelector('#amount').value);
    const date = document.querySelector('#date').value;
    const type = document.querySelector('input[name="subject"]:checked').value;


    if (name === '') {
        alert('กรุณากรอกชื่อรายการ');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('จำนวนเงินต้องมากกว่า 0');
        return;
    }

    const budgetData = {
        id: Date.now(),
        name: name,
        amount: amount,
        date: date,
        type: type
    };

    budgetArray.push(budgetData);
    console.log('budget Array:', budgetArray);

    renderTransactions();
    updateSummary();

    budgetForm.reset();
});

function renderTransactions() {

    itemList.innerHTML = "";

    if (budgetArray.length === 0) {
        itemList.innerHTML = "<li>ยังไม่มีรายการ</li>";
        return;
    }

    budgetArray.forEach(function (transaction) {
        const listItem = document.createElement("li");

        listItem.textContent =
            `${transaction.date} - ${transaction.name} - ${transaction.amount} บาท (${transaction.type}) `;


        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "ลบ";
        deleteBtn.addEventListener("click", function () {
            if (confirm(`ต้องการลบรายการ "${transaction.name}" หรือไม่?`)) {
                budgetArray = budgetArray.filter(t => t.id !== transaction.id);
                renderTransactions();
                updateSummary();
            }
        });
        listItem.appendChild(deleteBtn);

        itemList.appendChild(listItem);
    });
}


function updateSummary() {
    const incomeTotal = budgetArray
        .filter(t => t.type === 'รายรับ')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenseTotal = budgetArray
        .filter(t => t.type === 'รายจ่าย')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = incomeTotal - expenseTotal;

    totalIncomeEl.textContent = incomeTotal;
    totalExpenseEl.textContent = expenseTotal;

    // แสดงยอดคงเหลือพร้อมข้อความเตือนถ้าติดลบ
    if (balance < 0) {
        balanceEl.textContent = `${balance} (เตือน: ยอดเงินคงเหลือติดลบ!)`;
        balanceEl.style.color = 'red';
    } else {
        balanceEl.textContent = balance;
        balanceEl.style.color = 'black';
    }
}
