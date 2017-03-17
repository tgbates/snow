//
/*
 * Default behavior - closes task
 * New behavior added 10/28/2016 (original ui action preserved and deactivated)
 * If the workflow activity for this task is an implement task then timestamp the work end field for the change request with the current time, then close the task
 * look at incident for model used
 */

if (current.wf_activity.name == 'Implement') {
	gs.log('CT ' + current.number + ' implementation task ');
	// Implementation step in workflow requires work end timestamp
	var cr = new GlideRecord("change_request");
	cr.addQuery("sys_id", "=", current.change_request);
	cr.query();
	// find change request that is parent of the implementation task
	if (cr.next()) {
		// set the change request work end timestamp to current datetime
		var wrk_end = gs.nowDateTime();
		cr.work_end.setValue(wrk_end);
		cr.update();
		gs.log("CR " + cr.number + ' work end ' + wrk_end + ' set based on ' + current.number);
	}
}
else {
	gs.log('CT ' + current.number + ' not implementation task');
}

current.state = 3;
current.update();


// var DateTimeUtils = Class.create();
// DateTimeUtils.prototype = Object.extendsObject(AbstractAjaxProcessor, {
   // nowDateTime: function () {
  //      return gs.nowDateTime();
  // }

	var ajax = new GlideAjax('MyDateTimeAjax');
ajax.addParam('sysparm_name', 'nowDateTime');
ajax.getXML(function () {
	g_form.setValue('put your field name here', ajax.getAnswer());
});


var cr = new GlideRecord("change_request");
cr.addQuery("sys_id", "=", current.change_request);
//cr.addQuery("incident_state", "=", 3);
cr.query();
if (cr.next()) {
	gs.log('CR ' + cr.number + ' is parent request ');
	var ajax = new GlideAjax('DateTimeUtils');
	ajax.addParam('sysparm_name', 'nowDateTime');
	ajax.getXML(function () {
		var wrk_end = ajax.getAnswer();
	});
		//var wrk_end = gs.nowDateTime();
		cr.work_end.setValue( wrk_end);
    //incident.active.setValue(false);
    cr.update();
    gs.log("CR " + cr.number + ' work end ' + ' wrk_end ' + ' set based on ' + current.number);

}
current.state = 3;
current.update();

var ajax = new GlideAjax('DateTimeFix');
ajax.addParam('sysparm_name','dateTimeFix');
ajax.getXMLWait();
var newTime = ajax.getAnswer();
values["opened_at"] = newTime;

Create a script include called DateTimeFix, client callable, with the following script:

var DateTimeFix = Class.create();

DateTimeFix.prototype = Object.extendsObject(AbstractAjaxProcessor, {

dateTimeFix: function() {
return gs.hoursAgo(14);
}
});



var cr = new GlideRecord("change_request");
cr.addQuery("sys_id", "=", current.change_request);

cr.query();
if (cr.next()) {
	gs.log('CR ' + cr.number + ' is parent request ');
	var gdt = new GlideDateTime();
	gdt.setDisplayValue(gs.nowDateTime);

	cr.work_end.setValue(gdt);
		  cr.update();
    gs.log("CR " + cr.number + ' work end ' + gdt + ' set based on ' + current.number);

}
current.state = 3;
current.update();



/*
 * Default behavior - closes task
 * New behavior added 10/28/2016 (original ui action preserved and deactivated)
 * If the workflow activity for this task is an implement task then timestamp the work end field for the change request with the current time, then close the task
 * look at incident for model used
 */

if (current.wf_activity.name == 'Implement') {
	// Implementation step in workflow requires work end timestamp
	var cr = new GlideRecord("change_request");
	cr.addQuery("sys_id", "=", current.change_request);
	cr.query();
	// find change request that is parent of the implementation task
	if (cr.next()) {
		// set the change request work end timestamp to current datetime (and proper timezone)
		var gdt = new GlideDateTime();
		gdt.setDisplayValue(gs.nowDateTime);
		cr.work_end.setValue(gdt);
		cr.update();
	}
}
