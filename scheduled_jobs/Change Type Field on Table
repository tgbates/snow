Change Type Field on Table

//    Change Type Field on Table
//    Purpose: Scheduled Job created to ignore emails for testing purposes


/******************************
 *
 * Set the status of multiple records
 * Pass:
 * the table name to be updated
 * the sort_field,
 * the display_field,
 * the initial state
 * and the desired state
 **********************************/

do_set_record_status('sys_email','created_at','subject','type','send-ready', 'send-ignored');

function do_set_record_status(table_name,sort_field,display_field,state_name, initial_state,desired_state) {
	var job_name = 'Change Record state on (' + table_name + ')';

	var start_time = gs.nowDateTime();
	var end_time;
	var i = 0;

	gs.log('========== Begin ' + job_name + ' ==========');
	var gr = new GlideRecord(table_name);

	gr.addEncodedQuery('sys_created_on<javascript:gs.daysAgoStart(1)');
	gr.addQuery(state_name, initial_state);
	gr.query();
	while (gr.next() && i < 1000) {
		//gs.log(i + ': 1 - ' + gr.getDisplayValue() + ' - ' + gr.type);
		gr.type = desired_state;
		gr.update();
		gs.log(i + ': 2 - ' + gr.getDisplayValue() + ' - ' + gr.type);
		i++;
	}

	end_time = gs.nowDateTime();
	gs.log('========== Finish ' + job_name + ' start: ' + start_time + ' end: ' + end_time + ' ==========');

}
