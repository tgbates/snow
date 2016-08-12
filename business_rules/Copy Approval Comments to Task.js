// (TGB) Copy Approval Comments to Task

// Take the comments made by approver/rejector of a task and copy to the task (RITM, CHG, etc)

// table: Approval [sysapproval_approver]
// when to run: before update

// Advanced
// condition: current.state.changes()

(function executeRule(current, previous /*null when async*/) {

	var tsk = new GlideRecord('task');

	// Get the task to which the approval relates
	tsk.get(current.sysapproval);

	// Update the comments
	tsk.comments = current.state.getDisplayValue() + ' by ' + current.approver.name + ' on ' + current.sys_updated_on + '\nComments:  '  + current.comments;
	tsk.update();

})(current, previous);
