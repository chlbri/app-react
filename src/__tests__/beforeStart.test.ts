import sleep from '@bemedev/sleep';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { interpret } from '../interpret';
import { machine2 } from './data';

describe('Before starting', () => {
  const { start, useState, send } = interpret(machine2, {
    pContext: {
      iterator: 0,
    },
    context: { iterator: 0, input: '', data: [] },
  });

  test('#01 => test', async () => {
    const { result } = renderHook(() => useState('context.iterator'));
    console.log(result.current);

    await act(start);

    console.log(result.current);

    act(() => send('NEXT'));

    await act(() => sleep(0));

    console.log(result.current);

    await act(() => sleep(1000));

    console.log(result.current);
  });
});
