/**
* Touch all records on sc_req_item_sla
* 
* @summary script to touch all records on sc_req_item_sla - run as scheduled job
* 
* From https://community.servicenow.com/thread/163583
* 
*
* @author Geoff Cox - https://community.servicenow.com/people/geoffcox
* 2015-05-18
* 
*/

do_touch_all_records('sc_req_item_sla','number','number');

function do_touch_all_records(table_name,sort_field,display_field) {
	var start_time = gs.nowDateTime();
	var end_time;
	var job_name = 'Touch All Records (' + table_name + ')';
	gs.log('========== Begin ' + job_name + ' ==========');
	var gr = new GlideRecord(table_name);
	//gr.addQuery('state', '3');  // complete
	var prevWkStartDate = new GlideDateTime();
	prevWkStartDate.daysAgoStart(14);
	gr.addQuery('opened_at', prevWkStartDate);	
	gr.orderBy(sort_field);
	gr.query();
	//var x = gr.getRowCount();
	var x = 100;
	gs.log('===Touching ' + x + ' records====');
	while ((gr.next()) && (x>0)) {
		gr.autoSysFields(false);
		gr.setForceUpdate(true);
		gr.update();
		//gs.log(x +': Touching ' + table_name + '.' + gr[display_field]);
		x--;
	}
	end_time = gs.nowDateTime();
	gs.log('========== Finish ' + job_name + ' start: ' + start_time + ' end: ' + end_time + ' ==========');
	//trigger_scheduled_job_finish(job_name,start_time,end_time);
}
