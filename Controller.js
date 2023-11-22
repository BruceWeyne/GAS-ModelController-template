function doGet(e) {
  const conditions = [
    {key: 'Name', value: 'John'},
    {key: 'age', value: 25} 
  ];
  const data = modelGetData('SheetName', conditions, 1, 10);

  // データ返却
  const jsonString = JSON.stringify(data);
  return ContentService.createTextOutput(jsonString).setMimeType(ContentService.MimeType.JSON);
}