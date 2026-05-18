// const cInput = document.getElementById('celsius')
// const fInput = document.getElementById("fahrenheit")
// const kInput = document.getElementById("kelvin")

// function calculate() {
//     let c = parseFloat(cInput.value)
//     let f = parseFloat(fInput.value)
//     let k = parseFloat(kInput.value)

//     let activeInput = document.activeElement.id

//     if (activeInput === "celsius") {
// fInput.value = (c * 9 / 5) + 32
// kInput.value = c + 273.15

//     } else if (activeInput === "fahrenheit") {
// cInput.value = (f - 32) * 5 / 9
// kInput.value = (f - 32) * 5 / 9 + 273.15

//     } else if (activeInput === "kelvin") {
//     cInput.value = k - 273.15
//     fInput.value = (k - 273.15) * 9 / 5 + 32
// }
// }




// // const cInput = document.getElementById('celsius')
// // const fInput = document.getElementById("fahrenheit")
// // const kInput = document.getElementById("kelvin")

// // function calculate() {
// //     let c=+event.target.value
// //     // let c = parseFloat(cInput.value)
// //     // let f = parseFloat(fInput.value)
// //     // let k = parseFloat(kInput.value)
// //     // const c=+event.target.value
// //     // const f=+event.target.value
// //     // const k=+event.target.value

// //     switch (event.target.name) {
// //         case "celsius":
// //             fInput.value = (c * 9 / 5) + 32
// //             kInput.value = c + 273.15
// //             break

// //         case "fahrenheit":
// //             cInput.value = (c - 32) * 5 / 9
// //             kInput.value = (c - 32) * 5 / 9 + 273.15
// //             break

// //         case "kelvin":
// //             cInput.value = c - 273.15
// //             fInput.value = (c - 273.15) * 9 / 5 + 32
// //             break
// //             default:
// //             break
// //     }

// // }
// kenfk





// const cInput = document.getElementById('celsius')
// const fInput = document.getElementById("fahrenheit")
// const kInput = document.getElementById("kelvin")

// function calculate() {
//     let c = parseFloat(cInput.value)
//     let f = parseFloat(fInput.value)
//     let k = parseFloat(kInput.value)

//     let activeInput = document.activeElement.id

//     if (activeInput === "celsius") {
//         fInput.value = (c * 9 / 5) + 32
//         kInput.value = c + 273.15

//     } else if (activeInput === "fahrenheit") {
//         cInput.value = (f - 32) * 5 / 9
//         kInput.value = (f - 32) * 5 / 9 + 273.15

//     } else if (activeInput === "kelvin") {
//         cInput.value = k - 273.15
//         fInput.value = (k - 273.15) * 9 / 5 + 32
//     }
// }





// const celsiusEl = document.getElementById("celsius");
// const fahrenheitEl = document.getElementById("fahrenheit");
// const kelvinEl = document.getElementById("kelvin");

// function computeTemp(event) {
//   const currentValue = +event.target.value;

//   switch (event.target.name) {
//     case "celsius":
//       kelvinEl.value = (currentValue + 273.32).toFixed(2);
//       fahrenheitEl.value = (currentValue * 1.8 + 32).toFixed(2);
//       break;
//     case "fahrenheit":
//       celsiusEl.value = ((currentValue - 32) / 1.8).toFixed(2);
//       kelvinEl.value = ((currentValue - 32) / 1.8 + 273.32).toFixed(2);
//       break;
//     case "kelvin":
//       celsiusEl.value = (currentValue - 273.32).toFixed(2);
//       fahrenheitEl.value = ((currentValue - 273.32) * 1.8 + 32).toFixed(2);
//       break;
//     default:
//       break;
//   }
// }




// const celsiusEl = document.getElementById("celsius");
// const fahrenheitEl = document.getElementById("fahrenheit");
// const kelvinEl = document.getElementById("kelvin");

// function computeTemp(event) {
//   const currentValue = Number(event.target.value);

//   switch (event.target.name) {

//     case "celsius":
//       kelvinEl.value = (currentValue + 273.15).toFixed(2);
//       fahrenheitEl.value = (currentValue * 1.8 + 32).toFixed(2);
//       break;

//     case "fahrenheit":
//       celsiusEl.value = ((currentValue - 32) / 1.8).toFixed(2);
//       kelvinEl.value = ((currentValue - 32) / 1.8 + 273.15).toFixed(2);
//       break;

//     case "kelvin":
//       celsiusEl.value = (currentValue - 273.15).toFixed(2);
//       fahrenheitEl.value = ((currentValue - 273.15) * 1.8 + 32).toFixed(2);
//       break;
//   }
// }

const celsiusEl = document.getElementById("celsius");
const fahrenheitEl = document.getElementById("fahrenheit");
const kelvinEl = document.getElementById("kelvin");

function computeTemp(event) {
  const value = Number(event.target.value);

  if (event.target.name === "celsius") {
    fahrenheitEl.value = (value * 1.8 + 32).toFixed(2);
    kelvinEl.value = (value + 273.15).toFixed(2);
  }

  if (event.target.name === "fahrenheit") {
    celsiusEl.value = ((value - 32) / 1.8).toFixed(2);
    kelvinEl.value = ((value - 32) / 1.8 + 273.15).toFixed(2);
  }

  if (event.target.name === "kelvin") {
    celsiusEl.value = (value - 273.15).toFixed(2);
    fahrenheitEl.value = ((value - 273.15) * 1.8 + 32).toFixed(2);
  }
}