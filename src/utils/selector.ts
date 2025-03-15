export type Selector_F = <Input, Output>(value: Input) => Output;

export const defaultSelector: Selector_F = <Input, Output>(
  value: Input,
) => {
  return value as unknown as Output;
};
