// for existing in progress records
new GlideDateTime().getLocalDate();
current.resolved_date = GlideDateTime().getDisplayValue(); //populate resolved date

var log = 'Resolved on ' + current.resolved_date;

// if the 'Send to e-log' checkbox is checked, use the SOAP to publish
if (current.send_to_e_log) {
	gs.addInfoMessage(gs.getMessage("Sending {0} to e-log", current.number));
	var locationID = current.location_area.u_id;
	//var myVariable = g_user.userName;
	//var userID = g_user.userID;
	var userID = '312150';
	log = 'Location: ' + locationID + ' ' + log + ' by ' + userID;
	gs.addInfoMessage(gs.getMessage("Location ID {0} and userID {1}", [locationID, userID]));
	var desc = current.number + ' : ' + current.resolved_date;
	var task_type = current.task_type.getDisplayValue();
	log = log + ' ' + desc + ' ' + task_type;
	gs.addInfoMessage(gs.getMessage("Description {0} and type {1}", [desc, task_type]));
				
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
					gs.info(s.envelope);
					var responseBody = response.getBody();
					var status = response.getStatusCode();
					log = log + ' status: ' + status + ' response: ' + responseBody;					
					gs.addInfoMessage(gs.getMessage("Status is {0}", status));			
					gs.info(status);
				}
				catch(ex) {
					var message = ex.getMessage();
					log = log + ' message: ' + message;
					gs.addInfoMessage(gs.getMessage("Message is {0}", message));		
					gs.error('message is ' + message);
					
				}
			}
			
			
			current.state = 7; //state change to resolved
			current.work_notes = log;
			current.update();
			action.setRedirectURL('/'+current.getTableName()+'_list.do');
			
