declare type Profile = {
  displayName: string;
  userId: string;
  pictureUrl: string;
  statusMessage: string;
  language?: string;
};

declare type EventBase = {
  /**
   * Channel state.
   *
   * `active`: The channel is active. You can send a reply message or push message from the bot server that received this webhook event.
   *
   * `standby`: The channel is waiting. The bot server that received this webhook event shouldn't send any messages.
   */
  mode: 'active' | 'standby';
  /**
   * Time of the event in milliseconds
   */
  timestamp: number;
  /**
   * Source user, group, or room object with information about the source of the event.
   */
  source: LineEventSource;
};

declare type LineEventSource = User | Group | Room;

declare type User = { type: 'user'; userId: string };

declare type Group = {
  type: 'group';
  groupId: string;
  /**
   * ID of the source user.
   *
   * Only included in [message events](https://developers.line.biz/en/reference/messaging-api/#message-event).
   * Not included if the user has not agreed to the
   * [Official Accounts Terms of Use](https://developers.line.biz/en/docs/messaging-api/user-consent/).
   */
  userId?: string;
};

declare type Room = {
  type: 'room';
  roomId: string;
  /**
   * ID of the source user.
   *
   * Only included in [message events](https://developers.line.biz/en/reference/messaging-api/#message-event).
   * Not included if the user has not agreed to the
   * [Official Accounts Terms of Use](https://developers.line.biz/en/docs/messaging-api/user-consent/).
   */
  userId?: string;
};

declare type ReplyableEvent = EventBase & { replyToken: string };

/**
 * Webhook event object which contains the sent message.
 *
 * The `message` property contains a message object which corresponds with the
 * message type. You can reply to message events.
 *
 * @see [Message event](https://developers.line.biz/en/reference/messaging-api/#message-event)
 */
declare type LineMessageEvent = {
  type: 'message';
  message: EventMessage;
} & ReplyableEvent;

declare type EventMessage =
  | TextEventMessage
  | ImageEventMessage
  | VideoEventMessage
  | AudioEventMessage
  | LocationEventMessage
  | FileEventMessage
  | StickerEventMessage;

declare type EventMessageBase = { id: string };

/**
 * Message object which contains the text sent from the source.
 */
declare type TextEventMessage = {
  type: 'text';
  text: string;
  /**
   * Sendable LINE emojis
   */
  emojis?: {
    index: number;
    length: number;
    productId: string;
    emojiId: string;
  }[];
  /**
   * Object containing the contents of the mentioned user.
   */
  mention?: {
    /**
     * Mentioned user information.
     * Max: 20 mentions
     */
    mentionees: {
      /**
       * Index position of the user mention for a character in `text`,
       * with the first character being at position 0.
       */
      index: number;
      /**
       * The length of the text of the mentioned user. For a mention `@example`,
       * 8 is the length.
       */
      length: number;
      userId: string;
    }[];
  };
} & EventMessageBase;

declare type ContentProvider<WithPreview extends boolean = true> =
  | {
      /**
       * The content is provided by LINE.
       *
       * The data itself can be retrieved from the content API.
       */
      type: 'line';
    }
  | {
      /**
       * The content is provided by a provider other than LINE
       */
      type: 'external';
      /**
       * URL of the content. Only included when contentProvider.type is external.
       */
      originalContentUrl: string;
      /**
       * URL of the content preview. Only included when contentProvider.type is external.
       *
       * For contents without preview (e.g. audio), it's undefined.
       */
      previewImageUrl: WithPreview extends true ? string : undefined;
    };

/**
 * Message object which contains the image content sent from the source.
 * The binary image data can be retrieved using Client#getMessageContent.
 */
declare type ImageEventMessage = {
  type: 'image';
  contentProvider: ContentProvider;
  /**
   * Object containing the number of images sent simultaneously.
   */
  imageSet?: {
    /**
     * Image set ID. Only included when multiple images are sent simultaneously.
     */
    id: string;
    /**
     * An index starting from 1, indicating the image number in a set of images sent simultaneously.
     * Only included when multiple images are sent simultaneously.
     * However, it won't be included if the sender is using LINE 11.15 or earlier for Android.
     */
    index: number;
    /**
     * The total number of images sent simultaneously.
     * If two images are sent simultaneously, the number is 2.
     * Only included when multiple images are sent simultaneously.
     * However, it won't be included if the sender is using LINE 11.15 or earlier for Android.
     */
    total: number;
  };
} & EventMessageBase;

/**
 * Message object which contains the video content sent from the source.
 * The binary video data can be retrieved using Client#getMessageContent.
 */
declare type VideoEventMessage = {
  type: 'video';
  contentProvider: ContentProvider;
} & EventMessageBase;

/**
 * Message object which contains the audio content sent from the source.
 * The binary audio data can be retrieved using Client#getMessageContent.
 */
declare type AudioEventMessage = {
  type: 'audio';
  duration: number;
  contentProvider: ContentProvider<false>;
} & EventMessageBase;

/**
 * Message object which contains the file sent from the source.
 * The binary data can be retrieved using Client#getMessageContent.
 */
declare type FileEventMessage = {
  type: 'file';
  fileName: string;
  fileSize: string;
} & EventMessageBase;

/**
 * Message object which contains the location data sent from the source.
 */
declare type LocationEventMessage = {
  type: 'location';
  title: string;
  address: string;
  latitude: number;
  longitude: number;
} & EventMessageBase;

/**
 * Message object which contains the sticker data sent from the source.
 * For a list of basic LINE stickers and sticker IDs, see
 * [sticker list](https://developers.line.biz/media/messaging-api/sticker_list.pdf).
 */
declare type StickerEventMessage = {
  type: 'sticker';
  packageId: string;
  stickerId: string;
  stickerResourceType: 'STATIC' | 'ANIMATION' | 'SOUND' | 'ANIMATION_SOUND' | 'POPUP' | 'POPUP_SOUND' | 'CUSTOM' | 'MESSAGE';
  keywords: string[];
  /**
   * Any text entered by the user. This property is only included for message stickers.
   * Max character limit: 100
   */
  text?: string;
} & EventMessageBase;
