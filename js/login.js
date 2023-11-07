const successAction = function (alertHeading, alertText, alertIcon) {
    $.toast({
      heading: alertHeading,
      text: alertText,
      position: "top-right",
      loaderBg: "#ff6849",
      icon: alertIcon,
      hideAfter: 3500,
      stack: 6,
    });
  };
  const form = document.querySelector("#form");
  const saveBtn = document.querySelector("#saveBtn");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formObj = new FormData(this);
    console.log(formObj);
    $.ajax({
      url: "includes/check_login.php",
      method: "POST",
      data: formObj,
      dataType: "json",
      contentType: false,
      cache: false,
      processData: false,
      beforeSend: function () {
        saveBtn.textContent = "...Proccessing";
      },
      success: function (data) {
        console.log(data);
        if (data.message === "success") {
          successAction("Success!", "Login Successful.", "info");
          location = "index";
        } else {
          successAction("Failed!", "Incorrect Username or Password", "warning");
          saveBtn.textContent = "Login";
        }
      },
    });
  });
  