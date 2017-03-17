//    (SLAC) Close Work in Progress Chat Queue Entries
//    Purpose: Scheduled Job to close open chat tasks if they don't close normally.  Geneva bug to be resolved in Helsinki.
//    See INC0107529 for more details
//

do_close_chat_queue_entries('chat_queue_entry');

function do_close_chat_queue_entries(table) {
	var start_time = gs.nowDateTime();
	var end_time;
	var job_name = '(SLAC) Close Work in Progress Chat Queue Entries (' + table + ')';
	gs.log('========== Begin ' + job_name + ' ==========');
	var count = 0;

	// find any open chats and close them
	var chat = new GlideRecord(table);
	chat.addQuery('state','!=',3);  // Closed Complete
	chat.addQuery('action','accepted');
	chat.query();

	while (chat.next()) {
		//gs.log('Closing Chat ' + chat.number);
		chat.state = 3; // Closed Complete
		count++;
		chat.update();
	}
	end_time = gs.nowDateTime();
	gs.log('========== Finish ' + job_name + ' start: ' + start_time + ' end: ' + end_time + ' and closed ' + count + ' chats. ==========');
}
