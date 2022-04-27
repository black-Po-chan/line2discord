const viewURL = 'https://drive.google.com/uc?export=view&id=';

/** Googleドライブにファイルを書き込む */
const writeGFile = (filename: string, raw: number[], mimetype: string): [string, boolean] => {
  try {
    const folder = DriveApp.getFolderById(GDRIVE_FOLDER_ID);
    const blob = Utilities.newBlob(raw, mimetype, filename);
    const f = folder.createFile(blob);
    const id = f.getId();

    return [viewURL + id, true];
  } catch (e) {
    return [e as string, false];
  }
};
