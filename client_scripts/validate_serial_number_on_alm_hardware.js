// (TGB) Validate Serial Number on alm_hardware

// Check to make sure entered serial number fits the required alphanumeric

// table: Hardware [alm_hardware]
// when to run: onChange
// Field name: Serial number


function onChange(control, oldValue, newValue, isLoading) {
	 // validate that the serial number is alphanumeric and not already in use
	if (!isLoading) {
	  if (oldValue != newValue) {
		g_form.clearMessages();
		//alert('you changed serial # from ' + oldValue + ' to ' + newValue);
		//g_form.hideErrorBox('create_valid_serial_number'); // hides error message (if there is one)
		if (isValidSerialNumber(newValue)) {
			//alert('you changed serial # from ' + oldValue + ' to ' + newValue);
			var req_sn = newValue.toUpperCase(); //.toUpper();
			var gr = new GlideRecord('alm_hardware');
			gr.addQuery('serial_number', req_sn);
			gr.query();
			if (gr.next()) {  // already exists
				//alert(req_sn + ' already exists in the asset database.');
				g_form.showErrorBox('serial_number', 'Please enter a unique serial number.');
				return false;
			}
			else { // does not already exist
				return true;
			}
		}
        else {
            g_form.showErrorBox('serial_number' , 'Please enter a valid Serial Number');   // shows error message
			//alert(newValue + ' is an invalid Serial Number -- please enter a minimum of 3 alphanumerics.');
        	return false;
		}
	  }
	}
   }



	function isValidSerialNumber(string) {
		if (string.search(/^[0-9a-zA-Z-\/]{3,}$/) != -1) {
		  //alert(string + ' is a Valid Serial Number.');
		  return true; }
        else {
		  //alert(string + ' is an Invalid Serial Number');
          return false;
    }
} // end isValidSerialNumber
