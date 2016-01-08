/**
* Touch all records on table
* 
* @summary script to touch all records on a specific table - run as scheduled job
* 
* From https://community.servicenow.com/thread/163583
* 
*
* @author Geoff Cox - https://community.servicenow.com/people/geoffcox
* 2015-05-18
* update the fields in the function call below with the actual table and field names
*/


do_touch_all_records('<your_table_name>','<your sort field>','<your display field');  
  
function do_touch_all_records(table_name,sort_field,display_field) {  
    var start_time = gs.nowDateTime();  
    var end_time;  
    var job_name = 'Touch All Records (' + table_name + ')';  
    gs.log('========== Begin ' + job_name + ' ==========');  
    var gr = new GlideRecord(table_name);  
    gr.orderBy(sort_field);  
    gr.query();  
    var x = gr.getRowCount();  
    while (gr.next()) {  
        gr.autoSysFields(false);  
        gr.setForceUpdate(true);  
        gr.update();  
        gs.log(x +': Touching ' + table_name + '.' + gr[display_field]);  
        x--;  
    }  
    end_time = gs.nowDateTime();  
    gs.log('========== Finish ' + job_name + ' start: ' + start_time + ' end: ' + end_time + ' ==========');  
    //trigger_scheduled_job_finish(job_name,start_time,end_time);  
}  
