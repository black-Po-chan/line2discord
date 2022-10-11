/**
 * Googleスプレッドシートの最終行にデータを追加する
 * @returns 成功したか
 */
const _appendGSheet = (sheetID: string, rowContents: any[]): boolean => {
  try {
    const app = SpreadsheetApp.openById(sheetID);
    const sheet = app.getActiveSheet();
    sheet.appendRow(rowContents);

    return true;
  } catch (e) {
    console.error(e);

    return false;
  }
};

/**
 * Googleスプレッドシートの最終行に LINE の グループID を追加する
 * @returns 成功したか
 */
const registerLINEGroup = (groupID: string): boolean => {
  return _appendGSheet(GSHEET_ID, [groupID, 'NO_DATA']);
};

const findDiscordWebhook = (groupID: string): string => {
  const [row, ok] = findRow(GSHEET_ID, groupID);
  if (!ok || !row || row.length < 2) return '';

  return row[1];
};

/**
 * Googleスプレッドシートから引数`key`で指定した文字列をA列に持つ行を取得する
 * @todo 現在とってくるのは2列分のみ
 * @returns {[any[], boolean]} 取得した行と、成功したかどうか。
 * 行が見つからなかった場合は、 `[[], true]` が帰ってきます
 */
const findRow = (sheetID: string, key: string): [any[], boolean] => {
  try {
    const app = SpreadsheetApp.openById(sheetID);
    const sheet = app.getActiveSheet();

    const rows = sheet
      .getRange('A:B')
      .getValues()
      .filter((row) => row[0].length > 0);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] === key) {
        return [row, true];
      }
    }

    return [[], true];
  } catch (e) {
    console.error(e);

    return [[], false];
  }
};

const testFindRow = () => {
  const [row, ok] = findRow(GSHEET_ID, 'GROUP_ID');
  if (!ok) {
    console.error('ERROR in testFindRow');

    return;
  }

  console.log(row);
};
