
class RollbackChain
{
    constructor()
    {
        this.rollbacks = [];
    }

    /**
     * Adds new rollback procedure into rollback chain
     * @param {CallableFunction} cb - sync or async procedure, takes no args
     *  and returns void or Promise<void>
     */
    rollback(cb)
    {
        this.rollbacks.push(cb);
    }

    async applyRollbacks()
    {
        // Execute asynchronous rollbacks and collect errors
        const errors = [];
        while (this.rollbacks.length > 0)
        {
            const rollback = this.rollbacks.pop();
            try
            {
                await rollback();
            }
            catch (e)
            {
                errors.push(e);
            }
        }
        if (errors.length > 0)
        {
            throw new Error(mergeErrors(errors));
        }
    }
};

function mergeErrors(errors)
{
    let reasons = [];
    for (let e of errors)
    {
        reasons.push(e && e.message || String(e));
    }
    return reasons.join('\n');
}

/**
 * Rollouts async function which changes environment (database, webservice, etc.)
 *  and supplies 'rollback' function which registers callbacks to cleanup
 *   (i.e. rollback) changes.
 * 
 * @param {CallableFunction} cb - sync or async procedure, takes 'rollback'
 *  function in first argument and returns void or Promise<void>
 */
function rollout(cb)
{
    return async() => {
        const chain = new RollbackChain();
        const rollback = chain.rollback.bind(chain);
        try
        {
            await cb(rollback);
        }
        finally
        {
            await chain.applyRollbacks();
        }
    }
}

module.exports.rollout = rollout;
