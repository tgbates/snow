//    Name: Set all emails to Ignore for Live Testing
//    Purpose: Set emails in send-ready state to send-ignored so they will not go out
//    Run: On Demand
//

do_ignore_emails('sys_email');

function do_ignore_emails(table) {
  var start_time = gs.nowDateTime();
  var end_time;
  var job_name = ' Set all emails to Ignore for Live Testing ';
  gs.log('========== Begin ' + job_name + ' =============');
  var count = 0;

  // find any ready emails and set to ignore
  var gr=new GlideRecord('sys_email');
  gr.addQuery('type','send-ready');
  gr.query();

  while (gr.next()) {
    gr.type = 'send-ignored';
    gr.update();
    count++;
  }

  end_time = gs.nowDateTime();
	gs.log('========== Finish ' + job_name + ' start: ' + start_time + ' end: ' + end_time + ' and updated ' + count + ' records on ' + table + ' table. ==========');
}
