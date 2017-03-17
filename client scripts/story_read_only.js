function onLoad() {
	//Type appropriate comment here, and begin script below
	var st = g_form.getValue('state');
	var disallowed_states = [3,4,17,18,20];
	if (st in disallowed_states) {  // set fields read-only
		var fields = g_form.getEditableFields();
		for (var i = 0; i < fields.length; i++) {
			g_form.setReadOnly(fields[i], true);
		}
		g_form.setReadOnly('state',false);
	}
}
