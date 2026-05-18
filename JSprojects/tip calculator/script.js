const btnEl = document.getElementById("calc");
const billInput = document.getElementById("billamount");
const tipInput = document.getElementById("tippercentage");
const totalSpan = document.getElementById("total");

function calculateTotal() {
  const billValue = billInput.value;
  const tipValue = tipInput.value;
  const totalValue = billValue * (1 + tipValue / 100);
  totalSpan.innerText = totalValue.toFixed(2);
}

btnEl.addEventListener("click", calculateTotal);