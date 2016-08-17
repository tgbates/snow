// Cancel Requested Item
//
// Take the comments made by approver/rejector of a task and copy to the task (RITM, CHG, etc)
//
// table: Requested Item [sc_req_item]
// when to run: Show insert, Show update, Form button <-- all checked
//
// Comments For an active requested item, allow its cancellation using a button.
// @author Tom Bates
// @date 6/10/2016
// @summary Cancels the Requested Item and Workflow.  Marks any tasks "Closed Incomplete" and rolls up to Request level if no other outstanding Requested Items for that Request
//
//
// Advanced
// condition: current.active==true;

doCancel();

function doCancel(){
	var gr = new GlideRecord("sc_req_item");
	gr.addQuery("sys_id", current.sys_id);
	gr.query();
	if (gr.next()) {
				var myUserObject = gs.getUser();
				current.comments = 'Cancelled by ' + myUserObject.getFirstName() + ' ' + myUserObject.getLastName() + ' on ' + gs.nowDateTime();
				current.update();
				// State = Closed Incomplete
				gr.state = 4;
				// Stage set so 'Close Parent if Required' Business Rule will run to close the Request
				gr.stage = 'Request Cancelled';
				gr.update();
			}
		}
