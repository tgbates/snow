/**
 *
 * 
 * Problem - multiple places (mail templates, etc) have a bit of script to loop through array of all variables for an item
 * and output them to email, update description, etc
 *
 * Solution - create a script include for ease of maintenance and uniformity, call from multiple locations.
 *
 * script include
 * ReturnVariables (client callable)
 * 
 */

/*
 * @summary returns string of variables for requested item (leaves off false checkboxes, empty variables, labels)
 *
 * @author Thomas G Bates
 * @date Jan 2016
 *
 *
 *
 * Example of how to call it in a Notification Email Script:
 *
 * template.print("Summary of Requested items:\n"); 
 * gs.include('ReturnVariables');
 * var rv = new ReturnVariables();
 * var item = new GlideRecord('sc_req_item');
 * template.print('\n1 TGB curr.number ' + current.number);
 * var comm = rv.getDescription(current, null);
 * template.print('\n2 TGB - comm ' + comm);
 * template.print('\n' + comm);
 *
*/

var ReturnVariables = Class.create();
ReturnVariables.prototype = {
	initialize : function() {
		/* map: element vs internal field type */
		this.UI_PAGE = 15;
		this.MASKED = 25;
		this.DATE = 9;
		this.NUMERIC_SCALE = 4;
		this.CHECKBOX = 7;
		this.MULTIPLE_CHOICE = 3;
		this.DATE_TIME = 10;
		this.CONTAINER_START = 19;
		this.CONTAINER_END = 20;
		this.LABEL = 11;
		this.WIDE_SINGLE_LINE_TEXT = 16;
		this.YES_NO = 1;
		this.HTML = 23;
		this.SELECT_BOX = 5;
		this.MACRO = 14;
		this.REFERENCE = 8;
		this.LOOKUP_MULTIPLE_CHOICE = 22;
		this.LIST_COLLECTOR = 21;
		this.MULTI_LINE_TEXT = 2;
		this.SINGLE_LINE_TEXT = 6;
		this.MACRO_WITH_LABEL = 17;
		this.LOOKUP_SELECT_BOX = 18;
		this.SPLIT = 24;
		/* this is a list of elements that will be ignored */
		this.IGNORE = [this.UI_PAGE, this.CONTAINER_END, this.HTML, this.MACRO,
		this.MACRO_WITH_LABEL, this.SPLIT, this.LABEL];
	},
	
	/*
 	* ritm      GlideRecord object
 	* func      javascript function to customize conditions
 	*           to skip centain variables values
 	* noBlanks  true|false to avoid empty variable's value
 	*/
	getDescription: function(ritm, func, noBlanks) {
		var d = '';
		noBlanks = noBlanks || false;
		//var vars = this._getVariablesSorted(ritm);
		
		var keys = '\n';
		var set = new GlideappVariablePoolQuestionSet();
		set.setRequestID(ritm.sys_id);
		set.load();
		var vs = set.getFlatQuestions();
		for (var i=0; i < vs.size(); i++) {			
			if(vs.get(i).getLabel() != '') {
				/*
				var o = {
					'name': vs.get(i).getLabel(),
					'value': vs.get(i).getDisplayValue(),
					'order': vs.get(i).order,
					'type': vs.get(i).type
				};
				keys.push(o);
 				*/
				if (!(this._isIgnored(vs.get(i).getType())))
					if (vs.get(i).getDisplayValue() != '') {
						var type = vs.get(i).getType();
						if ((type == this.CHECKBOX) && ((vs.get(i).getDisplayValue() == 'false'))) 
							// checkbox == false
							continue;						
						else {
							// not a checkbox or checkbox == true
							var label = vs.get(i).getLabel();
							var val = vs.get(i).getDisplayValue();
							keys += label + ' ' + val + '\n';
						}
						
					//if (!(this._isIgnored(type) && (label) && (val)))
					
				}
				//keys.push(val);
				//keys.push('     ' +  vs.get(i).getLabel() + " = " + vs.get(i).getDisplayValue() + "\n");
			}
		}
		
		return keys;
	},
	
	_getVariablesSorted: function(ritm) {
		var vars = [];
		for(var variableName in ritm.variables) {
			/* GlideObject */
			var go = ritm.variables[variableName].getGlideObject();
			/* Question */
			var question = go.getQuestion();
			/* Label */
			var label = go.getQuestion().getLabel();
			/* Type (numeric value) */
			var type = new Number(go.getType());
			/* Order (numeric value) */
			var order = new Number(go.getQuestion().getOrder());
			/* creates an Object */
			var o = {
				'name': variableName,
				'label': label,
				'value': ritm.variables[variableName],
				'order': order,
				'type': type
			};
			vars.push(o);
		}
		/* return the variables in order as per the form */
		return this._quicksort(vars);
	},
	
	/* quick sort algorithm */
	_quicksort : function(arr) {
		if (arr.length === 0) {
			return [];
		}
		var left = [];
		var right = [];
		var pivot = arr[0];
		for (var i = 1; i < arr.length; i++) {
			/* compare order from object */
			if (arr[i].order < pivot.order) {
				left.push(arr[i]);
			} else {
				right.push(arr[i]);
			}
		}
		return this._quicksort(left).concat(pivot, this._quicksort(right));
	},
	
	/* check if the given field type should be ignored */
	_isIgnored : function(type) {
		for(i=0; i < this.IGNORE.length; i++)
			if( this.IGNORE[i] == type)
				return true;			
		return false;
	},
	
	type: 'ReturnVariables'
};
