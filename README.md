> A very basic template for node app using typescript.

## Getting start

```
// or npm install if you are using npm.
$ yarn
$ yarn run ts:build
$ yarn run serve:dev
```
now the server is listening on port 4001 of your localhost.

### node scripts

You can find there are 6 scripts in package.json, which means:

```
start:         build & serve.
serve:         start the server using production configuration.
serve:dev:     start the server using development configuration.
serve:watch:   watch the built code and auto restart when changed using development configuration.
ts:build:      build project.
ts:watch:      build and watch on typescript code
dev:           watch on both ts and built code
```

### Configuration

It reads a yaml file named `env.yaml` and load the configuration.

You can also add another configuration file named as `env.{NODE_ENV}.yaml`,
which will be merged with `env.yaml` and override if same key existing.

```yaml
port: 3000   # PORT your server will be listening on.
APP_KEY:     # random key for encrypt your session.
log:
  level: silly # https://github.com/winstonjs/winston#logging-levels
  span: day  # all/day/week/month, used to split log file.
oauth:       # OAuth config.
  enabled:   # true/false to toggle
```

> Only few NODE_ENV values are valid, there are production, development, lab, staging.
>
> For using your configuration in application, see [lodash](https://lodash.com/docs/4.17.11#set)

### developing

> Highly recommend you use [visual studio code](https://code.visualstudio.com/) to develop because it provides better integration environment for typescript, lint, debug.

The current structure is just a template, you can mutate as how as you want.

1. Define unprovided types in `src/types` folder.
2. `routes/*.ts` for normal routes and oauth required routes.
3. `app.use(serveStaticFiles())` can determine whether serve static files.
