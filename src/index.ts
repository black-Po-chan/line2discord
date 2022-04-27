type WebhookEvent = {
  type: string;
};

const doPost = (e: GoogleAppsScript.Events.DoPost) => {
  const events = JSON.parse(e.postData.contents).events as WebhookEvent[];
  events.forEach((e) => {
    switch (e.type) {
      case 'message':
        parseLINEMessage(e as LineMessageEvent);
        break;

      default:
        break;
    }
  });
};
