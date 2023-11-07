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
    formUrl = "includes/insert_maintenance.php";
  } else if (method === "PUT") {
    formUrl = "includes/update_maintenance.php";
  }

  let form = document.querySelector("#maintenenceform");
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
        $("#maintenenceform").css("opacity", ".5");
        saveBtn.textContent = "Processing...";
        saveBtn.disabled = true;
      },
      success: function (response) {
        console.log(response.message);
        if (response.message == "success") {
          successAction("Success!", "Maintenance Successfully Added.", "info");
          $("#maintenenceform").css("opacity", "");
          $("#maintenenceform")[0].reset();

          // $("table").closest("tr").append(html);
          saveBtn.textContent = "Save";
          saveBtn.disabled = false;

          setTimeout(() => {
            location = location.href;
          }, 1000);
        } else if (response.message == "update_success") {
          successAction(
            "Success!",
            "Maintenance Successfully Updated.",
            "info"
          );
          setTimeout(() => {
            location = location.href;
          }, 1000);
        }
      },
    });
  });
};
