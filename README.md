# line2discord

![](images/demo0.png)

Google Apps Script(以降、gas) で LINEからDiscord にメッセージの転送をするプログラムです。

あくまで、`LINE -> Discord` のみの転送です。 `Discord -> LINE` には対応していません。

```
Note: claspは謎のエラーを吐いて機能しなかったので使っていません。原因がわかればclaspに移行予定です。
```

## 機能

今のところ、転送できるメッセージは

- テキストメッセージ
- 画像
- LINEスタンプ

になっています。

LINEスタンプはアニメーション、音声付きスタンプ、メッセージ付きスタンプには対応していません。(すべて画像スタンプとして処理されます)

## 使い方

### 必要なもの

- DiscordのWebhook URL
- Googleドライブのフォルダ
- LINEの Messaging API のアクセストークン

Discordはアップロードできるファイルサイズに上限があるので、ファイルはGoogleドライブに保存しそのURLをDiscordに送信しています。

対象のGoogleドライブのフォルダは`共有 > リンクを取得`で`リンクを知っている全員`に設定してある必要があります。

### gasのセットアップ

`src/_.ts`を作成して

```ts
// DiscordのWebhookのURL
// e.g. https://discord.com/api/webhooks/944444000011111777/uxxxxxxxxxxxx_o-3IBBxxxxxxxxxJYTr31exxxxxxxxNukjN1gQe10rxxxxxxxxxxxx
const DISCORD_WEBHOOK_URL = 'DISCORD_WEBHOOK_URL';

// Googleドライブのフォルダ(後述)のID
const GDRIVE_FOLDER_ID = 'FOLDER_ID';

// LINEの Messaging API のアクセストークン
const LINE_MESSAGING_API_ACCESS_TOKEN = 'LINE_MESSAGING_API_ACCESS_TOKEN';
```

を定義したら、次のコマンドを実行してください。

```sh
$ yarn
$ yarn build
```

その後、`/build`に生成された`.js`ファイルの中身をすべてgasにコピペしてください。(拡張子は`.gs`になります)

![](images/demo1.png)

最後に、サービスで`Drive API`を選んで追加してください。

### デプロイ

gasのデプロイは、

- 種類: `ウェブアプリ`
- 次のユーザーとして実行: `自分(email)`
- アクセスできるユーザー: `自分のみ`

としてデプロイしてください。

gasがデプロイできたらウェブアプリのURL(例: `https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxxxx/exec`)を、LINE Developersで`Messaging API > Webhook settings`に貼り付けてください。

![](images/demo2.png)

## 参考記事

- [【ゼロから解説】LINEとDiscordのグループをbotで接続する【無料･高速･鯖いらず】](https://qiita.com/i_tatte/items/6cd8d9ce0a93df249937)
- [doubleplusc/Line-sticker-downloader](https://github.com/doubleplusc/Line-sticker-downloader)
