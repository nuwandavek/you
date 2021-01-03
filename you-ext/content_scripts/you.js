document.body.style.border = '5px solid red';

console.log("Hello");

$.ajax({
  url: 'http://localhost:5000',
  crossDomain: true,
  dataType: 'json',
  // // data: data,
  success: (d)=>{
    console.log(d)
  }
});