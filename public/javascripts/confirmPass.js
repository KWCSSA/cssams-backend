function validatePassword(){
  var password = document.getElementById("pass")
  , confirm_password = document.getElementById("cpass");
  console.log (password.value);
  console.log (confirm_password.value);
  if(password.value != confirm_password.value) {
    alert("Passwords Don't Match");
    return false;
  } else {
    return true;
  }
}

