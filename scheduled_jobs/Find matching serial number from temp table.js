/**
* Find matching serial number from temp table
* 
* @summary script to count number of records with matching keys on two tables
* 
* compare given serial number on hardware and temp table to update model
* 1. upload xls of sn + desired model to a temp table
* 2. for each rec on temp table, look up alm_hardware record that matches given serial #
* 3. incr counter
*
* @author Thomas G Bates
* 2015-12-04
*/

var i = 0;
var temp = new GlideRecord('u_temp_laptops');
temp.addNotNullQuery('u_serial_number');
temp.query();
gs.log("1. In Find matching serial number from temp table...");

while (temp.next()) {
	var sn = temp.u_serial_number;
	var new_mod = temp.u_corrected_model;
	var ah = new GlideRecord('alm_hardware');
	ah.addQuery('serial_number',sn);
	ah.query();
	while(ah.next()){
		gs.log("2. ah.serial_number= " + ah.serial_number + " ; ah.sys_id= " + ah.sys_id);		
		gs.log("3. ah.model.gDV= " + ah.model.getDisplayValue() +  " ; ah.model= " + ah.model);
		gs.log("4. new_mod= " + new_mod);
		gs.log("5. temp.u_corrected_model= " + temp.u_corrected_model + " ; temp.u_corrected_model.sys_id= " + temp.u_corrected_model.sys_id);
		gs.log("6. ah.ci= " + ah.ci + "ah.ci.model_id= " + ah.ci.model_id);
		i++;
	}
}

gs.log(i + " records found.");
