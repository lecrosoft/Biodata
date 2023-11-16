$(document).ready(function () {
  let formMethod;
  let religion = $("#religion").val();
  let country = $("#country").val();
  let from = $("#from").val();
  let to = $("#to").val();

  let tableRow = "";
  let table = "";

  let title = document.querySelector("#page_title");
  title.innerHTML = `<h1 class="h3 mb-0 text-gray-800">Profile From <span style="font-size:21px;color:blue;font-weight:bold">${from}</span> To <span style="font-size:21px;color:blue;font-weight:bold">${to}</span></h1>`;
  const filterBtn = document.querySelector("#filterModal");
  document.querySelector("#filterBtn").addEventListener("click", function (e) {
    e.preventDefault();
    // loadForm(formMethod);
    $("#filterModal").modal("show");
  });

  // ======================== END MACHINE CHANGE ==============================

  $(document).ready(function () {
    $("#employ").select2();
  });
  const getTableData = function (url) {
    table = $("table").DataTable({
      searching: true,
      // dom: "Bfrtip",
      // buttons: ["copy", "csv", "excel", "pdf", "print"],
      ajax: {
        url: url,
        dataSrc: "",
      },

      columns: [
        {
          data: "fathername",
          render: function (data, type, row, meta) {
            if (type === "display") {
              data = `<a class="dropdown-list-image" href="profile?id=${
                row.id
              }"><img src="img/${
                row.profile_picture == ""
                  ? "undraw_profile.svg"
                  : row.profile_picture
              }"alt="user" class="img-circle rounded-circle" />
                ${
                  " " +
                  row.fathername +
                  " " +
                  row.firstname +
                  " " +
                  row.lastname
                }</a><span>`;
            }
            return data;
          },
        },
        {
          data: "gender",
          render: function (data, type, row, meta) {
            if (type === "display") {
              if (row.gender == "Male") {
                data = "M";
              } else if (row.gender == "Female") {
                data = "F";
              } else {
                data = "";
              }
            }
            return data;
          },
        },
        {
          data: "religion_id",
          render: function (data, type, row, meta) {
            if (type === "display") {
              data = `${row.religion}`;
            }
            return data;
          },
        },

        {
          data: "lebanese_phone_number",
          render: function (data, type, row, meta) {
            if (type === "display") {
              data = `<a >${row.lebanese_phone_number}</a>`;
            }
            return data;
          },
        },
        {
          data: "regnumber",
        },
        {
          data: "emergency_number",
        },
        // {
        //   data: "status",
        //   render: function (data, type, row, meta) {
        //     if (type === "display") {
        //       if (row.status == "Active") {
        //         data = `<span class="label label-success">${row.status}</span>`;
        //       } else {
        //         data = `<span class="label label-danger">${row.status}</span>`;
        //       }
        //     }
        //     return data;
        //   },
        // },
        {
          data: "id",
          render: function (data, type, row, meta) {
            if (type === "display") {
              data = `          <div class="dropdown no-arrow">
                                <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                </a>
                                <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">

                                    <a class="dropdown-item"  href="student_profile.php?s_id=${row.id}"><i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>View Profile</a>
                                    <a class="dropdown-item  editBtn" id=${row.id}><i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>Edit Profile</a>
                                    <a class="dropdown-item linkParentBtn" id=${row.id}><i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>Link Parent/Guardian</a>
                                    <a class="dropdown-item deleteBtn"  id=${row.id}><i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>Delete Student</a>

                                </div>
                            </div>`;
            }
            return data;
          },
        },
      ],

      // footerCallback: function (tfoot, data, start, end, display) {
      //   var api = this.api(),
      //     data;
      //   var intVal = function (i) {
      //     return typeof i === "string"
      //       ? i.replace(/[\$,]/g, "") * 1
      //       : typeof i === "number"
      //       ? i
      //       : 0;
      //   };
      //   var amtTotal = api
      //     .column(3, {
      //       search: "applied",
      //     })
      //     .data()
      //     .reduce(function (a, b) {
      //       return intVal(a) + intVal(b);
      //     }, 0);
      //   $(tfoot).find("td").eq(3).html(amtTotal.toLocaleString("en-US"));
      // },
    });
    // 000
  };
  getTableData(
    `includes/fetchBiodata_report.php?religion=${religion}&country=${country}&from=${from}&to=${to}`
  );

  // getTableData(
  //   `fetchData.php?search_keywords=${search_keywords}&&status=${status}&&batch=${batch}`
  // );

  // Redraw the table
  // table.draw();

  // Redraw the table based on the custom input
  //  $("#searchInput,#status,#batch");
  $("#religion,#country,#from,#to").bind("change", function () {
    // search_keywords = $("#searchInput").val().toLowerCase();

    from = $("#from").val();
    to = $("#to").val();
    religion = $("#religion").val();
    country = $("#country").val();

    tableRow = "";

    // console.log(table.draw());
  });

  $("#searchBtn").click(function (e) {
    e.preventDefault();
    title.innerHTML = `<h1 class="h3 mb-0 text-gray-800">Profile From <span style="font-size:21px;color:blue;font-weight:bold">${from}</span> To <span style="font-size:21px;color:blue;font-weight:bold">${to}</span></h1>`;
    $("#filterModal").modal("hide");
    $("table").DataTable().clear();
    $("table").DataTable().destroy();
    getTableData(
      `includes/fetchBiodata_report.php?religion=${religion}&country=${country}&from=${from}&to=${to}`
    );
  });
  const tableClass = document.querySelector(".table");
  // editBtnClass.addEventListener("click", function (e) {
  //   e.preventDefault();
  // });
  tableClass.addEventListener("click", function (e) {
    let clickedBtn = e.target;

    console.log(clickedBtn);
    if (clickedBtn.classList.contains("editBtn")) {
      e.preventDefault();
      // $("#editReportCardModal").modal("show");
      let maintenanceId = clickedBtn.getAttribute("id");

      $.ajax({
        url: "includes/edit_maintenance.php",
        method: "POST",
        dataType: "json",
        data: { maintenanceId },
        success: function (response) {
          console.log(response);
          // $(".student_modal_scontent").html(data);
          document.querySelector("#maintenenceModalLabel").textContent =
            "Ediit Maintenance";

          document.querySelector("#maintenance_id").value = response[0].id;
          document.querySelector("#date").value = response[0].date;

          document.querySelector("#employ").selected = response[0].date;
          let maintenance_Id = response[0].id;
          // i wan get the  employee with the maintenance id
          $.ajax({
            url: "includes/get_employee_maintenance_id.php",
            method: "POST",
            dataType: "json",
            data: { maintenance_Id },
            success: function (employeeResponse) {
              var selectedEmployees = employeeResponse; // Assuming employeeResponse is already an array like [3, 1]

              $("#employ option").each(function () {
                var optionValue = $(this).val();

                if (selectedEmployees.includes(optionValue)) {
                  $(this).prop("selected", true);
                }
              });

              // Trigger the change event to update the Select2 plugin
              $("#employ").trigger("change");
            },
          });
          // =================  end =============
          document.querySelector("#preventive").value =
            response[0].preventive_repair;
          // document.querySelector("#preventive").textContent =
          //   response[0].preventive_repair;

          document.querySelector("#machine").value = response[0].machine_id;

          let machineId = response[0].machine_id;
          document.querySelector("#unit").value = response[0].unit_id;
          let unitId = response[0].unit_id;

          $.ajax({
            url: "includes/get_unit.php",
            method: "POST",
            dataType: "json",
            data: { machineId },
            success: function (data) {
              option;
              unit = document.querySelector("#unit");
              subunit = document.querySelector("#subunit");
              createUnitOptions(data, response);
            },
          });
          $.ajax({
            url: "includes/get_sub_unit.php",
            method: "POST",
            dataType: "json",
            data: { unitId },
            success: function (data) {
              option2;
              subunit = document.querySelector("#subunit");
              createsubUnitOptions(data, response);
            },
          });

          // document.querySelector("#unit").value = response[0].unit_id;
          // document.querySelector("#unit").textContent = response[0].unit_name;

          document.querySelector("#problem").text = response[0].problem;
          document.querySelector("#problem").value = response[0].problem;

          formMethod = "PUT";
          loadForm(formMethod);
          $("#addMaintenance").modal("show");
        },
      });
    }

    //  VIEW PROBLEM BTN
    if (clickedBtn.classList.contains("viewProblemBtn")) {
      e.preventDefault();
      maintenanceId = clickedBtn.getAttribute("id");

      $.ajax({
        url: "includes/edit_maintenance.php",
        method: "POST",
        dataType: "json",
        data: { maintenanceId },
        success: function (response) {
          // document.querySelector("#batchToLink").textContent = response[0].arm;

          document.querySelector("#p-date").textContent = response[0].date;
          document.querySelector("#p-machine-name").textContent =
            response[0].machine_name;
          document.querySelector("#p-maintenance_type").textContent =
            response[0].preventive_repair;
          document.querySelector("#p-unit-name").textContent =
            response[0].unit_name;
          document.querySelector("#p-sub_unit_name").textContent =
            response[0].sub_unit_name;
          document.querySelector("#maintenanceProblem").innerHTML =
            response[0].problem;

          // linkTeacher();
          $("#problemModal").modal("show");

          document
            .getElementById("printButton")
            .addEventListener("click", function (event) {
              event.preventDefault(); // Prevent the default link behavior (navigation)
              window.location.href = `print_problem?id=${maintenanceId}`;
              // window.location.href = this.getAttribute("href"); // Navigate to print.php
              window.onload = function () {
                window.setTimeout(function () {
                  window.print(); // Print the new page after a short delay
                }, 1000); // Adjust the delay as needed
              };
            });
        },
      });
    }
    if (clickedBtn.classList.contains("deleteBtn")) {
      e.preventDefault();
      maintenanceId = clickedBtn.getAttribute("id");

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: "includes/delete_maintenance.php",
            method: "POST",
            dataType: "json",
            data: { maintenanceId },
            success: function (response) {
              if (response.message === "deleted") {
                Swal.fire("Deleted!", "Record has been deleted.", "success");
                setTimeout(() => {
                  location = location.href;
                }, 1000);
              }
            },
          });
        }
      });
    }

    // END OF  LINK PARENT BUTTON
  });

  $(
    ".buttons-copy, .buttons-csv, .buttons-print, .buttons-pdf, .buttons-excel"
  ).addClass("btn btn-primary me-1");

  // =========eND OF SUBMITTING THE STUDENT FORM =============
});
