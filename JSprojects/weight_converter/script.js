const inp = document.getElementById("input");
const res = document.getElementById("res");

inp.addEventListener("input", function () {
    const pounds = inp.value;

    if (pounds < 0) {
     res.textContent = "Invalid";
     return;
    }

    if (pounds === "") {
        res.textContent = "";
        return;
    }

    const kg = pounds * 0.453592;
    res.textContent = kg.toFixed(2);
});