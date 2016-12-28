function validatePassword(){
  var password = document.getElementById("pass")
  , confirm_password = document.getElementById("cpass");
  if(password.value != confirm_password.value) {
    alert("Passwords Don't Match");
    return false;
  } else {
    return true;
  }
}