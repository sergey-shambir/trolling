declare module 'trolling' {
    type RollbackAction = () => void|Promise<void>;
    type RollbackFunction = (action: RollbackAction) => void;
    type RolloutCallback = (rollback: RollbackFunction) => void|Promise<void>;

    export function rollout(cb: RolloutCallback): void|Promise<void>;
}
