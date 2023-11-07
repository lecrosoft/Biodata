$(document).ready(function () {
  let formMethod;

  let tableRow = "";
  let table = "";
  const saveBtnUpdate = document.querySelector("#save_btn");
  const addBtn = document.querySelector("#add");
  document.querySelector("#add").addEventListener("click", function () {
    formMethod = "POST";
    $("#userform")[0].reset();
    document.querySelector("#userModalLabel").textContent = "Add User";
    loadForm(formMethod);
    $("#userModal").modal("show");
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
          data: "employee_id",
        },
        {
          data: "employee_name",
        },
        {
          data: "user_name",
        },
        {
          data: "user_role",
        },
        {
          data: "user_id",
          render: function (data, type, row, meta) {
            if (type === "display") {
              data = `          <div class="dropdown no-arrow">
                                  <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                  </a>
                                  <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">

                                                                          <a class="dropdown-item  editBtn" id=${row.user_id}><i class="fas fa-pencil-alt fa-sm fa-fw mr-2 text-gray-400"></i>Edit</a>
                                      <a class="dropdown-item deleteBtn"  id=${row.user_id}><i class="fas fa-trash fa-sm fa-fw mr-2 text-gray-400"></i>Delete</a>
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
  getTableData(`includes/fetchUser.php`);

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
      let userId = clickedBtn.getAttribute("id");

      $.ajax({
        url: "includes/edit_user.php",
        method: "POST",
        dataType: "json",
        data: { userId },
        success: function (response) {
          console.log(response);
          // $(".student_modal_scontent").html(data);
          document.querySelector("#userModalLabel").textContent = "Ediit User";
          saveBtnUpdate.textContent = "Update";
          document.querySelector("#user_id").value = response[0].user_id;
          document.querySelector("#employee_id").value =
            response[0].employee_id;
          document.querySelector("#fullname").value = response[0].employee_name;
          document.querySelector("#username").value = response[0].user_name;
          document.querySelector("#user_type").value = response[0].user_type;
          document.querySelector("#user_role").value = response[0].user_role;

          formMethod = "PUT";
          loadForm(formMethod);
          $("#userModal").modal("show");
        },
      });
    }

    if (clickedBtn.classList.contains("deleteBtn")) {
      e.preventDefault();
      userId = clickedBtn.getAttribute("id");

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
            url: "includes/delete_user.php",
            method: "POST",
            dataType: "json",
            data: { userId },
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
