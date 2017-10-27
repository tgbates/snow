(function executeRule(current, previous /*null when async*/) {

var job_name = 'Send Resolved RP Dispatch to ESH E-Log';
var log = 'Resolved on ' + current.resolved_date;

// if the 'Send to e-log' checkbox is checked, use the SOAP to publish
if ((current.state = 7)  && (current.send_to_e_log)) {
	//gs.addInfoMessage(gs.getMessage("Sending {0} to e-log", current.number));
	var locationID = current.location_area.u_id;
	//var myVariable = g_user.userName;
	//var userID = g_user.userID;
	var user = current.sys_updated_by;
	var userID = '';
	var su = new GlideRecord('sys_user');
	su.addActiveQuery();
	su.addQuery('user_name', user);
	su.query();
	if (su.next()) {
		userID = su.employee_number;
	}
	else {
		gs.error(job_name + ': User ' + user + ' not found');
		log = 'Error: User ' + user + ' not found! ' + log; 
		userID = '312150';
	}
	log = 'Location: ' + locationID + ' ' + log + ' by ' + userID;
	//gs.addInfoMessage(gs.getMessage("Location ID {0} and userID {1}", [locationID, userID]));
	var desc = current.number + ' : ' + current.resolved_date;
	var task_type = current.task_type.getDisplayValue();
	log = log + ' ' + desc + ' ' + task_type;
	//gs.addInfoMessage(gs.getMessage("Description {0} and type {1}", [desc, task_type]));
				
			try {
				var s = new sn_ws.SOAPMessageV2('x_ssla2_rp_dispatc.RP Dispatch Web Service - SOAP 1.1', 'post');
					
				//override authentication profile
				//authentication type ='basic'
				//r.setAuthentication(authentication type,profile name);
					
				s.setStringParameterNoEscape('description', desc);
				s.setStringParameterNoEscape('task', task_type);
				s.setStringParameterNoEscape('userID', userID);
				s.setStringParameterNoEscape('locationID', locationID);
				var response = s.execute();
				var responseBody = response.getBody();
				gs.info(job_name + ': responseBody: ' + responseBody);					
				var status = response.getStatusCode();
				log = log + ' status: ' + status + '; response: ' + responseBody;					
				//gs.addInfoMessage(gs.getMessage("Status is {0}", status));			
				gs.info(job_name + ': Status: ' + status);
				if (responseBody.indexOf('Success - ElogID: ') >= 0) {
				    var ElogID = responseBody.replace('Success - ElogID: ','');
				    current.correlation_id = ElogID.trim();
				}
				catch(ex) {
					var message = ex.getMessage();
					log = log + ' message: ' + message;
					//gs.addInfoMessage(gs.getMessage("Message is {0}", message));		
					gs.error(job_name + ' : message : ' + message);
					
				}
			}
			
			
			current.work_notes = log;
			current.update();		


})(current, previous);
