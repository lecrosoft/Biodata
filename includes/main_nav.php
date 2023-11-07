<nav id="lateral-nav" class="display-print-none">
	<!-- adding userlevel here which will be used to remove menu nodes that contain links to pages that cant't be accessed by user	-->
	<div style="visibility:hidden" id="userlevel" data-val=""> </div>

	<ul class="navigation">
		<!-- Logo Start -->
		<div class="logo">
			<!-- <img src="images/GDS-2.png" width="85" /> -->
			<h1 class="text-white" style="color:white">BIODATA</h1>
		</div>
		<!-- Logo End -->

		<!-- Order List Menu 1 Start -->
		<a href="index">Dashboard</a>
		<?php

		if ($_SESSION['user_role'] == "Admin") {

		?>
			<a href="biodata">Biodata</a>
			<!-- <a href="sub_unit">Sub Unit</a>
			<a href="maintenance">Maintenance</a> -->
			<li class="item-has-children main-hold">
				<a autorun>Reports</a>
				<ul class="sub-menu">

					<!-- <li><a href="maintainance_report" target="_">Maintenance</a></li> -->
				</ul>
			</li>

			<a href="users">Users</a>


		<?php
		} else if ($_SESSION['user_role'] == "Report") {
		?>

			<li class="item-has-children main-hold">
				<a autorun>Reports</a>
				<ul class="sub-menu">

					<li><a href="maintainance_report" target="_">Maintenance</a></li>
				</ul>
			</li>


		<?php
		} else if ($_SESSION['user_role'] == "Maintenance") {
		?>
			<a href="maintenance">Maintenance</a>
			<li class="item-has-children main-hold">
				<a autorun>Reports</a>
				<ul class="sub-menu">

					<li><a href="maintainance_report" target="_">Maintenance</a></li>
				</ul>
			</li>

		<?php
		}
		?>

		<ul class="navigation single-item-wrapper">
			<a href="logout">Logout</a>
		</ul>
		<!--single-item-wrapper -->

		<!--	<ul class="navigation single-item-wrapper">
		</ul> single-item-wrapper -->
	</ul> <!-- navigation -->
</nav>