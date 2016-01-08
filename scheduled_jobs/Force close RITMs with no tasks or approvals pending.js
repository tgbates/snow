/**
* Force close RITMs with no tasks or approvals pending
* 
* @summary script to find all open RITMs that should be closed (due to having no tasks and no requested approvals) and close them
*  
*
* @author Thomas G Bates
* 2015-05-15
* 
*/

countClosed();

function countClosed(){

	var i = 0;
	var x=0;
	var total = 0;
	var numtasks = 0;
	var num_not_requested = 0;
	var ritm = new GlideRecord('sc_req_item');
	ritm.addQuery('state', 'NOT IN', '3,4,7');  // not closed
	ritm.query();
	while (ritm.next() && (i < 350)) {
		x++;
		var closeItem = true;
		var task = new GlideRecord('sc_task');
		task.addQuery('request_item', ritm.sys_id);
		task.addQuery('state', 'NOT IN', '3,4,7');  // not closed
		task.query();
		if (task.next()) {
			numtasks++;
			closeItem = false;
		}
		var app = new GlideRecord('sysapproval_approver');
		app.addQuery('sysapproval', ritm.sys_id);
		app.addQuery('state', 'requested');
		app.query();
		if (app.next()) {
			num_not_requested++;
			closeItem = false;
		}
		if (closeItem) {
			i++;
			ritm.state = '3';
			//gs.log(i + ': Closing ' + ritm.number);
			ritm.update();
		}
	}
	gs.log('Force close RITMs: ' + x + ' total open ritms; ' + i + ' closed; ' + numtasks + ' had tasks open; ' + num_not_requested + ' had requested approvals.');
}
