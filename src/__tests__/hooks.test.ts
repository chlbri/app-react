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
    const { result } = renderHook(() => useState.byKey());

    const initial = {
      context: {
        data: [],
        input: '',
        iterator: 0,
      },
      status: 'starting',
      event: {
        payload: {},
        type: 'machine$$init',
      },
      tags: undefined,
      value: 'idle',
    };

    expect(result.current).toEqual(initial);
    await act(start);
    expect(result.current).toEqual({ ...initial, status: 'working' });
    act(() => send('NEXT'));

    expect(result.current).toStrictEqual({
      ...initial,
      event: {
        payload: {},
        type: 'NEXT',
      },
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
      tags: undefined,
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
      useState.byKey('context.iterator', (a, b) => a === b),
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
      useState.byKey('context.input', (a, b) => a === b),
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
    expect(log).toHaveBeenCalledTimes(514);
  });

  test('#06 => test array -> context.data', async () => {
    const { result } = renderHook(() => useState.byKey('context.data'));

    console.warn('result.current', result.current);
    expect(result.current).toEqual([]);
    act(() => send('FETCH'));
    expect(result.current).toEqual([]);
    await act(advance(10));

    const FAKES = fakeDB.filter(({ name }) => name.includes(INPUT));
    expect(result.current).toEqual(FAKES.map(({ name }) => name));

    await act(advance(10_000));
  });

  test('#07 => count log calls', () => {
    expect(log).toHaveBeenCalledTimes(680);
  });

  describe('#08 => useState (selector function)', () => {
    test('#01 => selector -> context.iterator', () => {
      const { result } = renderHook(() =>
        useState(
          state => (state as any).context.iterator,
          (a, b) => a === b,
        ),
      );
      expect(typeof result.current).toBe('number');
    });

    test('#02 => selector -> context.input', () => {
      const { result } = renderHook(() =>
        useState(
          state => (state as any).context.input,
          (a, b) => a === b,
        ),
      );
      expect(result.current).toBe('a');
    });

    test('#03 => selector -> context.data', () => {
      const { result } = renderHook(() =>
        useState(state => (state as any).context.data),
      );
      expect(Array.isArray(result.current)).toBe(true);
    });

    test('#04 => selector -> derived value (iterator * 2)', () => {
      const { result } = renderHook(() =>
        useState(
          state => (state as any).context.iterator * 2,
          (a, b) => a === b,
        ),
      );
      expect(typeof result.current).toBe('number');
    });

    test('#05 => selector reacts to state change', async () => {
      const NEW_INPUT = 'b';
      const { result } = renderHook(() =>
        useState(
          state => (state as any).context.input,
          (a, b) => a === b,
        ),
      );
      act(() => send({ type: 'WRITE', payload: { value: NEW_INPUT } }));
      await act(advance(10_000));
      act(() => send({ type: 'WRITE', payload: { value: NEW_INPUT } }));
      await act(advance(10_000));
      expect(result.current).toBe(NEW_INPUT);
    });
  });

  describe('#09 => addOptions', () => {
    const {
      start: start2,
      useState: useState2,
      addOptions,
    } = interpret(machine2, {
      pContext: { iterator: 0 },
      context: { iterator: 0, input: '', data: [] },
    });

    test('#01 => override inc to +1.5', () => {
      addOptions(({ assign }) => ({
        actions: {
          inc: assign(
            'context.iterator',
            ({ context }) => (context?.iterator ?? 0) + 1.5,
          ),
        },
      }));
    });

    test('#02 => start', start2);
    test('#03 => advance 60ms', () => vi.advanceTimersByTime(60));

    test('#04 => iterator is 1.5', () => {
      const { result } = renderHook(() =>
        useState2.byKey('context.iterator', (a, b) => a === b),
      );
      expect(result.current).toBe(1.5);
    });
  });
});
