<?php
$response = array('message' => '', 'status' => 0);
require_once('init.php');
if (isset($_POST['lastname'])) {


    // Create an array to store the name attributes
    $nameAttributes = array();

    // Loop through the POST data and store each name attribute in the array
    foreach ($_POST as $name => $value) {
        $nameAttributes[$name] = $value;
    }

    // Now you have all the name attributes in the $nameAttributes array
    // You can access them using their variable names
    foreach ($nameAttributes as $nameAttribute => $value) {
        $$nameAttribute = $value; // Create a variable with the name attribute as the variable name
    }

    // You can now use the variables in your PHP code
    // For example, if you have an input with name="lastname", you can access it as $lastname
    // echo $lastname; // This will print the value of the "lastname" input field
    $folder = '../img/';
    $profilePhoto = $_FILES['profilePhoto']['name'];
    $profile_photo_tmp_file = $_FILES['profilePhoto']['tmp_name'];
    $nigeriaPassportPhoto = $_FILES['nigeriaPassportPhoto']['name'];
    $nigeriaPassportPhotoTmpFile = $_FILES['nigeriaPassportPhoto']['tmp_name'];
    $lebanesePassportPhoto = $_FILES['lebanesePassportPhoto']['name'];
    $lebanesePassportPhotoTmpFile = $_FILES['lebanesePassportPhoto']['tmp_name'];
    $membershipPhoto = $_FILES['membershipPhoto']['name'];
    $membershipPhotoTmpFile = $_FILES['membershipPhoto']['tmp_name'];
    $submission_date = date("Y-m-d");
    $sql = "INSERT INTO `reg_form`(`submission_date`, `lastname`,
     `arab_lastname`, `firstname`, `arab_firstname`, `fathername`,
      `arab_fathername`, `mothername`, `arab_mothername`, `spousename`,
       `arab_spousename`, `dob`, `bloodgroup`, `religion_id`, `gender`,
        `occupation`, `regnumber`, `membership_id`, `membership_id_picture`,
         `reference`, `nationality`, `state`, `city`, `political_affiliation`,
          `political_view`, `political_view_id`, `election_id`, `election_year`,
           `registration_region`, `registration_town`, `registered_province`,
            `note`, `lebanese_passport_number`, `nigeria_passport_number`,
             `lebanese_passport_validity`, `nigeria_passport_validity`,
              `home_address`, `residential_address`, `email`,
               `lebanese_phone_number`, `other_phone_number`,
                `home_address_in_nigeria`, `home_address_in_lebanon`,
                 `emergency_number`, `nigerian_phone_number`, `profile_picture`,
                  `nigeria_passport_picture`, `lebanese_passport_picture`) ";
    $sql .= "VALUES ('";
    $sql .= $submission_date . "','";
    $sql .= $lastname . "','";
    $sql .= $arabic_lastname . "','";
    $sql .= $firstname . "','";
    $sql .= $arabic_firstname . "','";
    $sql .= $fathersname . "','";
    $sql .= $arabic_fathersname . "','";
    $sql .= $mothersname . "','";
    $sql .= $arabic_mothersname . "','";
    $sql .= $spousename . "','";
    $sql .= $arabic_spousename . "','";
    $sql .= $dob . "','";
    $sql .= $blood_group . "','";
    $sql .= $religion . "','";
    $sql .= $gender . "','";
    $sql .= $occupation . "','";
    $sql .= $registrationNumber . "','";
    $sql .= $membershipId . "','";
    $sql .= $membershipPhoto . "','";
    $sql .= $reference . "','";
    $sql .= $countries . "','";
    $sql .= $states . "','";
    $sql .= $cities . "','";
    $sql .= $politicalAffiliation . "','";
    $sql .= $politicalView . "','";
    $sql .= $politicalViewId . "','";
    $sql .= $electionId . "','";
    $sql .= $year . "','";
    $sql .= $registrationRegion . "','";
    $sql .= $registrationTown . "','";
    $sql .= $registeredProvince . "','";
    $sql .= $abt_yourself . "','";
    $sql .= $lebanesePassportNumber . "','";
    $sql .= $nigeriaPassportNumber . "','";
    $sql .= $lebanesePassportvalidity . "','";
    $sql .= $nigeriaPassportValidity . "','";
    $sql .= $homeAddress . "','";
    $sql .= $residentialAddress . "','";
    $sql .= $email . "','";
    $sql .= $lebanesePhoneNumber . "','";
    $sql .= $otherPhoneNumber . "','";
    $sql .= $homeAddressInNigeria . "','";
    $sql .= $homeAddressInLebanon . "','";
    $sql .= $emergencyNumber . "','";
    $sql .= $nigerianPhoneNumber . "','";
    $sql .= $profilePhoto . "','";
    $sql .= $nigeriaPassportPhoto . "','";
    $sql .= $lebanesePassportPhoto . "'";
    $sql .= ")";

    $querySql = mysqli_query($db->con, $sql);
    if ($querySql) {
        global $global;
        $lastInsertedID = $db->the_insert_id();
        // return true;
        move_uploaded_file($profile_photo_tmp_file, $folder . $profilePhoto);
        move_uploaded_file($nigeriaPassportPhotoTmpFile, $folder . $nigeriaPassportPhoto);
        move_uploaded_file($lebanesePassportPhotoTmpFile, $folder . $lebanesePassportPhoto);
        move_uploaded_file($membershipPhotoTmpFile, $folder . $membershipPhoto);
        $response['message'] = "success";

        echo json_encode($response);
        // echo "Success";
    } else {
        $response['message'] = ('QUERY ERROR' . mysqli_error($db->con));
        echo json_encode($response);
        // die('QUERY ERROR' . mysqli_error($db->con));
    }
}
