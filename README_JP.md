<a name="top"></a>
<br>
<p align="center" style="font-size: 32px;"><b>AIで検索</b></p>
<p align="center">
  AIを使った会話ベースの検索エンジンを構築するためのシンプルな実装です。Node.js & Vue3を使用しています。
</p>
<p align="center">
  <a href="https://isou.chat/">ライブデモ</a>
</p>

<p align="center">
  <a href="https://github.com/yokingma/search_with_ai/stargazers"><img src="https://img.shields.io/github/stars/yokingma/search_with_ai" alt="Github Stars"></a>
  <a href="https://github.com/yokingma/search_with_ai/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-purple" alt="License"></a>
  <a href="https://github.com/yokingma/search_with_ai/issues/new"><img src="https://img.shields.io/badge/Report a bug-Github-%231F80C0" alt="Report a bug"></a>
  <a href="https://github.com/yokingma/search_with_ai/discussions/new?category=q-a"><img src="https://img.shields.io/badge/Ask a question-Github-%231F80C0" alt="Ask a question"></a>
</p>

[English](./README.md) [中文](./README_ZH_CN.md) **日本語**

<div align="center">
 <img src="./assets/screenshot.jpg"></img>
</div>

<div align="center">
 <img src="./assets/deepseek.png" style="box-sizing: border-box;border: 4px solid #ccc;border-radius: 10px;"></img>
</div>

リポジトリ: [GitHub](https://github.com/yokingma/search_with_ai) [CNB](https://cnb.cool/isou/AiSearch)

## 機能

* LLMのサポート: OpenAI, Google, Lepton, DeepSeek(R1), SiliconFlow, AliYun, Baidu, ChatGLM, Moonshot, Tencent, Lepton, Yi, その他...
* Ollama, [LMStudio](https://github.com/lmstudio-ai/lms)のサポート
* 検索エンジンのサポート: Bing, Google, [Tavily](https://tavily.com/), [SearXNG](https://github.com/searxng/searxng)
* カスタマイズ可能な美しいUIインターフェース
* ライト&ダークモード, モバイルのサポート
* i18nのサポート
* コンテキストを使用したQ&Aの継続
* 結果のキャッシュ、強制リロードのサポート
* 画像検索のサポート
* 完全なウェブコンテンツの抽出、[Jina](https://jina.ai/) Reader URLに基づく。

## Dockerでのデプロイ (推奨)

[Dockerのインストール](https://docs.docker.com/install/).

```shell
docker pull docker.cnb.cool/aigc/aisearch
```

> プロジェクトの事前構築イメージ [CNB.cool](https://cnb.cool/aigc/AiSearch)

1.**コードを取得します。**

```shell
git clone https://github.com/yokingma/search_with_ai.git
cd search_with_ai
```

2.**編集** [.env.docker](https://github.com/yokingma/search_with_ai/blob/main/.env) **ファイル。** ```deploy```ディレクトリ内。

> .env.dockerファイルを変更した場合、Dockerコンテナを再起動するだけで変更が反映されます。

少なくとも1つのKEYを設定する必要があります。

```shell
...
# OpenAI KEY
OPENAI_KEY=#your key

# Searxngのホスト名。
SEARXNG_HOSTNAME=http://searxng:8080
```

3.**[model.json](https://github.com/yokingma/search_with_ai/blob/main/deploy/model.json) ファイルを編集します。** [オプション]

```json
{
  "provider": "openai",
  "type": "openai",
  // BaseUrlを変更する
  "baseURL": "https://api.openai.com/v1",
  // 変更または追加するモデル
  "models": ["o1-preview", "o1-mini", "gpt-4o", "gpt-4o-mini"]
}
```

4.**docker-composeで実行します。**

```shell
docker compose up -d
```

その後、<http://localhost:3000>にアクセスします。

5.**更新**

- Docker DesktopまたはDocker CLIを使用して古いイメージを削除します（必要に応じて）
- ```docker compose down```を実行します。
- ```docker compose up -d```を実行します。

## 検索エンジン

内蔵の検索エンジン: Bing, Google, SearXNG

#### SearXNG (無料、キー不要)

[SearXNG](https://github.com/searxng/searxng)を[searxng-docker](https://github.com/searxng/searxng-docker)でインストールします。
> SearXNGは、さまざまな検索サービスやデータベースから結果を集約する無料のインターネットメタ検索エンジンです。このサービスはユーザーを追跡したりプロファイルを作成したりしないため、オンラインで匿名性を求めるユーザーに保護を提供します。さらに、SearXNGはTorを介してオンライン匿名性を実現することもできます。

SearxNGをインストールすると、デフォルトでアクティブな出力形式はHTML形式のみです。APIを使用するには、json形式を有効にする必要があります。これを行うには、settings.ymlファイルに次の行を追加します。

```yaml
search:
    formats:
        - html
        - json
```

そして、リミッターをfalseに設定します。

```yaml
server:
   limiter: false # デフォルトはtrue
```

.envファイルでホストを設定することもできます。

```shell
# SEARXNG_HOSTNAME=<host>
```

#### Bing検索

Bing Web Search APIを使用するには、[このリンク](https://www.microsoft.com/en-us/bing/apis/bing-web-search-api)にアクセスしてBingのサブスクリプションキーを取得してください。
> Bing Search APIは有料ですが、月に1000回の無料呼び出し枠があります。

#### Google検索

Google検索には、[SearchApi](https://www.searchapi.io/)のSearchApi Google Search API、[Serper](https://www.serper.dev/)のSerper Google Search API、またはGoogleの[Programmable Search Engine](https://developers.google.com/custom-search)の3つのオプションがあります。

#### ChatGLM Web Search

[2024/09/17] Zhipu AIのChatGLM Web Searchプラグインが追加され、中国語の検索エンジンとして使用されます。
> Zhipu AIのglm-flashは現在無料であり、そのWeb Searchプラグインも無料です。これら2つを基に、ChatGLMが無料の中国語検索エンジンとして追加されました。

#### Jina Reader URL API

[2024/11/24] [Jina](https://jina.ai/) Reader URL APIが追加され、完全なウェブコンテンツの抽出がサポートされました。
WEBページで[研究]オプションモードを選択した場合、Jina APIが呼び出され、ウェブページの全文内容をAIのコンテキスト参考資料として抽出します。JINA_KEYを設定する必要があります。

```shell
# JINA API KEY
JINA_KEY=#your key
```

## セットアップ

> Node.js >= 20
> Turborepo
> PackageManager: yarn@3.5.1

* **ディレクトリ構造**

```text
apps/
  | server: サーバー
  | web: フロントエンド
deploy/
  | docker-compose.yaml: dockerデプロイファイル
  | .env.docker: サーバー設定ファイル
  | model.json: サーバーモデル設定ファイル
  ...
```

* **開発&ビルド**
プロジェクトのルートで:

```shell
turbo dev
# or
turbo build
```

* **更新**
プロジェクトのルートで:

```shell
git pull
```

## ライセンス

このリポジトリのソースコードは、[MITライセンス](LICENSE)の下で公開されています。

[🚀トップに戻る](#top)