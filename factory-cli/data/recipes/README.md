# Shaman Factory Recipes

When using the [generate command]([../README.md#generate-command](https://github.com/iotshaman/shaman-factory/tree/v2#generate-command)), a recipe can be used as a model for the created solution file. The default recipe is as follows:

```json
{
    "recipe": {
        "projects": [{
                "name": "sample-website",
                "environment": "node",
                "template": "node-shaman-website",
                "path": "client",
                "runtimeDependencies": [
                    "sample-server"
                ]
            },
            {
                "name": "sample-database",
                "environment": "node",
                "template": "node-shaman-database",
                "path": "database"
            },
            {
                "name": "sample-library",
                "environment": "node",
                "template": "node-typescript-library",
                "path": "library",
                "include": [
                    "sample-database"
                ]
            },
            {
                "name": "sample-server",
                "environment": "node",
                "template": "node-express-server",
                "path": "server",
                "include": [
                    "sample-database",
                    "sample-library"
                ]
            }
        ],
        "transform": [{
            "targetProject": "sample-server",
            "transformation": "compose:datacontext",
            "sourceProject": "sample-database"
        }]
    }
}
```