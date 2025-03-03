# Middleware

### Table of Contents

* [1. Overview](#-1-overview)
  -[1.1. Message Brokerage](#11-message-brokerage)
  -[1.2. Script Injection](#12-script-injection)
* [2. Usage](#-2-usage)

## 🔭 1. Overview

The middleware, also known as "content scripts", are the go between the [client][client] (webpage) and the [provider][provider] (extension).

The main responsibility of the middleware is to act as a brokerage of messaging between the client and the provider.

<sup>[Back to top ^][table-of-contents]</sup>

### 1.1. Message Brokerage

As outlined in the MDN [docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#webextension_apis), content scripts have limited access to the web extension APIs, however, content scripts are able to send messages to the extension service worker, which has access to the full suite of web extension APIs.

<sup>[Back to top ^][table-of-contents]</sup>

### 1.2. Script Injection

Content scripts have limited access to a web-page, however, to overcome this limitation, the content script can inject a script file directly into the webpage and attach listeners and manipulate the DOM, such as adding modals for authentication.

<sup>[Back to top ^][table-of-contents]</sup>

## 🪄 2. Usage

The main entry point is the [`src/middleware/main.ts`](./main.ts) file. This file contains all the initializations of the message brokers and injects any scripts into the webpage.

<sup>[Back to top ^][table-of-contents]</sup>

<!-- links -->
[client]: ../client/README.md
[provider]: ../provider/README.md
[table-of-contents]: #table-of-contents
