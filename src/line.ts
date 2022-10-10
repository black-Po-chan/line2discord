const requestHeader = {
  headers: {
    Authorization: 'Bearer ' + LINE_MESSAGING_API_ACCESS_TOKEN,
  },
};

/** LINEからのwebhookリクエストを処理する */
const parseLINEMessage = (e: LineMessageEvent) => {
  const msg = e.message;
  const src = e.source as Group;

  const userID = src.userId;
  if (!userID) return 200;
  const groupID = src.groupId;
  const profile = fetchLINEProfile(groupID, userID);

  switch (msg.type) {
    case 'text':
      const message = msg.text ?? '';
      sendDiscordMessage(profile.pictureUrl, profile.displayName, message);
      break;

    case 'image':
      switch (msg.contentProvider.type) {
        case 'line': {
          const raw = fetchLINEFile(msg.id);
          const uuid = Utilities.getUuid();
          const mimetype = getMimeType(new Uint8Array(raw));
          const [url, ok] = writeGFile(`${uuid}.${EXT[mimetype]}`, raw, mimetype);
          if (ok) {
            sendDiscordMessage(profile.pictureUrl, profile.displayName, url);
          }
          break;
        }

        case 'external': {
          const url = msg.contentProvider.originalContentUrl;
          sendDiscordMessage(profile.pictureUrl, profile.displayName, url);
          break;
        }
      }
      break;

    case 'sticker':
      // TODO: すでに同じスタンプがGoogleドライブに存在するか調べる
      const { packageId, stickerId, stickerResourceType } = msg;

      let raw = [];
      let mimetype = MIME.PNG as string;
      switch (stickerResourceType) {
        case 'ANIMATION':
        case 'ANIMATION_SOUND': {
          raw = fetchAnimLINEStamp(packageId, stickerId);
          mimetype = MIME.APNG;
          break;
        }
        default: {
          raw = fetchLINEStamp(packageId, stickerId);
          break;
        }
      }

      const uuid = Utilities.getUuid();
      const [url, ok] = writeGFile(`${uuid}.${EXT[mimetype]}`, raw, mimetype);
      if (ok) {
        sendDiscordMessage(profile.pictureUrl, profile.displayName, url);
      }
      break;

    default:
      break;
  }

  return 200; // LINEにステータスコード200を返す(これがないと動かない)
};

const fetchLINEProfile = (groupID: string, userID: string): Profile => {
  const url = `https://api.line.me/v2/bot/group/${groupID}/member/${userID}`;
  const response = UrlFetchApp.fetch(url, requestHeader);

  return JSON.parse(response.getContentText()) as Profile;
};

/**
 * LINEにあげられたファイルデータを取ってくる
 *
 * @returns {number[]} ファイルデータのバイト列。mimetypeはわからないので自分で判定する必要あるっぽい
 */
const fetchLINEFile = (messageID: string): number[] => {
  const url = `https://api-data.line.me/v2/bot/message/${messageID}/content`;
  const response = UrlFetchApp.fetch(url, requestHeader);

  return response.getContent();
};

/**
 * LINEスタンプの画像データを取ってくる
 *
 * @returns {number[]} 画像のPNGデータのバイト列
 */
const fetchLINEStamp = (packageID: string, stickerID: string, is2x = false): number[] => {
  const url = `http://dl.stickershop.line.naver.jp/stickershop/v1/sticker/${stickerID}/iphone/sticker${is2x ? '@2x' : ''}.png`;
  const response = UrlFetchApp.fetch(url);

  return response.getContent();
};

/**
 * LINEスタンプの画像データを取ってくる
 *
 * @returns {number[]} 画像のAPNGデータのバイト列
 */
const fetchAnimLINEStamp = (packageID: string, stickerID: string, is2x = false): number[] => {
  const url = `https://sdl-stickershop.line.naver.jp/products/0/0/1/${packageID}/iphone/animation/${stickerID}${is2x ? '@2x' : ''}.png`;
  const response = UrlFetchApp.fetch(url);

  return response.getContent();
};
