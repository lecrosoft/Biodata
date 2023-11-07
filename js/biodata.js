$(".dropify").dropify();

// Translated
$(".dropify-fr").dropify({
  messages: {
    default: "Glissez-déposez un fichier ici ou cliquez",
    replace: "Glissez-déposez un fichier ou cliquez pour remplacer",
    remove: "Supprimer",
    error: "Désolé, le fichier trop volumineux",
  },
});

let formPageNum = 0;
const nextButton = document.querySelectorAll(".next");
const previousButton = document.querySelectorAll(".previous");
const formSteps = document.querySelectorAll(".formStep");
const stepBullet = document.querySelectorAll(".step-bullet");
let form = document.querySelector("#form");
let submitFormPartially = form.addEventListener("submit", function (e) {
  e.preventDefault();
});

for (d of nextButton) {
  d.addEventListener("click", function () {
    // e.preventDefault();
    formPageNum++;
    updateFormSteps();
    updateFormBullets();
  });
}
for (d of previousButton) {
  d.addEventListener("click", function (e) {
    e.preventDefault();
    formPageNum--;
    updateFormSteps();
    updateFormBullets();
  });
}
function updateFormSteps() {
  for (d of formSteps) {
    d.classList.contains("activeForm") && d.classList.remove("activeForm");
  }
  formSteps[formPageNum].classList.add("activeForm");
}
function updateFormBullets() {
  stepBullet.forEach((updateFormBullet, index) => {
    if (index < formPageNum + 1) {
      updateFormBullet.classList.add("activeStep");
    } else {
      updateFormBullet.classList.remove("activeStep");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const countriesSelect = document.getElementById("countries");
  const statesSelect = document.getElementById("states");
  const citiesSelect = document.getElementById("cities");
  let autToken;
  // Fetch the list of countries from the API

  // Generate Token
  // var req = unirest(
  //   "GET",
  //   "https://www.universal-tutorial.com/api/getaccesstoken"
  // );

  // req.headers({
  //   Accept: "application/json",
  //   "api-token":
  //     "Pd5-YrIQwAVv_JshWLQCN6Ye1lwUDe9KUFsMSQyjaGJ7bcOqomTt2lkpJezGok9UAQY",
  //   "user-email": "lecrosoft@gmail.com",
  // });
  const getCountries = async function () {
    try {
      const request = await fetch(
        "https://www.universal-tutorial.com/api/getaccesstoken",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "api-token":
              "Pd5-YrIQwAVv_JshWLQCN6Ye1lwUDe9KUFsMSQyjaGJ7bcOqomTt2lkpJezGok9UAQY",
            "user-email": "lecrosoft@gmail.com",
          },
        }
      );

      const response = await request.json();
      autToken = response.auth_token;
      console.log("this is response", response.auth_token);

      if (request.ok) {
        const getAllCountries = await fetch(
          "https://www.universal-tutorial.com/api/countries/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${response.auth_token}`,
            },
          }
        );

        const allCountries = await getAllCountries.json();

        console.log(allCountries);

        for (d of allCountries) {
          const option = document.createElement("option");
          option.value = d.country_name;
          option.text = d.country_name;
          countriesSelect.appendChild(option);
        }
      } else {
        console.log("Error fetching countries");
      }
    } catch (error) {
      console.log(error);
    }
  };

  getCountries();

  // ================================================= END OF TOKEN ==========================

  // Event listener for country selection
  countriesSelect.addEventListener("change", function () {
    // Clear the states and cities dropdowns
    statesSelect.innerHTML = "";
    citiesSelect.innerHTML = "";

    // Fetch the list of states for the selected country
    const selectedCountry = countriesSelect.value;

    const getStates = async function (selectedCountry, autToken) {
      try {
        const reqState = await fetch(
          `https://www.universal-tutorial.com/api/states/${selectedCountry}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${autToken}`,
            },
          }
        );

        if (reqState.ok) {
          const responseState = await reqState.json();
          console.log(responseState);
          // Process the response and populate the statesSelect dropdown

          for (d of responseState) {
            const option = document.createElement("option");
            option.value = d.state_name;
            option.text = d.state_name;
            statesSelect.appendChild(option);
          }
        } else {
          console.error("Failed to fetch states data");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    getStates(selectedCountry, autToken);
  });

  // Event listener for state selection
  statesSelect.addEventListener("change", function () {
    // Clear the cities dropdown
    citiesSelect.innerHTML = "";

    // Fetch the list of cities for the selected state (You may need to use another API or data source for this)
    const selectedState = statesSelect.value;

    const getCities = async function (selectedState, autToken) {
      try {
        const reqCities = await fetch(
          `https://www.universal-tutorial.com/api/cities/${selectedState}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${autToken}`,
            },
          }
        );

        if (reqCities.ok) {
          const responseCities = await reqCities.json();
          console.log(responseCities);
          // Process the response and populate the statesSelect dropdown

          for (d of responseCities) {
            const option = document.createElement("option");
            option.value = d.city_name;
            option.text = d.city_name;
            citiesSelect.appendChild(option);
          }
        } else {
          console.error("Failed to fetch cities data");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    getCities(selectedState, autToken);
  });
});
