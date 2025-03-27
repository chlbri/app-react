import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { interpret } from '../interpret';
import { fakeDB, machine2 } from './data';

describe('interpret', () => {
  const { start, useState, send } = interpret(machine2, {
    pContext: {
      iterator: 0,
    },
    context: { iterator: 0, input: '', data: [] },
  });
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});

  const INPUT = 'a';

  const advance =
    (ms = 0) =>
    () => {
      return vi.advanceTimersByTime(ms);
    };

  beforeAll(() => {
    vi.useFakeTimers();
  });

  test('#01 => test object -> all context', async () => {
    const { result } = renderHook(() => useState());

    const initial = {
      context: {
        data: [],
        input: '',
        iterator: 0,
      },
      mode: 'strict',
      status: 'starting',
      event: 'machine$$init',
      value: 'idle',
    };

    expect(result.current).toEqual(initial);
    await act(start);
    expect(result.current).toEqual(initial);
    act(() => send('NEXT'));

    expect(result.current).toStrictEqual({
      ...initial,
      event: {
        payload: {},
        type: 'NEXT',
      },
      mode: 'strict',
      status: 'busy',
      value: {
        working: {
          fetch: 'idle',
          ui: 'idle',
        },
      },
    });

    await act(advance(1000));

    expect(result.current).toStrictEqual({
      context: {
        data: [],
        input: '',
        iterator: 32,
      },
      event: {
        payload: {},
        type: 'NEXT',
      },
      mode: 'strict',
      status: 'working',
      value: {
        working: {
          fetch: 'idle',
          ui: 'idle',
        },
      },
    });
  });

  test('#02 => test number -> context.iterator', async () => {
    const { result } = renderHook(() =>
      useState('context.iterator', (a, b) => a === b),
    );
    expect(result.current).toEqual(32);
  });

  describe('#03 => count log calls', () => {
    test('#01 => length', () => {
      expect(log).toHaveBeenCalledTimes(16);
    });

    test('#02 => Called with the same param "sendPanelToUser"', () => {
      expect(log).toHaveBeenNthCalledWith(10, 'sendPanelToUser');
      expect(log).toHaveBeenNthCalledWith(16, 'sendPanelToUser');
      expect(log).not.toHaveBeenNthCalledWith(17, 'sendPanelToUser');
    });

    test('#03 => Not called with other param', () => {
      expect(log).not.toHaveBeenNthCalledWith(
        1,
        expect.not.stringContaining('sendPanelToUser'),
      );
    });
  });

  test('#04 => test string -> context.input', async () => {
    const { result } = renderHook(() =>
      useState('context.input', (a, b) => a === b),
    );

    expect(result.current).toEqual('');
    act(() => send({ type: 'WRITE', payload: { value: '' } }));
    expect(result.current).toEqual('');
    await act(advance(10_000));
    act(() => send({ type: 'WRITE', payload: { value: INPUT } }));
    expect(result.current).toEqual('');
    await act(advance(10_000));
    act(() => send({ type: 'WRITE', payload: { value: INPUT } }));
    expect(result.current).toEqual('a');
  });

  test('#05 => count log calls', () => {
    expect(log).toHaveBeenCalledTimes(182);
  });

  test('#06 => test array -> context.data', async () => {
    const { result } = renderHook(() => useState('context.data'));

    console.warn('result.current', result.current);
    expect(result.current).toEqual([]);
    act(() => send('FETCH'));
    expect(result.current).toEqual([]);
    await act(advance(10));

    const FAKES = fakeDB.filter(({ name }) => name.includes(INPUT));
    expect(result.current).toEqual(FAKES);

    await act(advance(10_000));
  });

  test('#07 => count log calls', () => {
    expect(log).toHaveBeenCalledTimes(182);
  });
});
