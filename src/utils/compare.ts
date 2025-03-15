export type Compare_F = <T>(a: T, b: T) => boolean;

// ignore coverage
export const defaultCompare: Compare_F = (a, b) => a === b;
