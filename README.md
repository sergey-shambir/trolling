# trolling - node library to rollback environment changes in tests

Sometimes you need to interact with environment in tests:

* when you run integrational tests for database layer, you make your database dirt
* when you run end-to-end API tests, you make you backend dirty

This library allows you to define rollback actions in your test cases to keep them clean and (mostly) repeatable.

## Installation

```bash
npm install --save trolling
```

## Example (with mocha)

```js
const {rollout} = require('trolling');

class Client
{
    async createArticle(title) {} // creates article, returns ID
    async deleteArticle(id) {} // deletes article by ID
}

describe('my awesome API', () => {
    // NOTE: here you wrap mocha callback with 'rollout' which provides 'rollback' for you.
    it('can create article', rollout(async (rollback) => {
        const client = Client();
        const articleId = await client.createArticle();
        rollback(async () => {
            await client.deleteArticle(articleId);
        });
    }));
});

```

## Features

This library seamlessly works with any test framework - and tested with mocha.

It has only one powerful `rollout` function which provides `rollback` function. You can:

* attach multiple `rollback` actions - they are always called in FIFO order
* attach sync or async `rollback` actions - `rollout` will wait asynchronously
* throw exception from `rollback` action: in such cases `rollout` continues rollbacks execution and throws exception when all rollbacks was called

Do you need something else? Create an issue, please.

## Best practices for testing and trolling

1. Use this library to rollback changes in your integration or end-to-end tests
2. Run integration and end-to-end tests with rollbacks on developer machine for smoke testing
3. Run the same test suite with CI system for test environment acceptance testing
4. Do not rely on rollbacks - be ready to drop or abandon your environment when something bad happened
