class Database {

  constructor() {
    this.sheetNameError = 'Sheet name not found';
    this.operators = {
      graterThan: ' >',
      graterThanEqual: ' >=',
      lessThan: ' <',
      lessThanEqual: ' <=',
      notEqual: ' !=',
      notEqualStrict: ' !==',
      equal: ' =='
    };
  }

  /**
   * スプレッドシートからのデータ取得（AND）
   * @param {String} spreadsheetId
   * @param {String} sheetName
   * @param {Object List} conditions
   * @param {Integer} offsetRow
   * @param {Integer} limitRow
   * @return {Object List} data
   * [Ref.]
   * const conditions = [
   *        { key: 'Name', value: 'John' }, // 名前が 'John' の行を取得
   *        { key: 'Age', value: 25 }, // 年齢が 25 の行を取得
   *        // 他の条件を追加
   * ];
   * 
   */
  databaseGet(spreadsheetId, sheetName, conditions, offsetRow, limitRow) {
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId); // スプレッドシートを開く
      const sheet = spreadsheet.getSheetByName(sheetName); // 指定したシートを取得
      if (!sheet) throw new Error(this.sheetNameError); // シートを開けなかった場合
      const dataRange = sheet.getDataRange(); // データの範囲を取得
      const values = dataRange.getValues(); // データを2D配列として取得
      const headers = values[0].filter(Boolean); // ヘッダー行を取得（連想配列のキーとして使用）

      // 返却データの初期化
      let data = [];

      // データを条件でフィルタリング
      let filteredValues = [];
      if (conditions && conditions.length > 0) {
        // 値のフィルタリング
        filteredValues = this.filterValuesWithAnd(values, conditions);
        // ヘッダー行を追加
        filteredValues.unshift(headers);
      } else { // 条件の指定がなければそのまま
        filteredValues = values;
      }

      // オフセットと最大取得数の検証
      offsetRow = !offsetRow || offsetRow < 1 ? offsetRow = 1 : offsetRow; // オフセットが未設定または１以下の場合は１に置き換え（カラムは取得しない）
      limitRow = !limitRow || offsetRow + limitRow >= filteredValues.length ? limitRow = filteredValues.length : offsetRow + limitRow; // 取得個数が未設定またはデータ数以上の場合はデータ数に置き換え

      // オフセットがデータ数以上の場合は空で返却
      if (offsetRow >= filteredValues.length) return data;

