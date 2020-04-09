# api spec

## Authentication

#### /auth/login
initialises discord Oauth flow

#### /auth/login/cb
Callback for discord Oauth flow

## Graphql

#### /graphql
graphql endpoint for all information tech.
has playground if not in production

## Patreon

#### /patreon/link
**(needs auth)**
initializes patreon Oauth flow

#### /patreon/unlink
**(needs auth)**
unlinks patreon account from discord account

#### /patreon/link/cb
**(needs auth)**
callback for patreon Oauth flow

#### /patreon/webhook/{webhook_id}
receiver of patreon webhook events
