/** Discord Webhook を使ってDiscordにメッセージを投稿する */
const sendDiscordMessage = (avater: string, name: string, message: string) => {
  const payload = {
    // avatar_url: avater,
    content: `${name}${message}`,
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
