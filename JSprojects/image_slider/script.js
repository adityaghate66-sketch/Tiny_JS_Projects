const slides=document.querySelectorAll(".slide")
const next=document.getElementById("next")
const prev=document.getElementById("prev")

let currentslide=0

function showSlide(index){
    for(let i=0;i<slides.length;i++){
        if(i==index){
            slides[i].classList.add("active")
        }else{
            slides[i].classList.remove("active")
        }
    }
}

next.addEventListener("click",function(){
    currentslide++
    if(currentslide>=slides.length){
        currentslide=0
    }
    showSlide(currentslide)
})

prev.addEventListener("click",function(){
    currentslide--
    if(currentslide<0){
        currentslide=slides.length-1
    }
    showSlide(currentslide)
})


