const channel_access_token = 'LINE_MESSAGING_API_ACCESS_TOKEN';
const webhookURL = 'DISCORD_WEBHOOK_URL';

type WebhookEvent = {
  type: string;
};

/**
 * Webhook Event Objects
 *
 * @see - https://developers.line.biz/en/reference/messaging-api/#source-group
 * */
type LineGroupEvent = WebhookEvent & {
  message: {
    type: string;
    id: string;
    text: string;
  };
  source: {
    type: string;
    groupId: string;
    userId: string;
  };
};

const doPost = (e: GoogleAppsScript.Events.DoPost) => {
  const events = JSON.parse(e.postData.contents).events as WebhookEvent[];
  events.forEach((e) => {
    switch (e.type) {
      case 'message':
        sendToDiscord(e as LineGroupEvent);
        break;

      default:
        break;
    }
  });
};

const sendToDiscord = (e: LineGroupEvent) => {
  // LINEにユーザープロフィールリクエストを送信(返り値はJSON形式)
  const requestHeader = {
    headers: {
      Authorization: 'Bearer ' + channel_access_token,
    },
  }; // LINEからユーザ名を取得するためのリクエストヘッダー
  const userID = e.source.userId;
  const groupID = e.source.groupId;
  const response = UrlFetchApp.fetch('https://api.line.me/v2/bot/group/' + groupID + '/member/' + userID, requestHeader);

  const message = e.message.text;
  const name = JSON.parse(response.getContentText()).displayName as string; // レスポンスからユーザーのディスプレイネームを抽出
  sendDiscordMessage(name, message);

  // LINEにステータスコード200を返す(これがないと動かない)
  return response.getResponseCode();
};

const sendDiscordMessage = (name: string, message: string) => {
  // Discord webhookに投げるメッセージの内容
  const options = {
    content: name + ' 「' + message + '」',
  };

  UrlFetchApp.fetch(webhookURL, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(options),
    muteHttpExceptions: true,
  });

  // こちらはステータスコードを返す必要はない
  return;
};
