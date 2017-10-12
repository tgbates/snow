/*
 * Business Rule: Assign Catalog Task to Prior Assignee
 * Table: sc_task
 * Advanced: True
 * When to run: Insert/Update
 * Conditions: Assigned to is empty and Request Item is not empty
 * Summary: If a new catalog task is assigned to the same group, 
 *   automatically assign it to the person who closed the previous task. 
 *
 */
// Look up assignee for the previous task for this RITM and assign the new task to that person.
var sct = new GlideRecord('sc_task');//look at the catalog task table
sct.addQuery('request_item',current.request_item);//where the parent is the same as this task's
sct.addQuery('assignment_group', current.assignment_group);  // assignment group is the same
sct.orderByDesc('work_end');  //where the work_end is the most recent first
sct.query();  //query it
if(sct.next()){  //in the first record
	current.assigned_to = sct.assigned_to;
	//take the assigned_to and set it to your new tasks assigned to
}
