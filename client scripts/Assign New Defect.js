SDLC Assign New Defect
Set the Assignment Group and Assigned To fields based on the Product Owner, for a new record
Table: rm_defect
Type: onLoad
// Thomas G Bates - 2017/01/17

function onLoad() {
	// set assignment group, assigned_to to default to product owner and assignment group
	// uses script include ProductOwnerReturn_SLAC

	if (!g_form.isNewRecord()) {
		return;
	}
	else {
		var prod = g_form.getValue('u_product');
		var ga = new GlideAjax('ProductOwnerReturn_SLAC');
		ga.addParam('sysparm_name','returnOwner');
		ga.addParam('sysparm_product',prod);
		ga.getXML(ReturnOwnerParse);

		var ga2 = new GlideAjax('ProductOwnerReturn_SLAC');
		ga2.addParam('sysparm_name','returnGroup');
		ga2.addParam('sysparm_product',prod);
		ga2.getXML(ReturnGroupParse);
	}

	function ReturnOwnerParse(response) {
		var answer = response.responseXML.documentElement.getAttribute("answer");
		// set Product Owner as initial Assigned to on form
		g_form.setValue('assigned_to', answer);
	}


	function ReturnGroupParse(response) {
		var answer = response.responseXML.documentElement.getAttribute("answer");
		//g_form.addInfoMessage(answer);
		g_form.setValue('assignment_group', answer);
	}

}
