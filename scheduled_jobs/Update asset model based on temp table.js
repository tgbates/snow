/**
* Update asset model based on temp table
* 
* @summary script to update records with matching keys on two tables
* 
* compare given serial number on hardware and temp table to update model
* 1. upload xls of sn + desired model to a temp table
* 2. for each rec on temp table, look up alm_hardware record that matches given serial #
* 3. if the models don't match, update the alm_hardware record with the temp record model
*
* @author Thomas G Bates
* 2015-12-04
*/

var i = 0;
var temp = new GlideRecord('u_temp_laptops');
temp.addNotNullQuery('u_serial_number');
temp.query();
gs.log("In Update asset model based on temp table...");

while (temp.next()) {
	var sn = temp.u_serial_number;
	var new_mod = temp.u_corrected_model;
	var ah = new GlideRecord('alm_hardware');
	ah.addQuery('serial_number',sn);
	ah.query();
	while(ah.next()){
	 gs.log("1, " + ah.serial_number + ", " + ah.model.getDisplayValue() + ", " + new_mod.getDisplayValue());
		gs.log("1a, temp.u_corrected_model.sys_id= " + temp.u_corrected_model.sys_id);
		gs.log("2, " + ah.ci + ", " + ah.ci.name);
		i++;
		ah.ci.name = temp.u_corrected_model.sys_id;
		ah.update();
		gs.log("3, " + ah.serial_number + ", " + ah.model + ", " + temp.u_corrected_model + ", updated.");
		gs.log("4, " + ah.ci + ", " + ah.ci.name + ", updated.");
		
	}
}

gs.log(i + " records updated.");
