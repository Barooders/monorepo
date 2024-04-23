# Barooders' monorepo

## Load staging data locally

- Go to https://dashboard.render.com/d/dpg-co3cfo821fec738v4qlg-a/recovery
- Download dump, unzip it and move it to `./dumps/db-staging-backup.sql`
- Run sync with command:

```bash
./load-dump.sh
```

## About monorepos

### Generic information

Before starting, you can read stuff about monorepos:

- [Yarn documentation](https://classic.yarnpkg.com/lang/en/docs/workspaces/)
- [Hoisting and dependencies file structure](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/)

Thinks to know:

- You can run `yarn install` from the root directory or any package containing a `package.json`
- You can run package commands from the root directory. Ex: `yarn workspace backend build` will run the `build` script defined in `packages/backend/package.json`

### Caching

Vercel, Render and Heroku don't handle the caching of node_modules in the same way. Let's dig into each solution:

- Vercel fully support Yarn workspaces, there is no extra config to make dependencies caching to work.
- Render only caches the root `node_modules` folder. Therefore, yarn will re-fetch and re-install package-specific modules, causing slow builds. To fix this, we use $XDG_CACHE_HOME folder to get/store packages node_modules folder before/after running `yarn install` (see [install-for-render.sh](/install-for-render.sh)).
