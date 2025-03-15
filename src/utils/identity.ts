export type Identity_F = <T>(value: T) => T;

export const identity: Identity_F = value => value;
