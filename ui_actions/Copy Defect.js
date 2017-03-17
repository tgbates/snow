createDefect();

function createDefect() {
	var task = new GlideRecord("rm_defect");
	task.short_description = current.short_description;
	task.description = current.description;
	task.priority = current.priority;
	task.parent = current.sys_id;
	task.u_product = current.u_product;
	task.u_release = current.u_release;
	task.assignment_group = current.assignment_group;
	task.assigned_to = current.assigned_to;

// https://community.servicenow.com/thread/163349

  var result = '';
	var notes = current.work_notes.getJournalEntry(-1); // get all
	var split_notes = notes.split("\n\n");
	for (var i = 0; i < split_notes.length; i++) {
		result = split_notes[i] + "\n" + result;
	}

	task.work_notes = result;
	gs.addInfoMessage(result);

	var taskSys = task.insert();
	GlideSysAttachment.copy('rm_enhancement', current.sys_id, 'rm_enhancement', taskSys);

	// update current record
	current.comments = 'Created new defect ' + task.number + ' on ' + gs.nowDateTime();
	current.state = 7;
	current.update();


	//Insert relationship
	var rel = new GlideRecord('task_rel_task');
	rel.parent = current.sys_id;
	rel.child = taskSys;
	rel.type.setDisplayValue('Caused by::Causes');
	rel.insert();

	gs.addInfoMessage(gs.getMessage("Defect {0} created", task.number));
	action.setRedirectURL(task);
	action.setReturnURL(current);
}



createChronologicalLog();

function createChronologicalLog() {
	var result = '';
	var notes = current.comments_and_work_notes.getJournalEntry(-1); // get all
	var split_notes = notes.split("\n\n");
	for (var i = 0; i < split_notes.length; i++) {
		result = split_notes[i] + "\n" + result;
	}
	current.work_notes = result;
	current.update();
	gs.addInfoMessage(result);
	action.setRedirectURL(current);
	action.setReturnURL(current);
}
