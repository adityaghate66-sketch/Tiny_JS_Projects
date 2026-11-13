let fileInput=document.getElementById("fileimg")
let img = document.getElementById("myimg")
fileInput.addEventListener("change",(e) =>{
console.log(e) 
let url=URL.createObjectURL(e.target.files[0])
img.src=url

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  }
  imageCompression(e.target.files[0],options).then(data => {
    console.log(data)
  })
})