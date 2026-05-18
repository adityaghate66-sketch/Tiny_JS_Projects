const inp=document.getElementById("btn1")
const out=document.getElementById("btn2")
const body=document.getElementById("container")
const lis=document.getElementById("log")

inp.addEventListener("click",()=>{
    body.style.backgroundColor="lightyellow"
    lis.innerHTML = ""
    const li=document.createElement("li")
    li.innerText="You have turned on the torch"
    lis.appendChild(li)
    lis.style.fontFamily="cursive"
    lis.style.color="black"
    lis.style.listStyle="none"
})

out.addEventListener("click",()=>{
    body.style.backgroundColor="black"
    lis.innerHTML = ""
    const li=document.createElement("li")
    li.innerText="You have turned off the torch"
    lis.appendChild(li)
    lis.style.fontFamily="cursive"
    lis.style.color="white"
    lis.style.listStyle="none"
})