      // データの連想配列化
      for (let i = offsetRow; i < limitRow; i++) {
        let row = filteredValues[i];
        let rowData = {};
        for (let j = 0; j < headers.length; j++) {
          rowData[headers[j]] = row[j];
        }
        data.push(rowData);
      }
      return data; 

    } catch (error) {
      return error;
    }
  }

  /**
   * スプレッドシートからのデータ取得（OR）
   * @param {String} spreadsheetId
   * @param {String} sheetName
   * @param {Object List} conditions
   * @param {Integer} offsetRow
   * @param {Integer} limitRow
   * @return {Object List} data
   * [Ref.]
   * const conditions = [
   *        { key: 'Name', value: 'John' }, // 名前が 'John' の行を取得
   *        { key: 'Age', value: 25 }, // 年齢が 25 の行を取得
   *        // 他の条件を追加
   * ];
   * 
   */
  databaseOrGet(spreadsheetId, sheetName, conditions, offsetRow, limitRow) {
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId); // スプレッドシートを開く
      const sheet = spreadsheet.getSheetByName(sheetName); // 指定したシートを取得
      if (!sheet) throw new Error(this.sheetNameError); // シートを開けなかった場合
      const dataRange = sheet.getDataRange(); // データの範囲を取得
      const values = dataRange.getValues(); // データを2D配列として取得
      const headers = values[0].filter(Boolean); // ヘッダー行を取得（連想配列のキーとして使用）

      // 返却データの初期化
      let data = [];

      // データを条件でフィルタリング
      let filteredValues = [];
      if (conditions && conditions.length > 0) {
        // 値のフィルタリング
        filteredValues = this.filterValuesWithOr(values, conditions);
        // ヘッダー行を追加
        filteredValues.unshift(headers);
      } else { // 条件の指定がなければそのまま
        filteredValues = values;
      }

      // オフセットと最大取得数の検証
      offsetRow = !offsetRow || offsetRow < 1 ? offsetRow = 1 : offsetRow; // オフセットが未設定または１以下の場合は１に置き換え（カラムは取得しない）
      limitRow = !limitRow || offsetRow + limitRow >= filteredValues.length ? limitRow = filteredValues.length : offsetRow + limitRow; // 取得個数が未設定またはデータ数以上の場合はデータ数に置き換え

      // オフセットがデータ数以上の場合は空で返却
      if (offsetRow >= filteredValues.length) return data;

      // データの連想配列化
      for (let i = offsetRow; i < limitRow; i++) {
        let row = filteredValues[i];
        let rowData = {};
        for (let j = 0; j < headers.length; j++) {
          rowData[headers[j]] = row[j];
        }
        data.push(rowData);
      }
      return data;

    } catch (error) {
      return error;
    }
  }


  /**
   * スプレッドシートにデータを新規追加
   * @param {String} spreadsheetId
   * @param {String} sheetName
   * @param {Object List} keyValuePairs
   * @return {Object} 
   * [Ref.]
   * const keyValuePairs = [
   *        { 'Name': 'John', 'Age': '25 },
   *        { 'Name': 'Mike', 'Age': '31 },
   *        // 他のデータを追加
   * ];
   */
  databaseInsert(spreadsheetId, sheetName, keyValuePairs) {
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId); // スプレッドシートを開く
      const sheet = spreadsheet.getSheetByName(sheetName); // 指定したシートを取得
      if (!sheet) throw new Error(this.sheetNameError); // シートを開けなかった場合
      const dataRange = sheet.getDataRange(); // データの範囲を取得
      const values = dataRange.getValues(); // データを2D配列として取得
      const headers = values[0].filter(Boolean); // ヘッダー行を取得（連想配列のキーとして使用）
      // データをスプレッドシートへ挿入
      for (let i = 0; i < keyValuePairs.length; i++) {
        // データのマッピング
        let newRow = headers.map(function(header) {
          return keyValuePairs[i].hasOwnProperty(header) ? keyValuePairs[i][header] : null;
        });
        // データの挿入
        sheet.appendRow(newRow);
      }
      return {'success': true, 'error': ''};

    } catch (error) {
      return {'success': false, 'error': error};
    }
  }

  /**
   * スプレッドシートのデータを更新（AND）
   * @param {String} spreadsheetId
   * @param {String} sheetName
   * @param {Object} keyValuePair
   * @param {Object List} filterConditions
   * @return {Object} 
   * [Ref.]
   * const keyValuePair = { 'Name': 'Mike', 'Age': 31 };
   * const filterConditions = [
   *        { key: 'Name', value: 'John' },
   *        { key: 'Age', value: 25 },
   *        // 他のデータを追加
   * ];
   */
  databaseUpdate(spreadsheetId, sheetName, keyValuePair, filterConditions) {
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId); // スプレッドシートを開く
      const sheet = spreadsheet.getSheetByName(sheetName); // 指定したシートを取得
      if (!sheet) throw new Error(this.sheetNameError); // シートを開けなかった場合
      const dataRange = sheet.getDataRange(); // データの範囲を取得
      const values = dataRange.getValues(); // データを2D配列として取得
      const headers = values[0].filter(Boolean); // ヘッダー行を取得（連想配列のキーとして使用）
      // 対象データを抽出
      const filteredValues = this.filterValuesWithAnd(values, filterConditions);
      // 対象データを更新
      for (let i = 0; i < filteredValues.length; i++) {
        let row = filteredValues[i];
        let keyIndex = headers.indexOf('key'); // キーの列を特定する
        if (row[keyIndex] === keyValuePair['key']) {
          for (let updateKey in keyValuePair) {
            let updateValue = keyValuePair[updateKey];
            let updateIndex = headers.indexOf(updateKey);
            if (updateIndex !== -1) {
              sheet.getRange(values.indexOf(row) + 1, updateIndex + 1).setValue(updateValue);
            }
          }
        }
      }
      return {'success': true, 'error': ''};

    } catch (error) {
      return {'success': false, 'error': error};
    }
  }

  /**
   * スプレッドシートのデータを更新（OR）
   * 一括で複数の行データを更新する
   * @param {String} spreadsheetId
   * @param {String} sheetName
   * @param {Object} keyValuePair
   * @param {Object List} filterConditions
   * @return {Object} 
   * [Ref.]
   * const keyValuePair = { 'Name': 'Mike', 'Age': 31 };
   * const filterConditions = [
   *        { key: 'Name', value: 'John' },
   *        { key: 'Age', value: 25 },
   *        // 他のデータを追加
   * ];
   */
  databaseOrUpdate(spreadsheetId, sheetName, keyValuePair, filterConditions) {
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId); // スプレッドシートを開く
      const sheet = spreadsheet.getSheetByName(sheetName); // 指定したシートを取得
      if (!sheet) throw new Error(this.sheetNameError); // シートを開けなかった場合
      const dataRange = sheet.getDataRange(); // データの範囲を取得
      const values = dataRange.getValues(); // データを2D配列として取得
      const headers = values[0].filter(Boolean); // ヘッダー行を取得（連想配列のキーとして使用）
      // 対象データを抽出
      const filteredValues = this.filterValuesWithOr(values, filterConditions);
      // 対象データを更新
      for (let i = 0; i < filteredValues.length; i++) {
        let row = filteredValues[i];
        let keyIndex = headers.indexOf('key'); // キーの列を特定する
        if (row[keyIndex] === keyValuePair['key']) {
          for (let updateKey in keyValuePair) {
            let updateValue = keyValuePair[updateKey];
            let updateIndex = headers.indexOf(updateKey);
            if (updateIndex !== -1) {
              sheet.getRange(values.indexOf(row) + 1, updateIndex + 1).setValue(updateValue);
            }
          }
        }
      }
      return {'success': true, 'error': ''};

    } catch (error) {
      return {'success': false, 'error': error};
    }
  }

  /**
   * スプレッドシートのデータを削除（AND）
   * @param {String} spreadsheetId
   * @param {String} sheetName
   * @param {Object List} filterConditions
   * @return {Object} 
   * [Ref.]
   * const filterConditions = [
   *        { key: 'Name', value: 'John' },
   *        { key: 'Age', value: 25 },
   *        // 他のデータを追加
   * ];
   */
  databaseDelete(spreadsheetId, sheetName, filterConditions) {
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId); // スプレッドシートを開く
      const sheet = spreadsheet.getSheetByName(sheetName); // 指定したシートを取得
      if (!sheet) throw new Error(this.sheetNameError); // シートを開けなかった場合
      const dataRange = sheet.getDataRange(); // データの範囲を取得
      const values = dataRange.getValues(); // データを2D配列として取得
      const headers = values[0].filter(Boolean); // ヘッダー行を取得（連想配列のキーとして使用）
      // 削除対象データの格納変数を初期化
      let rowsToDelete = [];
      // 削除対象データの抽出
      values.forEach((row, index) => {
        let meetsConditions = filterConditions.every(condition => {
          let key = condition.key;
          let value = condition.value;
          // key に比較演算子が含まれているかを検証し処理を分岐
          if (key.endsWith(this.operators.graterThan)) {
            key = this.removeStringFromEnd(key, this.operators.graterThan);
            let columnIndex = headers.indexOf(key);
            return columnIndex !== -1 && row[columnIndex] && row[columnIndex] > value;
          } else if (key.endsWith(this.operators.graterThanEqual)) {
            key = this.removeStringFromEnd(key, this.operators.graterThanEqual);
            let columnIndex = headers.indexOf(key);
            return columnIndex !== -1 && row[columnIndex] && row[columnIndex] >= value;
          } else if (key.endsWith(this.operators.lessThan)) {
            key = this.removeStringFromEnd(key, this.operators.lessThan);
            let columnIndex = headers.indexOf(key);
            return columnIndex !== -1 && row[columnIndex] && row[columnIndex] < value;
          } else if (key.endsWith(this.operators.lessThanEqual)) {
            key = this.removeStringFromEnd(key, this.operators.lessThanEqual);
            let columnIndex = headers.indexOf(key);
            return columnIndex !== -1 && row[columnIndex] && row[columnIndex] <= value;
          } else if (key.endsWith(this.operators.notEqual)) {
            key = this.removeStringFromEnd(key, this.operators.notEqual);
            let columnIndex = headers.indexOf(key);
            return columnIndex !== -1 && row[columnIndex] != value;
          } else if (key.endsWith(this.operators.notEqualStrict)) {
            key = this.removeStringFromEnd(key, this.operators.notEqualStrict);
            let columnIndex = headers.indexOf(key);
            return columnIndex !== -1 && row[columnIndex] !== value;
          } else if (key.endsWith(this.operators.equal)) {
            key = this.removeStringFromEnd(key, this.operators.equal);
            let columnIndex = headers.indexOf(key);
            return columnIndex !== -1 && row[columnIndex] == value;
          } else {
            let columnIndex = headers.indexOf(key);
            return columnIndex !== -1 && row[columnIndex] === value;
          }
        });
        // 条件に合致した場合はその行番号を抽出
        if (meetsConditions) {
          rowsToDelete.push(index + 1); // 行番号を保存
        }
      });
      // 削除の実行
      rowsToDelete.reverse().forEach(function(rowIndex) {
        sheet.deleteRow(rowIndex);
      });
      return {'success': true, 'error': ''};

    } catch (error) {
      return {'success': false, 'error': error};
    }
  }

  /**
   * スプレッドシートのデータを削除（OR）
   * 一括で複数の行データを削除する
   * @param {String} spreadsheetId
   * @param {String} sheetName
   * @param {Object List} filterConditions
   * @return {Object} 
   * [Ref.]
   * const filterConditions = [
   *        { key: 'Name', value: 'John' },
   *        { key: 'Age', value: 25 },
   *        // 他のデータを追加
   * ];
   */
  databaseOrDelete(spreadsheetId, sheetName, filterConditions) {
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId); // スプレッドシートを開く
      const sheet = spreadsheet.getSheetByName(sheetName); // 指定したシートを取得
      if (!sheet) throw new Error(this.sheetNameError); // シートを開けなかった場合
      const dataRange = sheet.getDataRange(); // データの範囲を取得
      const values = dataRange.getValues(); // データを2D配列として取得
      const headers = values[0].filter(Boolean); // ヘッダー行を取得（連想配列のキーとして使用）
      // 削除対象データの格納変数を初期化
      let rowsToDelete = [];
      // 削除対象データの抽出
      for (let i = 1; i < values.length; i++) { // i = 1 : ヘッダーは除く
        let row = values[i];
        let meetsCriteria = false;
        // 条件に基づいて行をフィルタリング
        for (let j = 0; j < filterConditions.length; j++) {
          let key = filterConditions[j].key;
          let value = filterConditions[j].value;
          // key に比較演算子が含まれているかを検証し処理を分岐
          if (key.endsWith(this.operators.graterThan)) {
            key = this.removeStringFromEnd(key, this.operators.graterThan);
            let columnIndex = headers.indexOf(key) + 1;
            // 各列の値の検証
            if (columnIndex > 0 && row[columnIndex - 1] && row[columnIndex - 1] > value) {
              meetsCriteria = true;
              break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
            }
          } else if (key.endsWith(this.operators.graterThanEqual)) {
            key = this.removeStringFromEnd(key, this.operators.graterThanEqual);
            let columnIndex = headers.indexOf(key) + 1;
            // 各列の値の検証
            if (columnIndex > 0 && row[columnIndex - 1] && row[columnIndex - 1] >= value) {
              meetsCriteria = true;
              break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
            }
          } else if (key.endsWith(this.operators.lessThan)) {
            key = this.removeStringFromEnd(key, this.operators.lessThan);
            let columnIndex = headers.indexOf(key) + 1;
            // 各列の値の検証
            if (columnIndex > 0 && row[columnIndex - 1] && row[columnIndex - 1] < value) {
              meetsCriteria = true;
              break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
            }
          } else if (key.endsWith(this.operators.lessThanEqual)) {
            key = this.removeStringFromEnd(key, this.operators.lessThanEqual);
            let columnIndex = headers.indexOf(key) + 1;
            // 各列の値の検証
            if (columnIndex > 0 && row[columnIndex - 1] && row[columnIndex - 1] <= value) {
              meetsCriteria = true;
              break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
            }
          } else if (key.endsWith(this.operators.notEqual)) {
            key = this.removeStringFromEnd(key, this.operators.notEqual);
            let columnIndex = headers.indexOf(key) + 1;
            // 各列の値の検証
            if (columnIndex > 0 && row[columnIndex - 1] != value) {
              meetsCriteria = true;
              break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
            }
          } else if (key.endsWith(this.operators.notEqualStrict)) {
            key = this.removeStringFromEnd(key, this.operators.notEqualStrict);
            let columnIndex = headers.indexOf(key) + 1;
            // 各列の値の検証
            if (columnIndex > 0 && row[columnIndex - 1] !== value) {
              meetsCriteria = true;
              break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
            }
          } else if (key.endsWith(this.operators.equal)) {
            key = this.removeStringFromEnd(key, this.operators.equal);
            let columnIndex = headers.indexOf(key) + 1;
            // 各列の値の検証
            if (columnIndex > 0 && row[columnIndex - 1] == value) {
              meetsCriteria = true;
              break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
            }
          } else {
            let columnIndex = headers.indexOf(key) + 1;
            // 各列の値の検証
            if (columnIndex > 0 && row[columnIndex - 1] === value) {
              meetsCriteria = true;
              break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
            }
          }
        }
        // 条件に合致した場合はその行番号を抽出
        if (meetsCriteria) {
          rowsToDelete.push(i + 1); // 行番号を保存
        }
      }
      // 削除の実行
      rowsToDelete.reverse().forEach(function(rowIndex) {
        sheet.deleteRow(rowIndex);
      });
      return {'success': true, 'error': ''};

    } catch (error) {
      return {'success': false, 'error': error};
    }
  }

  /**
   * スプレッドシートのデータを全削除（ヘッダーは除く）
   * @param {String} spreadsheetId
   * @param {String} sheetName
   * @return {Object} 
   */
  databaseTruncate(spreadsheetId, sheetName) {
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId); // スプレッドシートを開く
      const sheet = spreadsheet.getSheetByName(sheetName); // 指定したシートを取得
      if (!sheet) throw new Error(this.sheetNameError); // シートを開けなかった場合
      const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()); // 2行目以降のデータ範囲を取得（ヘッダーを除外）
      // 削除の実行
      dataRange.clearContent();
      return {'success': true, 'error': ''};

    } catch (error) {
      return {'success': false, 'error': error};
    }
  }

  /**
   * AND フィルター
   * @param {List List} values : range.getValues()
   * @param {Object List} filterConditions
   */
  filterValuesWithAnd(values, filterConditions) {
    const headers = values[0].filter(Boolean);
    const filteredValues = values.filter(row => {
      return filterConditions.every(condition => {
        let key = condition.key;
        let value = condition.value;
        // key に比較演算子が含まれているかを検証し処理を分岐
        if (key.endsWith(this.operators.graterThan)) {
          key = this.removeStringFromEnd(key, this.operators.graterThan);
          let columnIndex = headers.indexOf(key);
          return row[columnIndex] && row[columnIndex] > value;
        } else if (key.endsWith(this.operators.graterThanEqual)) {
          key = this.removeStringFromEnd(key, this.operators.graterThanEqual);
          let columnIndex = headers.indexOf(key);
          return row[columnIndex] && row[columnIndex] >= value;
        } else if (key.endsWith(this.operators.lessThan)) {
          key = this.removeStringFromEnd(key, this.operators.lessThan);
          let columnIndex = headers.indexOf(key);
          return row[columnIndex] && row[columnIndex] < value;
        } else if (key.endsWith(this.operators.lessThanEqual)) {
          key = this.removeStringFromEnd(key, this.operators.lessThanEqual);
          let columnIndex = headers.indexOf(key);
          return row[columnIndex] && row[columnIndex] <= value;
        } else if (key.endsWith(this.operators.notEqual)) {
          key = this.removeStringFromEnd(key, this.operators.notEqual);
          let columnIndex = headers.indexOf(key);
          return row[columnIndex] != value;
        } else if (key.endsWith(this.operators.notEqualStrict)) {
          key = this.removeStringFromEnd(key, this.operators.notEqualStrict);
          let columnIndex = headers.indexOf(key);
          return row[columnIndex] !== value;
        } else if (key.endsWith(this.operators.equal)) {
          key = this.removeStringFromEnd(key, this.operators.equal);
          let columnIndex = headers.indexOf(key);
          return row[columnIndex] == value;
        } else {
          let columnIndex = headers.indexOf(key);
          return row[columnIndex] === value;
        }
      });
    });
    return filteredValues;
  }

  /**
   * OR フィルター
   * @param {List List} values : range.getValues()
   * @param {Object List} filterConditions
   */
  filterValuesWithOr(values, filterConditions) {
    const headers = values[0].filter(Boolean);
    const filteredValues = [];
    for (let i = 1; i < values.length; i++) { // i = 1 : ヘッダーは除く
      let row = values[i];
      let meetsCriteria = false;
      // 条件に基づいて行をフィルタリング
      for (let j = 0; j < filterConditions.length; j++) {
        let key = filterConditions[j].key;
        let value = filterConditions[j].value;
        // key に比較演算子が含まれているかを検証し処理を分岐
        if (key.endsWith(this.operators.graterThan)) {
          key = this.removeStringFromEnd(key, this.operators.graterThan);
          let columnIndex = headers.indexOf(key) + 1;
          // 各列の値の検証
          if (columnIndex > 0 && row[columnIndex - 1] && row[columnIndex - 1] > value) {
            meetsCriteria = true;
            break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
          }
        } else if (key.endsWith(this.operators.graterThanEqual)) {
          key = this.removeStringFromEnd(key, this.operators.graterThanEqual);
          let columnIndex = headers.indexOf(key) + 1;
          // 各列の値の検証
          if (columnIndex > 0 && row[columnIndex - 1] && row[columnIndex - 1] >= value) {
            meetsCriteria = true;
            break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
          }
        } else if (key.endsWith(this.operators.lessThan)) {
          key = this.removeStringFromEnd(key, this.operators.lessThan);
          let columnIndex = headers.indexOf(key) + 1;
          // 各列の値の検証
          if (columnIndex > 0 && row[columnIndex - 1] && row[columnIndex - 1] < value) {
            meetsCriteria = true;
            break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
          }
        } else if (key.endsWith(this.operators.lessThanEqual)) {
          key = this.removeStringFromEnd(key, this.operators.lessThanEqual);
          let columnIndex = headers.indexOf(key) + 1;
          // 各列の値の検証
          if (columnIndex > 0 && row[columnIndex - 1] && row[columnIndex - 1] <= value) {
            meetsCriteria = true;
            break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
          }
        } else if (key.endsWith(this.operators.notEqual)) {
          key = this.removeStringFromEnd(key, this.operators.notEqual);
          let columnIndex = headers.indexOf(key) + 1;
          // 各列の値の検証
          if (columnIndex > 0 && row[columnIndex - 1] != value) {
            meetsCriteria = true;
            break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
          }
        } else if (key.endsWith(this.operators.notEqualStrict)) {
          key = this.removeStringFromEnd(key, this.operators.notEqualStrict);
          let columnIndex = headers.indexOf(key) + 1;
          // 各列の値の検証
          if (columnIndex > 0 && row[columnIndex - 1] !== value) {
            meetsCriteria = true;
            break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
          }
        } else if (key.endsWith(this.operators.equal)) {
          key = this.removeStringFromEnd(key, this.operators.equal);
          let columnIndex = headers.indexOf(key) + 1;
          // 各列の値の検証
          if (columnIndex > 0 && row[columnIndex - 1] == value) {
            meetsCriteria = true;
            break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
          }
        } else {
          let columnIndex = headers.indexOf(key) + 1;
          // 各列の値の検証
          if (columnIndex > 0 && row[columnIndex - 1] === value) {
            meetsCriteria = true;
            break; // OR 検索: 1 つでも条件に合致すれば絞り込みを完了
          }
        }
      }
      // 条件に合致したデータ行を追加
      if (meetsCriteria) {
        filteredValues.push(row);
      }
    }
    return filteredValues;
  }

  /**
   * 文字列の最後尾から特定の文字列を削除する
   * @param {String} targetString
   * @param {String} subString
   * @return {String}
   */
  removeStringFromEnd(targetString, subString) {
    let position = targetString.lastIndexOf(subString);
    return targetString.substring(0, position);
  }

} // End of the class
