<div align="center">

[![Chrome extension](https://img.shields.io/chrome-web-store/v/hcgejekffjilpgbommjoklpneekbkajb?logo=googlechrome&logoColor=%23FFCE44&color=%23FFCE44)](https://chromewebstore.google.com/detail/kibisis/hcgejekffjilpgbommjoklpneekbkajb)
[![Microsoft Edge add-on](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fbajncpocmkioafbijldokfbjajelkbmc%3Fhl%3Den-GB%26gl%3DGB&query=%24.version&prefix=v&logo=microsoftedge&logoColor=%230078D7&label=microsoft%20edge%20add-on&color=%230078D7)](https://microsoftedge.microsoft.com/addons/detail/kibisis/bajncpocmkioafbijldokfbjajelkbmc)
[![Firefox add-on](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Faddons.mozilla.org%2Fapi%2Fv5%2Faddons%2Faddon%2Fkibisis%2F&query=%24.current_version.version&logo=firefox&logoColor=%23FF7139&label=firefox%20add-on&color=%23FF7139)](https://addons.mozilla.org/en-GB/firefox/addon/kibisis)
[![Opera add-on](https://img.shields.io/badge/opera-FF1B2D?logo=opera)](https://addons.opera.com/en-gb/extensions/details/kibisis/)

</div>

<div align="center">

[![License: AGPL-3.0](https://img.shields.io/github/license/kibis-is/web-extension
)](https://github.com/kibis-is/web-extension/blob/main/COPYING)

</div>

<div align="center">

![GitHub release](https://img.shields.io/github/v/release/kibis-is/web-extension)
![GitHub release date](https://img.shields.io/github/release-date/kibis-is/web-extension?logo=github)

</div>

<div align="center">

![GitHub pre-release](https://img.shields.io/github/v/release/kibis-is/web-extension?include_prereleases&label=pre-release)
![GitHub pre-release date](https://img.shields.io/github/release-date-pre/kibis-is/web-extension?label=pre-release&date&logo=github)

</div>

<div align="center">
  <a href="https://kibis.is">
    <img alt="Kibisis & browser logos" src="https://github.com/kibis-is/web-extension/blob/beta/images/repo_logo@637x128.png" height="64" />
  </a>
</div>

<h1 align="center">
  Kibisis Web Extension
</h1>

<h4 align="center">
  The wallet for your lifestyle.
</h4>

<p align="center">
  This is the Kibisis web extension built in React, TypeScript and Webpack.
</p>

---

### Table of contents

* [1. Overview](#-1-overview)
* [2. Usage](#-2-usage)
* [2. Development](#-3-development)
  - [3.1. Requirements](#31-requirements)
  - [3.2. Setup](#32-setup)
  - [3.3. Install local browsers](#33-install-local-browsers-optional)
    - [3.3.1. Chrome](#331-chrome)
    - [3.3.2. Firefox](#332-firefox)
  - [3.4. Run](#34-run)
* [4. Appendix](#-4-appendix)
  - [4.1. Useful commands](#41-useful-commands)
  - [4.2. Demo application](#42-demo-application)
  - [4.3. Manifest permissions](#43-manifest-permissions)
* [5. How to contribute](#-5-how-to-contribute)
* [6. License](#-6-license)

## 🔭 1. Overview

### 1.1. Terminology

* **Client**: These are all external resources to the provider, except the middleware. These include webpages and other extensions.
* **Middleware**: Also known as content scripts. These resources automatically injected into the webpage and have limited access to both the web extension APIs and the webpage's DOM.
* **Provider**: This is the web extension and includes both the extension's service workers and pages/pop-ups. These have full access to the web extension APIs and communicate to clients via the middleware.

## 🪄 2. Usage

Refer to the [documentation](https://kibis.is/overview) for information on how to use Kibisis.

<sup>[Back to top ^][table-of-contents]</sup>

## 🛠 3. Development

### 3.1. Requirements

* Install [Yarn v1.22.5+](https://yarnpkg.com/)
* Install [Node v20.9.0+](https://nodejs.org/en/)
* Install [jq](https://github.com/jqlang/jq) (optional - if you are installing the local Chrome browser)

<sup>[Back to top ^][table-of-contents]</sup>

### 3.2. Setup

1. Install the dependencies:
```bash
$ yarn install
```

> ⚠️ **NOTE:** a post install script will run that creates a `.env` file.

2. In the newly created `.env` file, replace the environment values with the desired values.

<sup>[Back to top ^][table-of-contents]</sup>

### 3.3. Install local browsers (optional)

If you are want to run a standalone browser for development, you can install developer versions of Chrome and Firefox. If these are installed, these will be used as the installation of the temporary extensions that are built in step [3.4.](#34-run)

> ⚠️ **NOTE:** the following commands can be run again to re-download and install the latest version. Your saved profile and extension settings will not be affected as they are stored in a separate directory in `.<chrome|firefox>_profile/`.
>
<sup>[Back to top ^][table-of-contents]</sup>

#### 3.3.1. Chrome

1. Simply run:
```shell
yarn install:chrome
```

> ️ **NOTE:** the binary will be installed to `.chrome/`.

<sup>[Back to top ^][table-of-contents]</sup>

#### 3.3.2. Firefox

1. Simply run:
```shell
yarn install:firefox
```

> ⚠️ **NOTE:** the binary will be installed to `.firefox/`.

<sup>[Back to top ^][table-of-contents]</sup>

### 3.4. Run

* To run simply use:
```bash
$ yarn start:<chrome|firefox>
```

> ⚠️ **NOTE:** this command will bundle the TypeScript source code and extension assets into the `.<chrome|firefox>_build/` directory and depending on your intended target (you can choose '`chrome`' or '`firefox`') the corresponding browser will start up with the unpacked extension as a temporary extension.

<sup>[Back to top ^][table-of-contents]</sup>

## 📑 4. Appendix

### 4.1. Useful commands

| Command                   | Description                                                                                                                                                                                            |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `yarn build:chrome`       | Bundles the source code and Chrome specific assets into the `.chrome_build/` directory.                                                                                                                |
| `yarn build:edge`         | Bundles the source code and Microsoft Edge specific assets into the `.edge_build/` directory.                                                                                                          |
| `yarn build:firefox`      | Bundles the source code and Firefox specific assets into the `.firefox_build/` directory.                                                                                                              |
| `yarn build:opera`        | Bundles the source code and Firefox specific assets into the `.opera_build/` directory.                                                                                                                |
| `yarn install:chrome`     | Installs/updates the latest version of Chrome For Testing browser to the project root. This removes the existing version if it exists.                                                                 |
| `yarn install:firefox`    | Installs/updates the latest version of Firefox Developer Edition browser to the project root. This removes the existing version if it exists.                                                          |
| `yarn package:chrome`     | Packages the contents of the `.chrome_build/` directory into a `kibisis-chrome-{version}.zip` file, ready for submission.                                                                              |
| `yarn package:edge`       | Packages the contents of the `.edge_build/` directory into a `kibisis-edge-{version}.zip` file, ready for submission.                                                                                  |
| `yarn package:firefox`    | Packages the contents of the `.firefox_build/` directory into a `kibisis-firefox-{version}.zip` file, ready for submission.                                                                            |
| `yarn package:opera`      | Packages the contents of the `.opera_build/` directory into a `kibisis-opera-{version}.zip` file, ready for submission.                                                                                |
| `yarn prettier`           | Runs `prettier` with the same configuration that is run on the pre-commit hooks.                                                                                                                       |
| `yarn start:chrome`       | Bundles the source code & the add-on assets, starts the local Chrome For Testing Developer edition with the add-on installed. This will watch for changes in the source code and reload the extension. |
| `yarn start:edge`         | Bundles the source code & the add-on assets. This will watch for changes in the source code and reload the extension.                                                                                  |
| `yarn start:firefox`      | Bundles the source code & the add-on assets, starts the local Firefox Developer edition with the add-on installed. This will watch for changes in the source code and reload the extension.            |
| `yarn start:opera`        | Bundles the source code & the add-on assets. This will watch for changes in the source code and reload the extension.                                                                                  |
| `yarn start:dapp-example` | Starts the example dApp at [http://localhost:8080](http://localhost:8080)                                                                                                                              |
| `yarn test`               | Runs unit tests.                                                                                                                                                                                       |
| `yarn test:coverage`      | Runs unit tests with coverage.                                                                                                                                                                         |

<sup>[Back to top ^][table-of-contents]</sup>

### 4.2. Demo application

You can test Kibisis' features by going to [https://kibis-is.github.io/web-extension](https://kibis-is.github.io/web-extension/).

<sup>[Back to top ^][table-of-contents]</sup>

### 4.3. Manifest permissions

| Value              | Version | Justification                                                                                                                                                                                                                |
|--------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<all_urls>`       | 2       | When the extension attempts to scan the QR code of a WalletConnect dapp, the [`tabs.captureVisibleTab()`][capture-visible-tab-api] function is used.                                                                         |
| `activeTab`        | 3       | As above, the extension requires access to the [`tabs.captureVisibleTab()`][capture-visible-tab-api].                                                                                                                        |
| `alarms`           | 3       | A user can switch on a password lock. This feature utilizes the Alarms API as a timeout to lock the extension behind a password.                                                                                             |
| `storage`          | 2 and 3 | The [storage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage) API is used to maintain the state of the extension. It saves encrypted private keys, settings and the lists of AVM assets. |
| `unlimitedStorage` | 2 and 3 | As an n number of accounts/private keys are saved to storage, users that have a lot of accounts will most likely exceed the storage limit.                                                                                   |

<sup>[Back to top ^][table-of-contents]</sup>

## 👏 5. How to contribute

Please read the [**contributing guide**](./CONTRIBUTING.md) to learn about the development process.

<sup>[Back to top ^][table-of-contents]</sup>

## 📄 6. License

Please refer to the [COPYING](./COPYING) file.

<sup>[Back to top ^][table-of-contents]</sup>

<!-- links -->
[capture-visible-tab-api]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/captureVisibleTab
[table-of-contents]: #table-of-contents
