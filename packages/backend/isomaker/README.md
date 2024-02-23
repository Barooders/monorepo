# Isomaker

Script to copy Collections and (soon) metadata to staging store.

## Install

- Create a `.env` file like `.env.example` with `Isomaker` app tokens

## Usage

- Run `deno run --allow-net --allow-read --allow-env index.ts`

## Good to know

- Metafield sync is commented, there is still work to do, so changes to
  metafields need to be manually implemented
- You can activate more logs by switching on `DEBUG` env variable to true
