document.body.style.border = '5px solid red';

console.log("Hello");

$.ajax({
  url: 'http://localhost:5000/autocomplete',
  crossDomain: true,
  dataType: 'json',
  data: {context : 'Vivek : Hi!'},
  success: (d)=>{
    console.log(d)
  }
});