<!-- Page Heading -->
<div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800">Biodata</h1>
    <!-- <button id="add" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-download fa-sm text-white-50"></i> Add Biodata</button> -->
</div>

<div class="formParent">
    <div class="steps container">
        <div class="step1 step">
            <span class="step-bullet mb-3 activeStep">1</span>
            <h4>Personal Info</h4>
        </div>
        <div class="step2 step">
            <span class="step-bullet mb-3">2</span>
            <h4>Contact Info</h4>
        </div>
        <div class="step3 step">
            <span class="step-bullet mb-3">3</span>
            <h4>Political Info</h4>
        </div>
        <div class="step4 step">
            <span class="step-bullet mb-3">4</span>
            <h4>Document Upload</h4>
        </div>
    </div>

    <form action="" id="form" class="biodataForm" enctype="multipart/form-data">
        <div class="firstFormStep activeForm formStep">
            <div class="row">
                <div class="col-md-3 mb-3">
                    <label for="">Last Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="lastname" name="lastname" placeholder="Enter Lastname" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">First name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="firstname" name="firstname" placeholder="Enter Firstname" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Father's name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="fathersname" name="fathersname" placeholder="Enter Father's name" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Mother's Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="mothersname" name="mothersname" placeholder="Enter Mother's name" required>
                </div>
            </div>
            <div class="row">
                <div class="col-md-3 mb-3">
                    <label for="">الشهرة Lastname <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="arabic_lastname" name="arabic_lastname" placeholder="Enter Lastname in Arabic" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">الإسم Firstname <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="arabic_firstname" name="arabic_firstname" placeholder="Enter Arabic  Firstname" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">أسم الأب Fathername <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="arabic_fathersname" name="arabic_fathersname" placeholder="Enter Arabic Father's name" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">إسم الأم mothername <span class="text-danger">*</span>
                    </label>
                    <input type="text" class="form-control" id="arabic_mothersname" name="arabic_mothersname" placeholder="Enter Arabic Mother's name" required>
                </div>
            </div>
            <div class="row">
                <div class="col-md-3 mb-3">
                    <label for="">Spouse's Name</label>
                    <input type="text" class="form-control" id="spousename" name="spousename" placeholder="Enter Spouse's Name">
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Gender <span class="text-danger">*</span></label>
                    <select name="gender" id="gender" class="form-control form-select">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Date of Birth <span class="text-danger">*</span></label>
                    <input type="date" class="form-control" name="dob" id="dob" placeholder="Enter Date of Birth" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Blood Group <span class="text-danger">*</span></label>
                    <select name="blood_group" id="blood_group" class="form-control form-select" required>
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-md-3 mb-3">
                    <label for="">إسم الزوجة spousename</label>
                    <input type="text" class="form-control" id="arabic_spousename" name="arabic_spousename" placeholder="Enter Arabic Spouse's Name">
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Religion</label>
                    <select name="religion" id="religion" class="form-control form-select">
                        <option value="">Select Religion</option>
                        <?php
                        $query = $global::fetchAll('SELECT * FROM `religion`');
                        while ($row = mysqli_fetch_array($query)) {
                            extract($row);
                        ?>
                            <option value=<?php echo $id ?>><?php echo $religion ?></option>
                        <?php
                        }
                        ?>
                    </select>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Occupation</label>
                    <input type="text" class="form-control" id="occupation" name="occupation" placeholder="Enter Occupation">
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Reference</label>
                    <input type="text" class="form-control" name="reference" id="reference" placeholder="Reference">
                </div>
            </div>

            <div class="butonDiv">
                <button class="btn btn-primary next">Next</button>
            </div>

            <!-- ===============End of parent form div ============= -->
        </div>


        <div class="secondFormStep  formStep">
            <div class="row">
                <div class="col-md-3 mb-3">
                    <label for="">Email <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="email" name="email" placeholder="Enter Email" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Home Address</label>
                    <input type="text" class="form-control" id="homeAddress" name="homeAddress" placeholder="Enter Home Address">
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Residential Address</label>
                    <input type="text" class="form-control" id="residentialAddress" name="residentialAddress" placeholder="Enter Residential Address">
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Home Address in Nigeria</label>
                    <input type="text" class="form-control" id="homeAddressInNigeria" name="homeAddressInNigeria" placeholder="Enter Home Address In Nigeria">
                </div>
            </div>
            <div class="row">
                <div class="col-md-3 mb-3">
                    <label for="">Home Address in Lebanon</label>
                    <input type="text" class="form-control" id="homeAddressInLebanon " name="homeAddressInLebanon" placeholder="Enter Home Address in Lebanon">
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Lebanese Phone Number</label>
                    <input type="text" class="form-control" id="lebanesePhoneNumber" name="lebanesePhoneNumber" placeholder="Enter Lebanese Phone Number">
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Nigerian Phone Number</label>
                    <input type="text" class="form-control" id="nigerianPhoneNumber" name="nigerianPhoneNumber" placeholder="Enter Nigerian Phone Number">
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Other Phone Number
                    </label>
                    <input type="text" class="form-control" id="otherPhoneNumber" name="otherPhoneNumber" placeholder="Enter Other Phone Number">
                </div>
            </div>
            <div class="row">
                <div class="col-md-3 mb-3">
                    <label for="">Emergency Number <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="emergencyNumber" name="emergencyNumber" placeholder="Enter Emergency Number" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Lebanese Passport Number <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="lebanesePassportNumber" name="lebanesePassportNumber" placeholder="Enter Lebanese Passport Number" required>
                </div>

                <div class="col-md-3 mb-3">
                    <label for="">Nigeria Passport Number </label>
                    <input type="text" class="form-control" name="nigeriaPassportNumber" id="nigeriaPassportNumber" placeholder="Enter Nigeria Passport Number">
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Lebanese Passport validity <span class="text-danger">*</span></label>
                    <input type="date" class="form-control" name="lebanesePassportvalidity" id="lebanesePassportvalidity" placeholder="Enter Lebanese Passport Validity" required>
                </div>

            </div>
            <div class="row">
                <div class="col-md-3 mb-3">
                    <label for="">Nigeria Passport validity</label>
                    <input type="date" class="form-control" id="nigeriaPassportValidity" name="nigeriaPassportValidity" placeholder="Enter Nigeria Passport Validity">
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Registration Number <span class="text-danger">*</span></label>
                    <input type="number" class="form-control" id="registrationNumber" name="registrationNumber" placeholder="Enter Registration Number" required>
                </div>

                <div class="col-md-3 mb-3">
                    <label for="">Membership Id <span class="text-danger">*</span></label>
                    <input type="number" class="form-control" id="membershipId" name="membershipId" placeholder="Enter Membership Id" required>
                </div>
                <!-- <div class="col-md-3 mb-3">
                    <label for="">First name</label>
                    <input type="text" class="form-control" placeholder="Enter Firstname" required>
                </div> -->
            </div>

            <div class="butonDiv">
                <button class="btn btn-primary previous">Previous</button>
                <button class="btn btn-primary next" type="submit">Next</button>

            </div>
            <!-- end of parent form div -->
        </div>

        <div class="thirdFormStep  formStep">
            <div class="row">
                <div class="col-md-3 mb-3">
                    <label for="">Nationality <span class="text-danger">*</span></label>
                    <select name="countries" id="countries" class="form-control form-select" required>
                        <option value="">Select Country</option>
                        <?php
                        $sql = "SELECT * FROM `country`";
                        $querySql = mysqli_query($db->con, $sql);
                        while ($row = mysqli_fetch_assoc($querySql)) {
                            extract($row);
                        ?>
                            <option value="<?php echo $id ?>"><?php echo $country_name ?></option>
                        <?php
                        }
                        ?>

                    </select>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">State</label>
                    <select name="states" id="states" class="form-control form-select" required>
                        <option value="">Select State</option>

                    </select>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">City</label>
                    <select name="cities" id="cities" class="form-control form-select">
                        <option value="">Select City</option>

                    </select>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Political Affiliation</label>
                    <input type="text" class="form-control" id="politicalAffiliation" name="politicalAffiliation" placeholder="Enter Political Affiliation">
                </div>
            </div>
            <div class="row">
                <div class="col-md-3 mb-3">
                    <label for="">Political View</label>
                    <input type="text" class="form-control" id="politicalView" name="politicalView" placeholder="Enter Political View">
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Political View Id</label>
                    <input type="number" class="form-control" id="politicalViewId" name="politicalViewId" placeholder="Enter Political View Id">
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Election Id
                    </label>
                    <input type="number" class="form-control" id="electionId" name="electionId" placeholder="Enter Election Id">
                </div>
                <div class="col-md-3 mb-3">
                    <label for="">Election year
                    </label>
                    <select id="year" name="year" class="form-control form-select">
                        <option value="">Select Election Year</option>
                        <script>
                            const currentYear = new Date().getFullYear();
                            for (let year = currentYear; year >= currentYear - 20; year--) {
                                document.write(`<option value="${year}">${year}</option>`);
                            }
                        </script>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="">Registration region <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="registrationRegion" name="registrationRegion" placeholder="Enter Registration Region" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="">Registration town <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="registrationTown" name="registrationTown" placeholder="Enter Registration Town" required>
                        </div>

                        <div class="col-md-6 mb-3">
                            <label for="">Registered province <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" name="registeredProvince" id="registeredProvince" placeholder="Enter Registered Province" required>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="row">
                        <div class="col-md-12 mb-3">
                            <label for="">About Yourself</label>
                            <textarea name="abt_yourself" id="abt_yourself" class="form-control" cols="30" rows="10" style="height: 100px;"></textarea>
                        </div>
                    </div>
                </div>
            </div>


            <div class="butonDiv">
                <button class="btn btn-primary previous">Previous</button>
                <button class="btn btn-primary next" type="submit">Next</button>

            </div>
        </div>
        <div class="forthFormStep  formStep">
            <div class="row">
                <div class="col-md-3 photo_div mb-3">
                    <div class="card">
                        <div class="card-body">
                            <!-- <h4 class="card-title">Membership Id Picture</h4> -->
                            <label for="input-file-now" class="form-label">Membership Id Picture</label>
                            <input type="file" id="input-file-now" class="dropify photo" name="membershipPhoto" />
                        </div>
                    </div>
                </div>
                <div class="col-md-3 photo_div mb-3">
                    <div class="card">
                        <div class="card-body">
                            <!-- <h4 class="card-title">Profile Picture</h4> -->
                            <label for="input-file-now" class="form-label">Profile Picture</label>
                            <input type="file" id="input-file-now" class="dropify photo" name="profilePhoto" />
                        </div>
                    </div>
                </div>

                <div class="col-md-3 photo_div mb-3">
                    <div class="card">
                        <div class="card-body">
                            <!-- <h4 class="card-title">Lebanese Passport Picture</h4> -->
                            <label for="input-file-now" class="form-label">Lebanese Passport Picture</label>
                            <input type="file" id="input-file-now" class="dropify photo" name="lebanesePassportPhoto" />
                        </div>
                    </div>
                </div>

                <div class="col-md-3 photo_div mb-3">
                    <div class="card">
                        <div class="card-body">
                            <!-- <h4 class="card-title">Nigeria Passport Picture</h4> -->
                            <label for="input-file-now" class="form-label">Nigeria Passport Picture</label>
                            <input type="file" id="input-file-now" class="dropify photo" name="nigeriaPassportPhoto" />
                        </div>
                    </div>
                </div>

            </div>
            <!-- <div class="row">

              

            </div> -->

            <div class="butonDiv">
                <button class="btn btn-primary previous">Previous</button>
                <button id="save_btn" class="btn btn-primary" type="submit">Submit</button>

            </div>
        </div>
</div>





</form>
</div>