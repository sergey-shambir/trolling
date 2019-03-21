declare module 'trolling' {
    type AsyncProcedure = () => void|Promise<void>;
    type RollbackFunction = (action: AsyncProcedure) => void;
    type RolloutCallback = (rollback: RollbackFunction) => void|Promise<void>;

    export function rollout(cb: RolloutCallback): AsyncProcedure;
}

