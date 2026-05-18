const birthdayInput=document.getElementById("birthday")
const btn=document.getElementById("btn")
const ageSpan=document.getElementById("age")

function calculateAge(){
    const birthdayValue=birthdayInput.value
    if (birthdayValue===""){
        alert("Please enter your date of birth.")
    }else{
        const age=getAge(birthdayValue)
        ageSpan.innerText=age
    }
}

function getAge(birthdayValue){
    const today=new Date ()
    const birthDate=new Date (birthdayValue)

    let age=today.getFullYear()-birthDate.getFullYear()
    let month=today.getMonth()-birthDate.getMonth()

    if (month<0 || (month===0 && today.getDate()<birthDate.getDate())){
        age--
    }

    return age
}

btn.addEventListener("click",calculateAge)




