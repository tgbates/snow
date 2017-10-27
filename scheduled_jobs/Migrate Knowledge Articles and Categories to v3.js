/**
 * Migrate knowledge articles & categories from v2 knowledge base to v3
 *
 * @summary script to migrate articles with v2 parent kb and categories with v2 parent_id to v3 kb
 *
 * 1. find all active kb_category with v2 kb parent_id
 * 2. set them to v3 kb 
 * 3. find all active knowledge articles that are not retired, still valid, in v2 kb
 * 4. set them to v3 kb 
 *
 * @author Thomas G Bates
 * 2017-03-20
 */

gs.info('Starting category job');
do_migrate_v2_knowledge_categories();
gs.info('Starting article job');
do_migrate_v2_knowledge_articles();

function do_migrate_v2_knowledge_categories() {	
	var start_time = new GlideDateTime();
	
	var job_name = '(SLAC) Migrate Knowledge Categories';
	gs.info('========== Begin ' + job_name + ' ==========');
	var count = 0;
	
	// find active kb_category with kb v2 parent_id and set new parent to kb v3
	var cat = new GlideRecord('kb_category');
	cat.addActiveQuery();
	cat.addQuery('parent_id', 'dfc19531bf2021003f07e2c1ac0739ab');
	cat.query();
	
	while (cat.next() && (count < 18)) {		
		count++;
		cat.setWorklow(false);
		cat.parent_id = 'a25275dd6f4022005e9289212e3ee4ea';  // new sys_id for kb v3
		cat.update();	
		gs.info('Category: ' + cat.getDisplayValue() + ' moved to ' + cat.parent_id.getDisplayValue());		
	}
	
	var end_time = new GlideDateTime();
	gs.info('========== Finish ' + job_name + ' start: ' + start_time + ' end: ' + end_time + ' and migrated ' + count + ' cats. ==========');
}

function do_migrate_v2_knowledge_articles() {	
	var start_time = new GlideDateTime();
	
	var job_name = '(SLAC) Migrate Knowledge Articles';
	gs.info('========== Begin ' + job_name + ' ==========');
	var count = 0;
	
	// find non-retired knowledge articles with valid date, and v2 kb and move them
	var kba = new GlideRecord('kb_knowledge');
	kba.addActiveQuery();
	kba.addQuery('workflow_state', '!=', 'retired');
	kba.addQuery('valid_to', '>=', start_time);
	kba.addQuery('kb_knowledge_base', 'dfc19531bf2021003f07e2c1ac0739ab');
	kba.query();
	
	while (kba.next() && (count < 400)) {		
		count++;
		kba.setWorkflow(false);
		kba.kb_knowledge_base = 'a25275dd6f4022005e9289212e3ee4ea'; // new sys_id
		kba.update();	
		gs.info('Knowledge Article: ' + kba.getDisplayValue() + ' : ' + kba.kb_category.getDisplayValue() + ' : ' + kba.kb_knowledge_base.getDisplayValue());		
	}
	var end_time = new GlideDateTime();
	gs.info('========== Finish ' + job_name + ' start: ' + start_time + ' end: ' + end_time + ' and migrated ' + count + ' articles. ==========');
}



