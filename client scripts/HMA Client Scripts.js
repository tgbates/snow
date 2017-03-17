HMA Client Scripts

(HMA) Force Self-service ITIL Caller
function onLoad() {
   //Type appropriate comment here, and begin script below
  // if (!isLoading) {
		var caller=g_form.getValue('caller_id');
	 if (caller==""){
		   g_form.setValue('caller_id', g_user.userID);

	   }
  // }
}


Force Annotations to show up
function onLoad() {
   //Type appropriate comment here, and begin script below
      setPreference('glide.ui.show_annotations','true');
}


(HMA) Pull in Computer Name of Caller
function onChange(control, oldValue, newValue, isLoading) {
	if (!isLoading) {
		var caller=g_form.getValue('caller_id');
		if (caller){
			var gr=new GlideRecord('alm_hardware');
			gr.addQuery('assigned_to', caller);
			gr.query();
			if(gr.next()){
				g_form.setValue('u_computer', gr.serial_number);
			}
		}
	}
}




(HMA) Assign to CI Support Group
Set the Incident Assignment Group to the CI Support Group

//Set the assignment group to the CI support group
function onChange(control, oldValue, newValue, isLoading) {

	if (isLoading)
		return;

	if (newValue) {
		if (newValue != oldValue) {
			//Set Assignment Group to CI's support group if assignment group is empty
			if (g_form.getValue('assignment_group') == '') {
				var ciSupportGroup = g_form.getReference('cmdb_ci').support_group;
				if (ciSupportGroup != '')
					g_form.setValue('assignment_group', ciSupportGroup);
				/*
				Use the following section with script include ciCheck once it works

				var ga = new GlideAjax('ciCheck');

				ga.addParam('sysparm_name', 'getSupportGroup');
				ga.addParam('sysparm_ci', g_form.getValue('cmdb_ci'));
				ga.getXML(doAlert); */
				//ga.getXML(setAssignmentGroup);
			}
			//ga.addParam('sysparm_ag', g_form.getValue('assignment_group'));
			//ga.getXML(doAlert); // Always try to use asynchronous (getXML) calls rather than synchronous (getXMLWait)



		}
	}

}



function setAssignmentGroup(response) {

	var answer = response.responseXML.documentElement.getAttribute("answer");

	g_form.setValue('assignment_group', answer);
}

// Callback function to process the response returned from the server
function doAlert(response) {

	var answer = response.responseXML.documentElement.getAttribute("answer");

	alert(answer);
}
