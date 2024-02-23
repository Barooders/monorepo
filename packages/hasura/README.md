# Hasura onlydust

## Context

GraphQL is a way of architecturing the presentation layer to let frontend developers write their own query on the data exposed by the backend.
To achieve this, we expose a schema above our database that can be queried to select or mutate data.

You can explore our schema [with graphiql](https://cloud.hasura.io/public/graphiql?endpoint=https%3A%2F%2Fbarooders-production.hasura.app%2Fv1%2Fgraphql).

The graph will change depending on your role.
You can use a different role by setting the correct headers on the request.
For example, you can use this combination:

```
x-hasura-admin-secret: <SECRET_FOUND_ON_HEROKU_ENV_VARS>
x-hasura-role: <ANY_ROLE_YOU_WANT_TO_TEST>
```

## Modify Hasura configuration

Run the console and make changes:

```
yarn hasura:start
```

Then commit changes.

### From source files

Modify your source files, then run `yarn start` to check that everything is well formatted.

## Hasura Auth

### IMPORTANT FOR FIRST DEPLOY

Run the `hasura/auth/init-auth-schema.sql` script on your database to create initial schema (may be optional now that we included it in Prisma migrations)

To manage authentication and roles, we use a forked version of [hasura-auth](https://github.com/Barooders/hasura-auth).
It is based on a database schema `auth` that is created in the `db` docker by Prisma.

Docker compose boot a hasura auth server accessible on http://localhost:4000.
It is configured through env variables.

Resources:

- [Openapi doc](https://editor.swagger.io/?url=https://raw.githubusercontent.com/nhost/hasura-auth/main/docs/openapi.json)
- [JWT decoder](https://jwt.io/)
- [List of env variable](https://github.com/nhost/hasura-auth/blob/main/docs/environment-variables.md)
- [DB schema](https://github.com/nhost/hasura-auth/blob/main/docs/schema.md)

### Changes made in the fork

- Migrations of database and metadata were deactivated in hasura-auth because we now use our own Hasura + Prisma
- Changes were made on the schema to be able to deploy on Heroku
- Little bug fix (should be merged in main repo)
