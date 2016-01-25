/**
* @summary update 'Has Breached Display' value for requested items closed in a particular month
*	task_sla table contains this field
*	look up task_sla record with matching sc_req_item 
*
* @author Thomas G Bates
*
* problem is task_sla record doesn't exist if sla not triggered
* need to create record and then can update it
*/

update_met_breached('sc_req_item');

function update_met_breached(table_name) {
	var job_name = 'Update Met and Breached (' + table_name + ')';
	gs.log('========== BEGIN ' + job_name + ' ==========');
	var gr = new GlideRecord(table_name);	
	gr.addQuery('closed_at','>=','2015-12-05');
	gr.addQuery('closed_at','<=','2016-01-01');
	//gr.addNullQuery('u_has_breached_display');
	gr.query();
	var x = 1000;
	var total_ritms = 0;
	var met = 0;
	var missed = 0;
	while (gr.next() && (x>0)) {
		total_ritms++;
		//var num = gr.sys_id;
		var ts = new GlideRecord('task_sla');
		ts.addQuery('task',gr.sys_id);
		ts.query();
		if (gr.closed_at > gr.due_date) {
			missed++;
			if (ts.next()) {
					gs.log(x + ': Miss: ' + ts.task.number + ' - u_has_breached_display: ' + ts.u_has_breached_display);
			}
		//gs.log('Missed: ' + gr.number + ' due: ' + gr.due_date + ' closed: ' + gr.closed_at);
		}
		if (gr.closed_at < gr.due_date) {
			met++;		
			if (ts.next()) {
					gs.log(x + ': Met: ' + ts.task.number + ' - u_has_breached_display: ' + ts.u_has_breached_display);
			}
		}
		x--;				
	}
	gs.log('============FINISH ' + job_name + ' met = ' + met + '; missed = ' + missed + '; total RITMs = ' + total_ritms + '===========');

	
}
