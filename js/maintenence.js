$(document).ready(function () {
  let formMethod;

  let from = $("#from").val();
  let to = $("#to").val();
  let user_role = $("#user_role").val();
  let subunit;
  let tableRow = "";
  let table = "";
  let option2;
  let option;
  let unit;

  const createUnitOptions = function (data, response) {
    // Clear previous options except the first one
    for (var i = unit.options.length - 1; i > 0; i--) {
      unit.remove(i);
    }
    for (var x = subunit.options.length - 1; x > 0; x--) {
      unit.remove(x);
    }
    console.log("response", response);
    // Append new options
    for (let i = 0; i < data.length; i++) {
      if (response) {
        console.log(data[i].unit_id, response[0].unit_id);
        if (data[i].unit_id == response[0].unit_id) {
          console.log("now");
          option = document.createElement("option");
          option.value = `${data[i].unit_id}`;
          option.textContent = `${data[i].unit_name}`;
          option.selected = true;
          unit.appendChild(option);
        }
      }

      console.log(data[i]);
      option = document.createElement("option");
      option.value = `${data[i].unit_id}`;
      option.textContent = `${data[i].unit_name}`;
      unit.appendChild(option);
      console.log(option);
    }
  };
  const createsubUnitOptions = function (data, response) {
    // Clear previous options except the first one

    // Clear previous options except the first one
    for (var y = subunit.options.length - 1; y > 0; y--) {
      subunit.remove(y);
    }
    console.log("response2", response);
    // Append new options
    for (let i = 0; i < data.length; i++) {
      if (response) {
        console.log(data[i].sub_unit_id, response[0].subunit_id);
        if (data[i].sub_unit_id == response[0].subunit_id) {
          console.log(data[i]);
          option2 = document.createElement("option");
          option2.value = `${data[i].sub_unit_id}`;
          option2.textContent = `${data[i].sub_unit_name}`;
          option2.selected = true;
          subunit.appendChild(option2);
          console.log(option2);
        }
      }

      console.log(data[i]);
      option2 = document.createElement("option");
      option2.value = `${data[i].sub_unit_id}`;
      option2.textContent = `${data[i].sub_unit_name}`;
      subunit.appendChild(option2);
    }
  };
  const addBtn = document.querySelector("#add");
  document.querySelector("#add").addEventListener("click", function () {
    formMethod = "POST";
    //   $("#maintenenceform")[0].reset();
    document.querySelector("#maintenenceModalLabel").textContent =
      "Add Maintenance";
    //   document.querySelector("#card_id").value = "";

    loadForm(formMethod);
    $("#addMaintenance").modal("show");
  });

  $("#machine").change(function () {
    option;
    unit = document.querySelector("#unit");
    subunit = document.querySelector("#subunit");
    const machineId = $(this).val();
    $.ajax({
      url: "includes/get_unit.php",
      method: "POST",
      dataType: "json",
      data: { machineId },
      success: function (data) {
        console.log(data.length);
        createUnitOptions(data);
      },
    });
  });

  // ======================== END MACHINE CHANGE ==============================
  $("#unit").change(function () {
    option2;
    subunit = document.querySelector("#subunit");
    const unitId = $(this).val();

    $.ajax({
      url: "includes/get_sub_unit.php",
      method: "POST",
      dataType: "json",
      data: { unitId },
      success: function (data) {
        console.log(data.length);
        createsubUnitOptions(data);
      },
    });
  });

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
          data: "date",
        },
        {
          data: "preventive_repair",
        },
        {
          data: "machine_name",
        },

        {
          data: "unit_name",
        },
        {
          data: "sub_unit_name",
        },
        {
          data: "unit_name",
          render: function (data, type, row, meta) {
            if (type === "display") {
              if (user_role == "Admin") {
                data = `          <div class="dropdown no-arrow">
                <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                    <a class="dropdown-item viewProblemBtn" id=${row.id}><i class="fas fa-eye fa-sm fa-fw mr-2 text-gray-400"></i> View Problem</a>
                                                        <a class="dropdown-item  editBtn" id=${row.id}><i class="fas fa-pencil-alt fa-sm fa-fw mr-2 text-gray-400"></i>Edit</a>
                    <a class="dropdown-item deleteBtn"  id=${row.id}><i class="fas fa-trash fa-sm fa-fw mr-2 text-gray-400"></i>Delete</a>
                </div>
            </div>`;
              } else if (user_role == "Report" || user_role == "Maintenance") {
                data = `          <div class="dropdown no-arrow">
                <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                    <a class="dropdown-item viewProblemBtn" id=${row.id}><i class="fas fa-eye fa-sm fa-fw mr-2 text-gray-400"></i> View Problem</a>
                                                        <a class="dropdown-item  editBtn" id=${row.id}><i class="fas fa-pencil-alt fa-sm fa-fw mr-2 text-gray-400"></i>Edit</a>
                </div>
            </div>`;
              }
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
  getTableData(`includes/fetchMaintenance.php?from=${from}&to=${to}`);

  // getTableData(
  //   `fetchData.php?search_keywords=${search_keywords}&&status=${status}&&batch=${batch}`
  // );

  // Redraw the table
  // table.draw();

  // Redraw the table based on the custom input
  //  $("#searchInput,#status,#batch");
  $("#from,#to").bind("change", function () {
    // search_keywords = $("#searchInput").val().toLowerCase();

    from = $("#from").val();
    to = $("#to").val();

    tableRow = "";

    // console.log(table.draw());
    $("table").DataTable().clear();
    $("table").DataTable().destroy();
    getTableData(`includes/fetchMaintenance.php?from=${from}&to=${to}`);
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

          document.querySelector("#maintenanceProblem").innerHTML =
            response[0].problem;
          document.querySelector(".date").textContent = response[0].date;
          document.querySelector(".maintenance_type").textContent =
            response[0].preventive_repair;
          document.querySelector(".machine_name").textContent =
            response[0].machine_name;
          document.querySelector(".unit").textContent = response[0].unit_name;
          document.querySelector(".subunit").textContent =
            response[0].sub_unit_name;

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
