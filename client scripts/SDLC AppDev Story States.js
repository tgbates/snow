function onLoad() {

	// If the assignment group's Jira-style SDLC workflow is checked then modify state choices accordingly.
	// @author: Thomas G Bates
	// @date: 2016/09/22
  // Table: rm_story
  // Type: onLoad
  

	g_form.clearMessages();

	var group = g_form.getReference('assignment_group', stateOptions); // get the value of group


	function stateOptions(group) {
	  if (group.u_jira_style_sdlc_workflow == 'true') {
		  // change the choices


		  // *** debugging ***
		//  g_form.clearMessages();
	//g_form.addInfoMessage('inside if: assignment group = ' + group.name + ' and jssw = ' + group.u_jira_style_sdlc_workflow + ' ' + st);


		var st = g_form.getValue('state');
		g_form.clearOptions('state');  // clear the state choice list so we can add the proper options

	// Each case represents the existing state on page load
	// Add the state options available for that state (including the current state)
	switch (st) {

		case '-12':    // Ready for Deployment
			g_form.addOption('state', '-12', 'Ready for Deployment', 0);
			g_form.addOption('state', '-3', 'Awaiting Approval', 1);
			g_form.addOption('state', '-10', 'Approved for Deployment', 2);
			g_form.addOption('state','-9', 'Reopened', 3);
			break;

		case '-10':    // Approved for Deployment
			g_form.addOption('state', '-10', 'Approved for Deployment', 0);
			g_form.addOption('state', '3', 'Closed Complete', 1);
			break;

		case '-9':    // Reopened
			g_form.addOption('state', '-9', 'Reopened', 0);
			g_form.addOption('state', '2', 'Work in Progress', 1);
			break;

		case '-8':    // Testing/QA
			g_form.addOption('state', '-8', 'Testing/QA', 0);
			g_form.addOption('state', '10', 'Ready for Deployment', 1);
			g_form.addOption('state','-9', 'Reopened', 2);
			break;

		case '-7':    // Ready for testing
			g_form.addOption('state', '-7', 'Ready for testing', 0);
			g_form.addOption('state', '3', 'Closed Complete', 1);
			g_form.addOption('state', '-9', 'Reopened', 2);
			break;

		case '-6':    // Draft
			g_form.addOption('state', '-6', 'Draft', 0);
			g_form.addOption('state', '2', 'Work in Progress', 1);
			break;

		case '-4': // Scoping
			g_form.addOption('state', '-6', 'Draft', 0);
			g_form.addOption('state', '2', 'Work in Progress', 1);
			break;

		case '-3':    // Awaiting Approval
			g_form.addOption('state','-3', 'Awaiting Approval', 0);
			g_form.addOption('state','-9', 'Reopened', 1);
			g_form.addOption('state', '-10', 'Approved for Deployment', 2);
			break;

		case '1':    // Ready
			g_form.addOption('state', '1', 'Ready', 0);
			g_form.addOption('state', '-6', 'Draft', 1);
			g_form.addOption('state', '2', 'Work in Progress', 2);
			break;

		case '2':    // Work in Progress
			g_form.addOption('state','2', 'Work in Progress', 0);
			g_form.addOption('state', '17', 'Closed - Will Not Do', 1);
			g_form.addOption('state', '20', 'Closed - Can Not Reproduce', 2);
			g_form.addOption('state', '18', 'Closed - Duplicate', 3);
			g_form.addOption('state', '19', 'Resolved - Fixed', 4);
			break;

		case '3':    // Closed Complete
			g_form.addOption('state','3', 'Closed Complete', 0);
			g_form.addOption('state','-9', 'Reopened', 1);
			break;

		case '4':    // Cancelled
			g_form.addOption('state','4', 'Cancelled', 0);
			g_form.addOption('state','-9', 'Reopened', 1);
			break;

		case '11':    // On Hold
			g_form.addOption('state', '11', 'On Hold', 0);
			g_form.addOption('state', '2', 'Work in Progress', 1);
			break;

		case '17':    // Closed - Will Not Fix
			g_form.addOption('state', '17', 'Closed - Will Not Fix', 0);
			g_form.addOption('state','-9', 'Reopened', 1);
			break;

		case '18':    // Closed - Duplicate
			g_form.addOption('state', '18', 'Closed - Duplicate', 0);
			g_form.addOption('state','-9', 'Reopened', 1);
			break;

		case '19':    // Resolved - Fixed
			g_form.addOption('state', '19', 'Resolved - Fixed', 0);
			g_form.addOption('state', '-8', 'Testing/QA', 1);
			g_form.addOption('state', '-12', 'Ready for Deployment', 2);
			g_form.addOption('state','-9', 'Reopened', 3);
			break;

		case '20':    // Closed - Can Not Reproduce
			g_form.addOption('state', '20', 'Closed - Can Not Reproduce', 0);
			//g_form.addOption('state', '10', 'Ready for Deployment', 1);
			g_form.addOption('state','-9', 'Reopened', 1);
			break;

		case undefined:    // allow a way out for something unexpected
            g_form.addOption('state','2', 'Work in Progress', 0);
			break;

        default:
			g_form.addOption('state','2', 'Work in Progress', 0);

	}  //  end switch (st)
  }  //  end if (group.u_jira_style_sdlc_workflow)
		else { // group does not use jira-style sdlc workflow

			//g_form.addInfoMessage('assignment group = ' + group.name);
			//var st1 = g_form.getValue('state');
			g_form.addInfoMessage('inside else: assignment group = ' + group.name + ' and jssw = ' + group.u_jira_style_sdlc_workflow + ' ' + st1);
			//g_form.setValue('state','3','Complete');
			//g_form.clearOptions('state');  // clear the state choice list so we can add the proper options
// 			g_form.addOption('state', '-6', 'Draft', 0);
// 			g_form.addOption('state', '-4', 'Scoping', 1);
// 			g_form.addOption('state', '-3', 'Awaiting Approval', 2);
// 			g_form.addOption('state', '2', 'Work in Progress', 3);
// 			g_form.addOption('state', '-8', 'Testing/QA', 4);
// 			g_form.addOption('state', '-12', 'Ready for Deployment', 5);
// 			g_form.addOption('state', '11', 'On Hold', 6);
// 			g_form.addOption('state', '3', 'Closed Complete', 7);
// 			g_form.addOption('state', '4', 'Cancelled', 8);
		}
	}  // end function stateOptions(group)
}
