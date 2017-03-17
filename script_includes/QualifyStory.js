var BackfillAssignmentGroup = Class.create();
BackfillAssignmentGroup.prototype = {
	initialize: function() {
	},

	BackfillAssignmentGroup:function() {
		var gp = ' ';
		var a = current.assigned_to;

		//return everything if the assigned_to value is empty
		if(!a)
			return;
		//sys_user_grmember has the user to group relationship
		var grp = new GlideRecord('sys_user_grmember');
		grp.addQuery('user',a);
		grp.query();
		while(grp.next()) {
			if (gp.length > 0) {
				//build a comma separated string of groups if there is more than one
				gp += (',' + grp.group);
			}
			else {
				gp = grp.group;
			}
		}
		// return Groups where assigned to is in those groups we use IN for lists
		return 'sys_idIN' + gp;
	},
	type: 'BackfillAssignmentGroup'
}


var QualifyStory = Class.create();
QualifyStory.prototype = {
	initialize: function() {
	},

	QualifyStory:function(){
		var apps = ' ';
		var p = current.u_product;

		// return everything if product is empty
		if(!p)
			return;

		var st = new GlideRecord('rm_story');
		st.addQuery('u_application',p);
		st.query();
		while (st.next()) {
			if (apps.length > 0) {
				// build a comma separated string if products if multiple
				apps += (',' + apps.sys_id);
			}
			else {
				apps = st.sys_id;
			}
		}
		// return matching products
		return 'sys_idIN' + apps;
	},
	type: 'QualifyStory'
}

var QualifyStory = Class.create();
QualifyStory.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    type: 'QualifyStory'
});

javascript:new QualifyStory().QualifyStory()




sys_class_name=rm_defect^ORsys_class_name=rm_enhancement^ORsys_class_name=rm_story^EQ^
