	<g:evaluate var="jvar_caller" jelly="true">
		var inc = new GlideRecord("incident");		
		inc.addQuery('sys_id', '${jvar_task}');
		inc.query();
		if (inc.next()) {
			var caller = inc.caller_id.sys_id;
		}
		caller; // this is the variable put into the variable jvar_caller   
	</g:evaluate>
	
	


(function(_this) {


	function saveAssessment() {
		if (!instance_sysID) {
			gs.log('Error in submitting assessment instance');
			gs.sendRedirect('home.do');
		}

		var hq = {};
		if (typeof hiddenQuestions != 'undefined')
			hq = (new JSONParser()).parse(hiddenQuestions);
		hiddenQuestions = hq;

		var aq = "";
		if(typeof attachmentQuestions != 'undefined')
			aq = attachmentQuestions;
		attachmentQuestions = aq;

		var inst = new GlideRecord("asmt_assessment_instance");
		inst.get(instance_sysID);
		var status = inst.state;
		var questionCount = 0;
		var questionAnswer = 0;
		var questionMap = {};
		var questionDefinitionMap = {};
		var definitionValueMap = {};
		var retake = false;				
		inst.task_id = targetTask;		// reference the trigger task from the assessment 
		
		// if the task is an incident, make sure the user is tied to the assessment instance
		var task_type = inst.task_id.sys_class_name;
		if (task_type == 'incident') {  
			var guest_sid = gs.getProperty(slac.user.guest.sys_id); // slac.user.guest.sys_id
			if ((inst.assigned_to == '') || (inst.assigned_to == guest_sid)) {
				var inc = new GlideRecord('incident');
				inc.addQuery('sys_id', targetTask);
				inc.get(targetTask);
				inc.query();
				if (inc.next()) {
					var caller = inc.caller_id;
					inst.assigned_to = caller;
				}
			}
		}
		https://slacdev.service-now.com/assessment_take3.do?sysparm_assessable_type=502a2c44d7211100158ba6859e6103a3&sysparm_task=b2faeb88db99360051b276721f9619d6&sysparm_survey_update=false
		
		if ((status == 'complete') && (inst.metric_type.allow_retake) && (inst.due_date > new GlideDateTime())) {
			status = 'wip'; // Store new results when saving a completed instance and retake is allowed.
			retake = true;
		}
		if (status == 'wip' || status == 'ready') {
			for ( var params in _this) {
				if (params.startsWith('ASMTQUESTION:')) {
					var value = _this[params];
					var questionId = params.substring('ASMTQUESTION:'.length, params.length);
					var result = saveResponse(questionId, value, selection_result);
					if (result > 0)
						++questionAnswer;
				}
				if (params.startsWith('sys_original.ASMTQUESTION:')) {
					var qId = params.substring('sys_original.ASMTQUESTION:'.length, params.length);
					if (qId in hiddenQuestions) {
						if(attachmentQuestions.indexOf(qId) >=0){
							var attachment = _this[params].split(",");
							for(var i=0;i<attachment.length;i++){
								var sa = new GlideSysAttachment();
								sa.deleteAttachment(attachment[i]);
							}
						}
					}
					else
						++questionCount;
				}
				if(params.startsWith('ASMTDEFINITION:')){
					var definitionId = params.substring('ASMTDEFINITION:'.length, 'ASMTDEFINITION:'.length + 32);
					var questionId = params.split('_')[1];
					var selected = (GlideStringUtil.nil(_this[params]) || _this[params] == "false") ?  false : true;

					if(questionId in questionMap){
						if(!questionMap[questionId] && selected)
							questionMap[questionId] = true;
					}
					else
						questionMap[questionId] = selected;

					if(selected){
						if(questionId in questionDefinitionMap)
							questionDefinitionMap[questionId] += ","+definitionId;
						else
							questionDefinitionMap[questionId] = definitionId;
					}

				}else if(params.startsWith('ASMTDEFINITIONRANK:')){
					var definitionId = params.substring('ASMTDEFINITIONRANK:'.length, 'ASMTDEFINITIONRANK:'.length + 32);
					var questionId = params.split('_')[1];
					var value = _this[params];
					questionMap[questionId] = "RANKING";

					if(questionId in questionDefinitionMap)
						questionDefinitionMap[questionId] += ","+definitionId;
					else
						questionDefinitionMap[questionId] = definitionId;

					definitionValueMap[definitionId] = value;
				}
			}

			for(var key in questionMap){
				var isHidden = (key in hiddenQuestions) ? true : false;
				var qst = new GlideRecord("asmt_assessment_instance_question");
				qst.get(key);
				var source_table = qst.source_table;
				var source_id = qst.source_id;
				var metric = qst.metric;
				var category = qst.category;
				var instance = qst.instance;

				//delete
				var gr = new GlideRecord("asmt_assessment_instance_question");
				gr.addQuery('instance',instance);
				gr.addQuery('metric',metric);
				gr.addQuery('source_id',source_id);
				gr.addQuery('category',category);
				gr.deleteMultiple();


				if(questionMap[key] && !isHidden){
					++questionAnswer;

					//insert for all values
					var arr = questionDefinitionMap[key].split(",");
					for(var i=0;i<arr.length;i++){
						var definitionId = arr[i];
						var metricDef = new GlideRecord('asmt_metric_definition');
						metricDef.addQuery('sys_id',definitionId);
						metricDef.query();
						if(metricDef.next()){
							var qstRecord = new GlideRecord("asmt_assessment_instance_question");
							qstRecord.initialize();
							qstRecord.source_table = source_table;
							qstRecord.source_id = source_id;
							qstRecord.metric = metric;
							qstRecord.category = category;
							qstRecord.instance = instance;
							qstRecord.metric_definition = definitionId;
							if(!GlideStringUtil.nil(questionMap[key]) && questionMap[key] == "RANKING"){
								qstRecord.value = definitionValueMap[definitionId];
							}
							else
								qstRecord.value = metricDef.getValue("value").toString();
							qstRecord.insert();
						}
					}
				}
				else{
					//insert
					var qstRecord = new GlideRecord("asmt_assessment_instance_question");
					qstRecord.initialize();
					qstRecord.source_table = source_table;
					qstRecord.source_id = source_id;
					qstRecord.metric = metric;
					qstRecord.category = category;
					qstRecord.instance = instance;
					qstRecord.insert();
				}
				if(!isHidden)
					++questionCount;
			}

			inst.signature_result = (_this['signature_result']).trim();
			if(selection_result=='submit')
				inst.taken_on = new GlideDateTime();
			saveStatus(inst, questionCount, questionAnswer, retake);
		}
	}

	function saveResponse(questionId, value, selection_result) {
		var qst = new GlideRecord("asmt_assessment_instance_question");
		qst.get(questionId);
		var returnValue = 0;
		if (qst.isValid()) {
			qst.is_hidden = false;
			if (questionId in hiddenQuestions) {
				qst.value = '';
				qst.string_value = '';
				qst.is_hidden = true;
			} else if ('string,datetime'.indexOf(qst.metric.datatype) >= 0) {
				qst.value = 0;
				qst.string_value = value;
				if (value)
					returnValue = 1;
				else
					returnValue = -1;
			} else if ('checkbox'.indexOf(qst.metric.datatype) >= 0) {
				returnValue = 1;
				if (value == 'true' || value == 'on') {
					qst.value = 1;
					qst.string_value = 'true';
				} else {
					qst.value = 0;
					qst.string_value = 'false';
				}
			} else if ('reference'.indexOf(qst.metric.datatype)>=0){
				qst.reference_id = value;
				if (value)
					returnValue = 1;
				else
					returnValue = -1;
			}else {
				qst.value = value;
				if (value)
					returnValue = 1;
				else
					returnValue = -1;
			}
			qst.update();
		}
		return returnValue;
	}

	function saveStatus(inst, questionCount, questionAnswer, retake) {
		inst.percent_answered = ((questionAnswer * 100) / questionCount);
		if (selection_result == 'submit') {
			if (retake) {
				inst.state = "wip";
				inst.update();
			}
			inst.state = "complete";
			inst.update();
		} else if (selection_result == 'save') {
			if (inst.state != "complete")
				inst.state = "wip";
			inst.update();
		}
	}

	if (selection_result != 'cancel' && selection_result != 'close')
		saveAssessment();

	if (selection_result == 'close')
		(new SNC.AssessmentCreation()).removePreview(instance_sysID);

	if (selection_result == 'submit') {
		var type = new GlideRecord("asmt_metric_type");
		type.get(type_sysID);
		var url = type.url;
		if (!type.url)
			url = 'assessment_thanks.do?sysparm_assessable_type=' + type_sysID.toString() + '&sysparm_assessment_type=' + type.evaluation_method.getChoiceValue().toLowerCase();
		response.sendRedirect(url);
	} else {
		var type = new GlideRecord("asmt_metric_type");
		type.get(type_sysID);
		var inst = new GlideRecord("asmt_assessment_instance");
		inst.get(instance_sysID);
		var url = 'assessment_take3.do?sysparm_assessable_type=' + type_sysID.toString() + '&sysparm_assessable_sysid=' + selection_result;
		if(inst)
			url += '&sysparm_inst_due_date=' + inst.getValue('due_date');
		response.sendRedirect(url);
	}
})(this);
