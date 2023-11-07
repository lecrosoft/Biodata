"use strict";

const loadForm = function (method) {
  let formUrl;
  let formObj
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
  if (method === "POST") {
    formUrl = "includes/insert_user.php";
  } else if (method === "PUT") {
    formUrl = "includes/update_user.php";
  }
   else if (method === "PUT-PASSWORD") {
    formUrl = "includes/update_user_password.php";
  }

  let form = document.querySelector("#userform");
  let passwordForm = document.querySelector("#passwordForm");
  const saveBtn = document.querySelector("#save_user_btn");
  const savePasswordBtn = document.querySelector("#save_password_btn");

  let html;
  // =========SUBMITTING THE STUDENT FORM =============
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Convert to an object
    // let formObj = $("#card_form").serialize();
    formObj = new FormData(this);

    console.log(formObj);
    console.log(JSON.stringify(formObj));

    $.ajax({
      url: formUrl,
      method: "POST",
      data: formObj,
      dataType: "json",
      contentType: false,
      cache: false,
      processData: false,
      beforeSend: function () {
        $("#userform").css("opacity", ".5");
        saveBtn.textContent = "Processing...";
        saveBtn.disabled = true;
      },
      success: function (response) {
        console.log(response.message);
        if (response.message == "success") {
          successAction("Success!", "User Successfully Added.", "info");
          $("#userform").css("opacity", "");
          $("#userform")[0].reset();

          // $("table").closest("tr").append(html);
          saveBtn.textContent = "Save";
          saveBtn.disabled = false;

          setTimeout(() => {
            location = location.href;
          }, 1000);
        } else if (response.message == "update_success") {
          successAction("Success!", "User Successfully Updated.", "info");
          setTimeout(() => {
            location = location.href;
          }, 1000);
        }
         else if (response.message === "password_update_success") {
          successAction("Success!", "Password Successfully Updated.", "info");
          setTimeout(() => {
            location = location.href;
          }, 1000);
        }
      },
    });
  });



  passwordForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Convert to an object
    // let formObj = $("#card_form").serialize();
    formObj = new FormData(this);

    console.log(formObj);
    console.log(JSON.stringify(formObj));

    $.ajax({
      url: formUrl,
      method: "POST",
      data: formObj,
      dataType: "json",
      contentType: false,
      cache: false,
      processData: false,
      beforeSend: function () {
        $("#passwordForm")[0].reset();
        savePasswordBtn.textContent = "Processing...";
        savePasswordBtn.disabled = true;
      },
      success: function (response) {
        console.log(response.message);
          if (response.message == "password_update_success") {
          successAction("Success!", "Password Successfully Updated.", "info");
          setTimeout(() => {
            location = location.href;
          }, 1000);
        }
      },
    });
  });
};
