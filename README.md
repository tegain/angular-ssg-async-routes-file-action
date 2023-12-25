# Angular SSG Async routes file action

GitHub Action to fetch Angular routes from an API and save it to a file for SSG builds.

Heavily based on [https://github.com/gautemo/fetch-api-data-action](https://github.com/gautemo/fetch-api-data-action).

## Inputs

### `url`
**Required** The url to fetch routes from.

### `type`
Expected Response type ("json" or "text"). Default `json`

### `file`
The file data is saved to. Default `routesFile.txt`

### `debug`
Debug mode: logs additional informations - "true" or "false". Default `false`

## Example usage

Use this action **before** the "Build" step in your workflow, as Angular will need the routes file to build the application.

### Configure Angular SSG build options

In your `angular.json` file, set the `routesFile` property to the `file` option value:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "prerender": {
              "routesFile": "routesFile.txt"
            }
          }
        }
      }
    }
  }
}
```

More information on Angular SSG configuration: [Angular Docs](https://angular.dev/guide/prerendering#prerendering-parameterized-routes)

### With JSON API response:

```json
[
"posts/1",
"posts/2",
"posts/3",
"posts/4",
"posts/5",
"posts/6"
]
```

```
uses: tegain/angular-ssg-async-routes-file-action@1.0.0
with:
  url: 'https://my-api.com/angular-routes'
  file: 'folder/to/routes.txt'
```

### With Text API response and debug mode:

```text
posts/1
posts/2
posts/3
posts/4
posts/5
posts/6
```

```
uses: tegain/angular-ssg-async-routes-file-action@1.0.0
with:
  url: 'https://my-api.com/angular-routes'
  file: 'folder/to/routes.txt'
  type: 'text'
  debug: 'true'
```
