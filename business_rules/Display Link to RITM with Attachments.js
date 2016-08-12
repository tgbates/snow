// (TGB) Put Link to RITM on Task if Attach
// https://community.servicenow.com/message/930825#930825

// when to run: display

// Advanced

(function executeRule(current, previous /*null when async*/) {

	//Check for attachments and add link at top of form if there are any
	var attachment_link = '';
	var rec = new GlideRecord('sc_req_item');
	rec.addQuery('sys_id', current.request_item);
	rec.query();
	if(rec.next()){
		if(rec.hasAttachments()){
			attachment_link = gs.getProperty('glide.servlet.uri') + rec.getLink();
			gs.addErrorMessage('This task\'s Request Item has attachments. <a href="'+ attachment_link + '">CLICK HERE</a> to view the Requested Item record.');
		}
	}

})(current, previous);
