const transcations=JSON.parse(localStorage.getItem("transcations")) || [];

const formatter = new Intl.NumberFormat('en-US', {
    style: "currency",
    currency: "USD",
    signDisplay: "always",
});

const list=document.getElementById("transcationList");
const form = document.getElementById("transcationFrom");
const status = document.getElementById("status");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

form.addEventListener("submit", addTranscation);
function updateTotal(){
    const incomeTotal = transcations
    .filter((trx) => trx.type  ===  "income")
    .reduce((total,trx) => total + trx.amount, 0);
    const expenseTotal = transcations
    .filter((trx) => trx.type  ===  "expense")
    .reduce((total,trx) => total + trx.amount, 0);
    
    const balanceTotal = incomeTotal - expenseTotal;

    balance.textContent = formatter.format(balanceTotal).substring(1);
    income.textContent = formatter.format(incomeTotal);
    expense.textContent = formatter.format(expenseTotal *  -1);

}

function renderList(){
    list.innerHTML = "";

    status.textContent = "";
    if(transcations.length === 0){
        status.textContent = "No transcations.";
        return;
    }

    transcations.forEach(({id, name , amount, date ,type}) =>{
        const sign = "income" === type ? 1 : -1 ;
        const li=document.createElement("li");
        li.innerHTML = `
        <div class="name">
        <h4>${name}</h4>
        <p>${new Date(date).toLocaleDateString()}</p>
        </div>
        <div class="amount ${type}">
        <span>${formatter.format(amount * sign)}</span>
        </div>
        <div class="action">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" onclick="deleteTranscation(${id})"">
        <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>

        </div>
        `;
        list.appendChild(li);
    });
}

renderList();
updateTotal();

function deleteTranscation(id){
    const index= transcations.findIndex((trx) => trx.id === id);
    transcations.splice(index,1);

    updateTotal();
    saveTranscations();
    renderList();
}

function addTranscation(e){
    e.preventDefault();

    const formData=  new FormData(this);
    const transactionType = document.getElementById("type").checked ? "income" : "expense";
    transcations.push({
        id: transcations.length+1,
        name: formData.get("name"),
        amount: parseFloat(formData.get("amount")),
        date: new Date(formData.get("date")),
        type: transactionType,  
    });
    
    this.reset();

    updateTotal();
    saveTranscations();
    renderList();
}

function saveTranscations(){
    transcations.sort((a,b) => new Date(b.date) - new Date(a.date));
    localStorage.setItem("transcations" , JSON.stringify(transcations));
}