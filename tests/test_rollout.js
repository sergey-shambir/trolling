const {rollout} = require('../index');
const {assert} = require('chai');

describe('rollout function', () => {
    it('provides rollback function to cleanup changes later', async () => {
        const data = {};
        const cb = rollout((rollback) => {
            data.num = 15;
            rollback(() => {
                delete data.num;
            });
            assert.equal(data.num, 15);
        });
        await cb();
        assert.equal(data.num, undefined);
    });

    it('executes rollback procedures in reverse order', async () => {
        const data = {};
        const cb = rollout((rollback) => {
            rollback(() => {
                assert.equal(data.lifo, false);
                assert.equal(data.text, 'Have a nice day!');
            });
            rollback(() => {
                data.lifo = false;
                data.text = 'Have a nice day!';
            });
            data.text = 'You, bastard!';
            data.lifo = true;
        });
        await cb();
        assert.equal(data.num, undefined);
    });

    it('allows async callbacks when rollout and rollback', async () => {
        const data = {};
        const cb = rollout(async (rollback) => {
            rollback(() => {
                return after(0.001, async () => {
                    data.name = 'Galileo Galilei';
                });
            });
            const promise = after(0.05, () => {
                data.name = 'Nicolaus Copernicus';
            });
            data.name = 'Gray Fox';
            return promise;
        });
        const promise = cb();
        assert.equal(data.name, 'Gray Fox');
        await promise;
        assert.equal(data.name, 'Galileo Galilei');
    });
});

function after(seconds, cb) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            Promise.resolve().then(() => {
                return cb();
            }).then(
                (value) => resolve(value),
                (error) => reject(error),
            );
        }, 1000 * seconds);
    });
}
