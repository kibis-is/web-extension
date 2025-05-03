# Client

### Table of Contents

* [1. Overview](#-1-overview)
  - [1.1. Interceptors](#11-interceptors)
  - [1.2. Legacy `algorand-provider` support](#12-legacy-algorand-provider-support)
* [2. Usage](#-2-usage)

## 🔭 1. Overview

The client is injected scripts directly into a web page and allow for full access to the DOM and they used to post messages to the [provider][provider] (via the [middleware][middleware]).

<sup>[Back to top ^][table-of-contents]</sup>

### 1.1. Interceptors

One of the main purposes of the client is to intercept some of the webpage's global handlers. This is where interceptors are used. They are classes that contain the necessary functionality to override the global DOM functions.

An example of this, is the [`CredentialContainer`](https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer) functions in order to allow the [provider][provider] to register or authenticate passkeys using the [`navigator.credentials.create()`](https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/create) and [`navigator.credentials.get()`](https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/get), respectively.

<sup>[Back to top ^][table-of-contents]</sup>

### 1.2. Legacy `algorand-provider` support

Despite [`algorand-provider`][algorand-provider] being no longer maintained, there are a few core sites that still use the provider as a connector.

The `LegacyProviderAdapter` is used to interface between the client's use of `algorand-provider` and the [provider][provider]'s use of the superior [avm-web-provider](https://github.com/agoralabs-sh/avm-web-provider).

Sites still supporting [`algorand-provider`][algorand-provider]:

* https://voirewards.com
* https://fountain.voirewards.com

> ⚠️ **NOTE:** `algorand-provider` will be phased out in future updates.

<sup>[Back to top ^][table-of-contents]</sup>

## 🪄 2. Usage

The main entry point is the [`src/client/main.ts`](./main.ts) file. This is where any interceptors are initialized.

<sup>[Back to top ^][table-of-contents]</sup>

<!-- links -->
[algorand-provider]: https://github.com/agoralabs-sh/algorand-provider
[middleware]: ../middleware/README.md
[provider]: ../provider/README.md
[table-of-contents]: #table-of-contents
