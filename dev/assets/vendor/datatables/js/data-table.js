jQuery(document).ready(function ($) {
	"use strict";

	if ($("table.first").length) {
		$(document).ready(function () {
			$("table.first").DataTable({
				length: 25,
				searching: false,
				lengthChange: false,
			});
		});
	}

	/* Calender jQuery **/

	if ($("table.second").length) {
		$(document).ready(function () {
			var table = $("table.second").DataTable({
				lengthChange: false,
				buttons: ["copy", "excel", "pdf", "print", "colvis"],
			});

			table.buttons().container().appendTo("#example_wrapper .col-md-6:eq(0)");
		});
	}
});
