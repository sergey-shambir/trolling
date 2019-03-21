# trolling - node library to rollback environment changes in tests

Sometimes you need to interact with environment in tests:

* when you run integrational tests for database layer
* when you run end-to-end API tests

This library allows you to define rollback actions in your test cases to keep them clean and (mostly) repeatable.

Library seamlessly works with mocha tests and other test frameworks.

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

This library has only one `rollout` function which provides `rollback` function. You can:

* attach multiple `rollback` actions - they are always called in FIFO order
* attach sync or async `rollback` actions - `rollout` will wait asynchronously
* throw exception from `rollback` action: in such cases `rollout` continues rollbacks execution and throws exception when all rollbacks was called
