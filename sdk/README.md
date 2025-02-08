# Chaintool: SDK

This folder contains the main AgentKit logic & actions.

## Installation

Clone the repository:

```sh
git clone https://github.com/erhant/chaintools
cd chaintools/sdk
```

We used Bun for this project.

```sh
bun install
```

## Setup

To begin setup, copy `.env.example` as `.env`:

```sh
cp .env.example .env
```

The project uses [CDP](https://portal.cdp.coinbase.com/), so you should first go there and create an API Key. Then, edit the two keys in `.env` accordingly:

- `CDP_API_KEY_NAME`
- `CDP_API_KEY_PRIVATE_KEY`

Our agent will use OpenAI as its model provider, so you should go and create an OpenAI API key as well. WHen you are done, set the following key in `.env`:

- `OPENAI_API_KEY`

That's all!

## Usage

Start the project with:

```sh
bun run ./src/index.ts
```
