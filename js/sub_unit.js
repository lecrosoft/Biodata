$(document).ready(function () {
  let formMethod;
  let option;
  let unit;
  let tableRow = "";
  let table = "";

  const createUnitOptions = function (data, response) {
    // Clear previous options except the first one
    for (var i = unit.options.length - 1; i > 0; i--) {
      unit.remove(i);
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
 
  const saveBtnUpdate = document.querySelector("#save_btn");
  const addBtn = document.querySelector("#add");
  document.querySelector("#add").addEventListener("click", function () {
    formMethod = "POST";
    $("#subUnitform")[0].reset();
    document.querySelector("#subUnitModalLabel").textContent = "Add Sub Unit";
    loadForm(formMethod);
    $("#subUnitModal").modal("show");
  });


  $('#sub_machine_id').change(function () {

  option;
   unit = document.querySelector("#my_unit_name");



    // subunit = document.querySelector("#subunit");
    const machineId = $(this).val();
    $.ajax({
      url: "includes/get_unit.php",
      method: "POST",
      dataType: "json",
      data: { machineId },
      success: function (data) {
        console.log(data);
        createUnitOptions(data);
      },
    });
  });
  // $(document).ready(function () {
  //   $("#employ").select2();
  // });
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
          data: "sub_unit_name",
        },
        {
          data: "unit_name",
        },
        {
          data: "machine_name",
        },
        {
          data: "machine_name",
          render: function (data, type, row, meta) {
            if (type === "display") {
              data = `          <div class="dropdown no-arrow">
                                  <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                  </a>
                                  <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">

                                                                          <a class="dropdown-item  editBtn" id=${row.sub_unit_id}><i class="fas fa-pencil-alt fa-sm fa-fw mr-2 text-gray-400"></i>Edit</a>
                                      <a class="dropdown-item deleteBtn"  id=${row.sub_unit_id}><i class="fas fa-trash fa-sm fa-fw mr-2 text-gray-400"></i>Delete</a>
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
      //       return intVal(a) + intVal(b);fetchUnit.php
      //     }, 0);
      //   $(tfoot).find("td").eq(3).html(amtTotal.toLocaleString("en-US"));
      // },
    });
    // 000
  };
  getTableData(`includes/fetchSubUnit.php`);

  // getTableData(
  //   `fetchData.php?search_keywords=${search_keywords}&&status=${status}&&batch=${batch}`
  // );

  // Redraw the table
  // table.draw();

  // Redraw the table based on the custom input
  //  $("#searchInput,#status,#batch");
  // $("#from,#to").bind("change", function () {
  //   // search_keywords = $("#searchInput").val().toLowerCase();

  //   from = $("#from").val();
  //   to = $("#to").val();

  //   tableRow = "";

  //   // console.log(table.draw());
  //   $("table").DataTable().clear();
  //   $("table").DataTable().destroy();
  //   getTableData(`includes/fetchMachines.php?from=${from}&to=${to}`);
  // });
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
      let subunitId = clickedBtn.getAttribute("id");

      $.ajax({
        url: "includes/edit_sub_unit.php",
        method: "POST",
        dataType: "json",
        data: { subunitId },
        success: function (response) {
          console.log(response);
          // $(".student_modal_scontent").html(data);
          document.querySelector("#subUnitModalLabel").textContent =
            "Ediit Sub Unit";
          saveBtnUpdate.textContent = "Update";
          document.querySelector("#sub_unit_id").value =
            response[0].sub_unit_id;
          document.querySelector("#sub_unit_name").value =
            response[0].sub_unit_name;
          document.querySelector("#sub_machine_id").value =
            response[0].machine_id;

          

            let unitId = response[0].unit_id;
            let machineId =  document.querySelector("#sub_machine_id").value =
            response[0].machine_id;


            $.ajax({
              url: "includes/get_unit.php",
              method: "POST",
              dataType: "json",
              data: { machineId },
              success: function (data) {
                option;
                unit = document.querySelector("#my_unit_name");
            
                createUnitOptions(data, response);
              },
            });
            document.querySelector("#my_unit_name").value = response[0].unit_id;
          formMethod = "PUT";
          loadForm(formMethod);
          $("#subUnitModal").modal("show");
        },
      });
    }

    if (clickedBtn.classList.contains("deleteBtn")) {
      e.preventDefault();
      subunitId = clickedBtn.getAttribute("id");

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
            url: "includes/delete_sub_unit.php",
            method: "POST",
            dataType: "json",
            data: { subunitId },
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
