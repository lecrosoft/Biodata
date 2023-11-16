"use strict";

const loadForm = function (method) {
  let formUrl;
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
    formUrl = "includes/insert_biodata.php";
  } else if (method === "PUT") {
    formUrl = "includes/update_machine.php";
  }

  let form = document.querySelector("#form");
  const saveBtn = document.querySelector("#save_btn");

  let html;
  // =========SUBMITTING THE STUDENT FORM =============
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Convert to an object
    // let formObj = $("#card_form").serialize();
    let formObj = new FormData(this);

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
        $("#form").css("opacity", ".5");
        saveBtn.textContent = "Processing...";
        saveBtn.disabled = true;
      },
      success: function (response) {
        console.log(response.message);
        if (response.message.toLowerCase() === "success") {
          successAction("Success!", "Record Successfully Added.", "info");
          $("#form").css("opacity", "");
          $("#form")[0].reset();

          // $("table").closest("tr").append(html);
          saveBtn.textContent = "Save";
          saveBtn.disabled = false;

          setTimeout(() => {
            location = location.href;
          }, 1000);
        } else if (response.message.toLowerCase() === "update_success") {
          successAction("Success!", "Record Successfully Updated.", "info");
          setTimeout(() => {
            location = location.href;
          }, 1000);
        } else {
          console.log("error");
          successAction("Error!", `${response.message}`, "warning");

          $("#form").css("opacity", "");
          saveBtn.textContent = "Save";
          saveBtn.disabled = false;
        }
      },
    });
  });
};

formMethod = "POST";
loadForm(formMethod);
