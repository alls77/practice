$('#register').submit(function(e){
    e.preventDefault();
    var registerForm = document.getElementById('register');
    var userName = registerForm.elements['login'].value;
    var eMail = registerForm.elements['email'].value;
    var passWord = registerForm.elements['passw'].value;
    $.ajax({
        type: "POST",
        url: "/register",
        data: JSON.stringify({login: userName, email: eMail, password: passWord, role: "Teacher"}),
        dataType: "json",
        contentType: "application/json",
        success: function(data){ 
            console.log(data);
            },
        });
});

$('#newuser').submit(function(e){
    e.preventDefault();
    var registerForm = document.getElementById('newuser');
    var userName = registerForm.elements['login'].value;
    var eMail = registerForm.elements['email'].value;
    var passWord = registerForm.elements['passw'].value;
    var Role = registerForm.elements['role'].value;
    $.ajax({
        type: "POST",
        url: "/register",
        data: JSON.stringify({login: userName, email: eMail, password: passWord, role: Role}),
        dataType: "json",
        contentType: "application/json",
        success: function(data){ 
            console.log(data);
            },
        });
});

$('#edituser').submit(function(e){
    e.preventDefault();
    var registerForm = document.getElementById('edituser');
    var userName = registerForm.elements['login'].value;
    var eMail = registerForm.elements['email'].value;
    var passWord = registerForm.elements['passw'].value;
    var Role = registerForm.elements['role'].value;
    $.ajax({
        type: "POST",
        url: "edituser",
        data: JSON.stringify({prevlogin: prevLogin, prevemail: prevEmail, login: userName, email: eMail, password: passWord, role: Role}),
          dataType: "json",
          contentType: "application/json",
        statusCode: {
          200: function()
          {
            window.location.href = 'main#users';
          },
          403: function()
          {
            alert("Login or password are erroneus");
          }
        }
      });
});