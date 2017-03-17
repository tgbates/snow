copySpecificAttachment(donorTable, donorID, recipientTable, recipientID, fileName);

function copySpecificAttachment(donorTable, donorID, recipientTable, recipientID, fileName) {
    var donorAttSysID;
    var newAttRecord;
    var linkToNewRecord;
    var attDataRecord;
    var newDocRecord;
    var attRecord = new GlideRecord('sys_attachment');
    attRecord.addQuery('table_name', donorTable);
    attRecord.addQuery('table_sys_id', donorID);
    attRecord.addQuery('file_name', fileName);
    attRecord.query();
    while (attRecord.next()) {
        donorAttSysID = attRecord.getValue('sys_id');
        newAttRecord = copyRecord(attRecord);
        newAttRecord.setValue('table_name', recipientTable);
        newAttRecord.setValue('table_sys_id', recipientID);
        newAttRecord.update();
        linkToNewRecord = gs.getProperty('glide.servlet.uri') + newAttRecord.getLink();
        attDataRecord = new GlideRecord('sys_attachment_doc');
        attDataRecord.addQuery('sys_attachment', donorAttSysID);
        attDataRecord.query();
        while (attDataRecord.next()) {
            newDocRecord = copyRecord(attDataRecord);
            newDocRecord.setValue('sys_attachment', newAttRecord.getValue('sys_id'));
            newDocRecord.update();
        }
    }
    //gs.print(linkToNewRecord);
}
function copyRecord(record) {
    var recordElement;
    var recordElementName;
    var recordTable = record.getTableName();
    var recordFields = record.getFields();
    var newRecord = new GlideRecord(recordTable);
    newRecord.initialize();
    for (var i = 0; i < recordFields.size(); i++) {
        recordElement = recordFields.get(i);
        if(recordElement.getName() != 'sys_id' && recordElement.getName() != 'number')
        {
            recordElementName = recordElement.getName();
            newRecord.setValue(recordElementName, record.getValue(recordElementName));
        }
    }
    var newSysId = newRecord.insert();
    return newRecord;
}
