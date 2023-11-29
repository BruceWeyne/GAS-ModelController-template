class Model extends Database {

  constructor(spreadsheetId) {
    super();
    const conf = config(); // config の読み込み
    this.spreadsheetId = !spreadsheetId ? conf.spreadsheetId : spreadsheetId; // スプレッドシートIDの指定がなければデフォルトを設定
  }

  /**
   * データ取得（AND）
   */
  getData(sheetName, conditions, offsetRow, limitRow) {
    const dataList = super.databaseGet(this.spreadsheetId, sheetName, conditions, offsetRow, limitRow); // データの取得
    return dataList;
  }

  /**
   * データ取得（OR）
   */
  orGetData(sheetName, conditions, offsetRow, limitRow) {
    const dataList = super.databaseOrGet(this.spreadsheetId, sheetName, conditions, offsetRow, limitRow); // データの取得
    return dataList;
  }

  /**
   * データ挿入
   */
  insertData(sheetName, keyValuePairs) {
    const result = super.databaseInsert(this.spreadsheetId, sheetName, keyValuePairs); // データの挿入
    return result;
  }

  /**
   * データ更新（AND）
   */
  updateData(sheetName, keyValuePairs, conditions) {
    const result = super.databaseUpdate(this.spreadsheetId, sheetName, keyValuePairs, conditions); // データの更新
    return result;
  }

  /**
   * データ更新（OR）
   */
  orUpdateData(sheetName, keyValuePairs, conditions) {
    const result = super.databaseOrUpdate(this.spreadsheetId, sheetName, keyValuePairs, conditions); // データの更新
    return result;
  }

  /**
   * データの削除（AND）
   */
  deleteData(sheetName, conditions) {
    const result = super.databaseDelete(this.spreadsheetId, sheetName, conditions); // データの削除
    return result;
  }

  /**
   * データの削除（OR）
   */
  orDeleteData(sheetName, conditions) {
    const result = super.databaseOrDelete(this.spreadsheetId, sheetName, conditions); // データの削除
    return result;
  }

  /**
   * データの全削除（ヘッダーは除く）
   */
  truncateData(sheetName) {
    const result = super.databaseTruncate(this.spreadsheetId, sheetName); // データの全削除
    return result;
  }

} // End of the class