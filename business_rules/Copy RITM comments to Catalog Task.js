// (TGB) Copy RITM comments to Catalog Task

// Take the comments made by customer/fulfiller on a RITM and copy to the Catalog task

// table: Requested Item [request_item]
// when to run: before update
// filter conditions: Additional comments changes or Work notes changes


// Advanced

(function executeRule(current, previous /*null when async*/) {

	var sc = new GlideRecord('sc_task');

	// Get the tasks related to the current RITM
	sc.addQuery('request_item', current.sys_id);
	sc.query();

	// Update the comments for all tasks
	while (sc.next()) {
		// Function setJournalEntry is not allowed in scope
		// https://community.servicenow.com/message/764343#764343
		//  sc.comments.setJournalEntry(current.comments);

		// Update without setJournalEntry function
		sc.comments = current.comments;

		//var message = sc.number + " : " + current.comments;
		// *** remove after testing ???
		//gs.addInfoMessage(message);

		sc.update();

	}

})(current, previous);
