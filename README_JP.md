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

<div align="center">
 <img src="./assets/screenshot.jpg"></img>
</div>

リポジトリ: [GitHub](https://github.com/yokingma/search_with_ai)、 [Gitee](https://gitee.com/zac_ma/search_with_ai)

## 機能

* LLMのサポート: OpenAI, Google, Lepton, DeepSeek, Ollama(ローカル)
* 検索エンジンのサポート: Bing, Google, SearXNG(無料)
* Web検索プラグインのサポート: ChatGLM
* カスタマイズ可能な美しいUIインターフェース
* ダークモードのサポート
* モバイル表示のサポート
* Ollama, [LMStudio](https://github.com/lmstudio-ai/lms)のサポート
* i18nのサポート
* コンテキストを使用したQ&Aの継続
* 結果のキャッシュ、強制リロードのサポート
* 画像検索のサポート

## Dockerでのデプロイ (推奨)

[Dockerのインストール](https://docs.docker.com/install/).
> プロジェクトの事前構築イメージ [Docker Hub](https://hub.docker.com/r/zacma/aisearch/tags)

1.**コードを取得します。**

```shell
git clone https://github.com/yokingma/search_with_ai.git
cd search_with_ai
```

2.**編集** [.env.docker](https://github.com/yokingma/search_with_ai/blob/main/.env) **ファイル。** ```docker```ディレクトリ内。

> .env.dockerファイルを変更した場合、Dockerコンテナを再起動するだけで変更が反映されます。

少なくとも1つのKEYを設定する必要があります。

```shell
...
# OpenAIのキーとベースURL
OPENAI_KEY=#your key
OPENAI_PROXY_URL=#baseURL

# Searxngのホスト名。
SEARXNG_HOSTNAME=http://searxng:8080
```

3.**docker-composeで実行します。**

```shell
docker compose up -d
```

その後、<http://localhost:3000>にアクセスします。

4.**更新**

1. Docker DesktopまたはDocker CLIを使用して古いイメージを削除します（必要に応じて）
2. ```docker compose down```を実行します。
3. ```docker compose up -d```を実行します。

## LLMs

#### サポート

* OpenAI ChatGPT
* Google Gemini
* Lepton LLama2、Mixtral8*7B
* AliYun Qwen
* Baidu Wenxin
* 01.ai
* Moonshot(Kimi)
* DeepSeek
* ChatGLM
* Tencent Hunyuan
* Ollama, LMStudio

#### ローカルLLM

[Ollama](https://github.com/ollama/ollama)、[LMStudio](https://github.com/lmstudio-ai/lms)のサポート

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

## セットアップ

必要条件:
> Node.js >= 20

* **サーバー**

```shell
yarn install && yarn run build
```

* **Web**

```shell
cd web && yarn install && yarn run build
```

* **設定(.env)**

[.env](https://github.com/yokingma/search_with_ai/blob/main/.env)はプロジェクトの設定ファイルです。要件に応じて設定してください。

[.env.docker](https://github.com/yokingma/search_with_ai/blob/main/.env.docker)はdockerデプロイ用です。

* **実行**
プロジェクトのルートで:

```shell
yarn run start 
```

* **更新**
プロジェクトのルートで:

```shell
git pull
yarn install
cd web && yarn install && yarn run build
```

これで<http://localhost:3000>にアクセスできます。
