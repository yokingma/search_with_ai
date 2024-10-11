# Rechercher avec l'IA

<br>
<p align="center">
  Créez votre recherche basée sur les conversations avec l'IA, une implémentation simple avec Node.js et Vue3.
</p>
<p align="center">
  <a href="https://isou.chat/">Démo en direct</a>
</p>

<p align="center">
  <a href="https://github.com/yokingma/search_with_ai/stargazers"><img src="https://img.shields.io/github/stars/yokingma/search_with_ai" alt="Github Stars"> </a>
  <a href="https://github.com/yokingma/search_with_ai/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-purple" alt=" Licence"></a>
  <a href="https://github.com/yokingma/search_with_ai/issues/new"><img src="https://img.shields.io/badge/Report a bug-Github-%231F80C0" alt= "Signaler un bug"></a>
  <a href="https://github.com/yokingma/search_with_ai/discussions/new?category=q-a"><img src="https://img.shields.io/badge/Poser une question-Github-% 231F80C0" alt="Poser une question"></a>
</p>

<div align="center">
  
**English** | [中文](./README_CN.md) | [日本語](./README_JP.md)

</div>

<div align="centre">
 <img src="./assets/screenshot.jpg"></img>
</div>

Dépôts : [GitHub](https://github.com/yokingma/search_with_ai) [Gitee](https://gitee.com/zac_ma/search_with_ai) [CNB](https://cnb.cool/isou/AiSearch) 

## Caractéristiques

* Prise en charge intégrée de LLM : OpenAI, Google, Lepton, DeepSeek, Ollama (local)
* Prise en charge intégrée des moteurs de recherche : Bing, Google, SearXNG (gratuit)
* Prise en charge intégrée du plugin de recherche Web : ChatGLM
* Jolie interface utilisateur personnalisable
* Prise en charge du mode sombre
* Prise en charge de l'affichage mobile
* Prise en charge d'Ollama, [LMStudio](https://github.com/lmstudio-ai/lms)
* Prise en charge i18n
* Prise en charge de Continuer les questions et réponses avec les contextes.
* Prise en charge des résultats du cache, rechargement forcé.
* Prise en charge de la recherche d'images.

## Déployer avec Docker (recommandé)

[Installer Docker](https://docs.docker.com/install/).
> Image prédéfinie du projet [Docker Hub](https://hub.docker.com/r/zacma/aisearch/tags)

1.**Obtenez le code.**

```coquille
clone git https://github.com/yokingma/search_with_ai.git
cd search_with_ai
```

2.**Modifier** [.env.docker](https://github.com/yokingma/search_with_ai/blob/main/.env) **fichier.** dans le répertoire ```docker```.

> Si vous modifiez le fichier .env.docker, redémarrez simplement le conteneur Docker pour que les modifications prennent effet.

Vous devez définir au moins une clé.

```coquille
...
# Clé et baseUrl d'OpenAI
OPENAI_KEY=#votre clé
OPENAI_PROXY_URL=#URLdebase

# Rechercher le nom d'hôte.
SEARXNG_HOSTNAME=http://searxng:8080
```

3.**Modifier** [model.json](https://github.com/yokingma/search_with_ai/blob/main/docker/model.json) **fichier.** [Facultatif]

```json
{
  "plateforme": "openai",
  "type": "openai",
  // ajoutez vos modèles
  "modèles": ["o1-preview", "o1-mini", "gpt-4o", "gpt-4o-mini"]
}
```

4.**exécuter avec docker-compose.**

```coquille
docker compose -d
```

Alors visitez <http://localhost:3000>

5.**Mise à jour**

- Supprimez les anciennes images à l'aide de Docker Desktop ou de Docker CLI (si nécessaire)
- exécutez ```docker compose down```
- exécutez ```docker compose up -d```

## LLM

#### Soutien

* OpenAI ChatGPT
* Google Gémeaux
* Lepton LLama2、Mixtral8*7B
*AliYun Qwen
*Baidu Wenxin
* 01.ai
* Tir de lune (Kimi)
* Recherche profonde
* ChatGLM
* Tencent Hunyuan
* Ollama, LMStudio

#### LLM local

Prise en charge de [Ollama](https://github.com/ollama/ollama), [LMStudio](https://github.com/lmstudio-ai/lms)

## Moteur de recherche

Prise en charge intégrée des moteurs de recherche : Bing, Google, SearXNG

#### SearXNG (gratuit, aucune clé requise)

installez [SearXNG](https://github.com/searxng/searxng) avec [searxng-docker](https://github.com/searxng/searxng-docker)
> SearXNG est un métamoteur de recherche Internet gratuit qui regroupe les résultats de divers services de recherche et bases de données. Le service ne suit ni ne profile ses utilisateurs, offrant ainsi l'anonymat en ligne à ceux qui le recherchent. De plus, SearXNG peut être utilisé sur Tor pour l'anonymat en ligne.

Lorsque vous installez SearxNG, le seul format de sortie actif par défaut est le format HTML. Vous devez activer le format json pour utiliser l'API. Cela peut être fait en ajoutant la ligne suivante au fichier settings.yml :

```yaml
recherche:
    formats :
        -html
        -json
```

Et définissez le limiteur sur false :

```yaml
serveur:
   limiteur : faux # la valeur par défaut est vraie
```

Vous pouvez également définir l'hôte dans .env :

```coquille
# SEARXNG_HOSTNAME=<hôte>
```

#### Recherche Bing

Pour utiliser l'API de recherche Web Bing, veuillez visiter [ce lien](https://www.microsoft.com/en-us/bing/apis/bing-web-search-api) pour obtenir votre clé d'abonnement Bing.
> L'API Bing Search est facturée, mais propose un niveau gratuit de 1 000 appels par mois.

#### Recherche Google

Vous disposez de trois options pour la recherche Google : vous pouvez utiliser l'API de recherche Google SearchApi à partir de [SearchApi](https://www.searchapi.io/), [Serper](https://www.serper.dev/) Recherche Google API de Serper, ou optez pour le [Moteur de recherche programmable](https://developers.google.com/custom-search) fourni par Google.

#### Recherche sur le Web ChatGLM

[2024/09/17] Ajout du plugin ChatGLM Web Search de Zhipu AI, utilisé comme moteur de recherche chinois.
> Le glm-flash de Zhipu AI est actuellement gratuit, et son plugin Web Search est également gratuit. Sur la base de ces deux éléments, ChatGLM a été ajouté en tant que moteur de recherche chinois gratuit.

## Installation

Requis:
> Node.js >= 20

* **Serveur**

```coquille
installation de fil et construction d'exécution de fil
```

* **Internet**

```coquille
cd web && installation de fil && build d'exécution de fil
```

* **Config(.env)**

[.env](https://github.com/yokingma/search_with_ai/blob/main/.env) est le fichier de configuration du projet. Veuillez le configurer selon vos besoins.

[.env.docker](https://github.com/yokingma/search_with_ai/blob/main/docker/.env.docker) est destiné au déploiement de Docker.

* **Courir**
A la racine du projet :

```coquille
début du filage 
```

* **Mise à jour**
A la racine du projet :

```coquille
git pull
installation de fil
cd web && installation de fil && build d'exécution de fil
```

Vous pouvez maintenant visiter <http://localhost:3000>

## Licence

Le code source de ce référentiel est disponible sous la [Licence MIT](LICENSE).
