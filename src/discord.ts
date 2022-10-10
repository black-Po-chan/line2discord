/** Discord Webhook を使ってDiscordにメッセージを投稿する */
const sendDiscordMessage = (avater: string, name: string, message: string) => {
  const payload = {
    username: name,
    avatar_url: avater,
    content: message,
  };

  UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  // こちらはステータスコードを返す必要はない
  return;
};
