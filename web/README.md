# Chaintool: Web UI

## Installation

```sh
git clone https://github.com/erhant/chaintools
cd chaintools/web
```

Install all dependencies:

```sh
pnpm install
```

## Setup

To begin setup, copy `.env.example` as `.env`:

```sh
cp .env.example .env
```

The project uses [CDP](https://portal.cdp.coinbase.com/), so you should first go there and create a project & get your Client API key and set the environment variable in `.env`:

- `VITE_PUBLIC_ONCHAINKIT_API_KEY`

## Usage

Just run with:

```sh
pnpm run dev
```
