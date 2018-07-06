$("#email").click(function(e)
{
  if (document.getElementById("menu_").style.display == "block")
    {
      document.getElementById("menu_").style.display="none";}
  else {document.getElementById("menu_").style.display = "block";}
});

function selectuser(username, status)
{
  document.getElementById('userinfo').style.display = "block";
  document.getElementById('infousername').innerHTML = "Username: " + username;
  document.getElementById('infoposition').innerHTML = "Position: " + status;
}

function edit(userName)
{
  $.ajax({
    type: "POST",
    url: "/changeuser",
    data: JSON.stringify({aim: "edituser", username: userName}),
      dataType: "json",
      contentType: "application/json",
    statusCode: {
      200: function()
      {
        window.location.href = 'changuser';
      },
      403: function()
      {
        alert("Login or password are erroneus");
      }
    }
  });
}

$("#logout").click(function(e){
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "/logout",
    statusCode: {
      200: function()
      {
        window.location.href = 'try.html';
      },
      403: function()
      {
        alert("Login or password are erroneus");
      }
    }
  });
});

$("#signfrm").submit(function(e) {
             
  e.preventDefault();
  var registerForm = document.getElementById("signfrm");
  var userName = registerForm.elements["username"].value;
  var passWord = registerForm.elements["password"].value;
  if (userName != "" && passWord != "")
  {
  $.ajax({
      type: "POST",
      url: "/user",
      data: JSON.stringify({username: userName, password: passWord}),
      dataType: "json",
      contentType: "application/json",
      statusCode: {
        200: function()
        {
          window.location.href = '/main#courses';
        },
        403: function()
        {
          alert("Login or password are erroneus");
        }
      }
    });
  }
});

$('.tabs-nav li').click(function(e) {
  var a = $(this),
      parent = a.parents('.tabs'),
      nav = parent.children('.tabs-nav').children('li'),
      box = parent.children('.tabs-box').children('div');
  
  if (!a.hasClass('active')) {
    a.addClass('active')
      .siblings().removeClass('active');
    
    box.eq(a.index()).addClass('active')
      .siblings().removeClass('active');
  }
  
  e.preventDefault();
});

$('#mainbtn').click(function(e){
  $.ajax({
    type: "POST",
    url: "/changeuser",
    data: JSON.stringify({aim: "newuser"}),
    dataType: "json",
    contentType: "application/json",
    statusCode: {
      200: function()
      {
        window.location.href = '/changuser';
      }
    }
    });
});

$('#register').click(function(e){
  $.ajax({
    type: "POST",
    url: "/changeuser",
    data: JSON.stringify({aim: "register"}),
    dataType: "json",
    contentType: "application/json",
    statusCode: {
      200: function()
      {
        window.location.href = '/changuser';
      }
    }
    });
});