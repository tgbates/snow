function onLoad(){

   	/*
   	*	Determines if user can modify this request items variables.
   	*	Client side management of Access to catalog variables.
   	*
   	*	The following conditions are allowed:
   	*		- the record has not yet had approval requested (current.approval != 'not requested')
   	*		-
   	*		- the user is the submitter
   	*  allowed state values -->
   	*    open = 1
   	*    pending = -5
   	*/

   	//check approval status
   	var approval_status = g_form.getValue('approval');

    	if( approval_status == 'approved' ){
   		disableCatalogVariables();
   	}

   	//check request items state (closed records cannot be modified)
   	var disallowed_states = [3,4,7];
   	var item_state = g_form.getValue('state');


   	//if( item_state in disallowed_states ){
   	//	disableCatalogVariables();
   	//}

}

function disableCatalogVariables(){
	try{

		//Get the 'Variables' section
		var ve = $('variable_map').up('table');

		//Disable all elements within with a class of 'cat_item_option'
		ve.select('.cat_item_option', '.slushselectmtm', '.questionsetreference').each(function(elmt){
			elmt.disabled = true;
		});

		//Remove any reference or calendar icons
		ve.select('img[src*=reference_list.gifx]', 'img[src*=small_calendar.gifx]').each(function(img){
			img.hide();
		});

		//Hide list collector icons
		ve.select('img[src*=arrow]').each(function(img){
			img.up('table').hide();
		});
   }
   catch(e){}
}
