createDevTask();

function createDevTask() {
	// given an existing rm_defect,
	// copy data to a new defect record (including comments, attachments)
	// close rm_defect
	
	var task = new GlideRecord("rm_scrum_task");
	task.short_description = current.short_description;
	task.description = current.description;
	task.priority = current.priority;
	task.parent = current.sys_id;
	task.u_product = current.u_product;
	task.u_release = current.u_release;
	task.u_story = current.u_story;
	task.assignment_group = current.assignment_group;
	task.assigned_to = current.assigned_to;
	task.impact = current.impact;
	task.priority = current.priority;
	task.watch_list = current.watch_list;
	task.work_notes_list = current.work_notes_list;
	
	// copy journal entries (comments and work notes)
	var result = '';	
	var notes = current.comments_and_work_notes.getJournalEntry(-1); // get all notes
	
	// split them out so we can put them in reverse order as normal
	var split_notes = notes.split("\n\n");
	for (var i = 0; i < split_notes.length; i++) {
		result += "\n\n" + split_notes[i];
	}	
	result = current.number + ' cancelled on ' + gs.nowDateTime() + "\n\n" + result;	
	task.work_notes = result;		
	
	// insert new record on rm_scrum_task table
	var taskSys = task.insert();
	
	// copy attachments
	GlideSysAttachment.copy('rm_defect', current.sys_id, 'rm_scrum_task', taskSys);
	
	
	// close current record
	current.comments = 'Cancelled ' + current.number + ' and created ' + task.number + ' on ' + gs.nowDateTime();
	current.state = 7;
	current.update();
	
	
	//Insert relationship
	var rel = new GlideRecord('task_rel_task');
	rel.parent = current.sys_id;
	rel.child = taskSys;
	rel.type.setDisplayValue('Caused by::Causes');
	rel.insert();
	
	// notify user
	gs.addInfoMessage(gs.getMessage("Development Task {0} created", task.number));
	action.setRedirectURL(task);
	action.setReturnURL(current);
}
