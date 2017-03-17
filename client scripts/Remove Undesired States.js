// need to add if assignment group = appdev or case assignment group
var st = g_form.getValue('state');
g_form.addInfoMessage('state = ' + st);

switch (st) {
  case '-5': // Draft
      g_form.addDecoration('state','icon-lightbulb', 'color-green');
      g_form.removeOption('state','3');
      g_form.removeOption('state','-6');
      g_form.removeOption('state','-7');
      g_form.removeOption('state','-3');
      g_form.removeOption('state','8');
      g_form.removeOption('state','10');
      g_form.removeOption('state','12');
      g_form.removeOption('state','13');
      g_form.removeOption('state','14');
      g_form.removeOption('state','15');
      break;
  case '-4': // Scoping
      g_form.addDecoration('state','icon-lightbulb', 'color-green');
      g_form.removeOption('state','-5');
      break;

}
