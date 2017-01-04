# 概要

apex.oracle.comのOAuth2.0で保護されたoracle.example.hr APIにアクセスするデモアプリ

# 利用方法

まずこちらのQiitaの記事にある通り、apex.oracle.com側でAPIの権限設定、およびクライアントの登録をおこないます。

デモアプリをクローンします。

```
$ git clone https://github.com/nkjm/oauth-demo-for-oracle-example-hr.git
```

config.jsファイルを編集し、WORKSPACE, CLIENT_ID, CLIENT_SECRETをご自身の環境の値に置き換えます。

```
$ cd oauth-demo-for-oracle-example-hr/
$ vi config.js
```

Nodeアプリを起動します。

```
$ node index.js
Server is running on port 5000
```

ブラウザを起動し、 http://localhost:5000 にアクセスします。
するとOAuth2.0の認証フローが開始されます。

認証が成功すると、Nodeアプリにリダクレクトされ、画面にはアクセストークンの情報が表示されます。
この状態で続けて http://localhost:5000/employees にアクセスすると、保護されたAPIにアクセストークンを付与してアクセスがおこなわれ、employeeの一覧がJSON形式で返され画面に表示されます。
