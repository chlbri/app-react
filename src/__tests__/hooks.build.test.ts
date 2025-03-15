import { addTarball, cleanup } from '@bemedev/build-tests';
import { this1 } from '@bemedev/build-tests/constants';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import type { interpret } from '../interpret';
import { fakeDB, machine2, type Machine2 } from './data';

describe('interpret', () => {
  let tester: typeof interpret;

  const log = vi.spyOn(console, 'log').mockImplementation(() => {});

  const INPUT = 'a';

  type RR = ReturnType<typeof interpret<Machine2>>;

  let start: RR['start'],
    useState: RR['useState'],
    send: RR['send'],
    selector: RR['selector'];

  const advance =
    (ms = 0) =>
    () => {
      return vi.advanceTimersByTime(ms);
    };

  beforeAll(async () => {
    addTarball();
    tester = await import(this1).then(({ interpret }) => interpret);

    ({ start, useState, send, selector } = tester(machine2, {
      pContext: {
        iterator: 0,
      },
      context: { iterator: 0, input: '', data: [] },
    }));

    vi.useFakeTimers();
  });

  afterAll(cleanup);

  test('#01 => test object -> all context', async () => {
    const { result } = renderHook(() => useState());

    const initial = {
      context: {
        data: [],
        input: '',
        iterator: 0,
      },
      mode: 'strict',
      scheduleds: 0,
      status: 'starting',
      value: 'idle',
    };

    expect(result.current).toEqual(initial);
    await act(start);
    expect(result.current).toEqual(initial);
    act(() => send('NEXT'));
    expect(result.current).toEqual(initial);
    await act(advance(100));
    expect(result.current).toEqual({
      ...initial,
      scheduleds: 7,
      status: 'working',
      value: {
        working: {
          fetch: 'idle',
          ui: 'idle',
        },
      },
    });
    await act(advance(1000));
    expect(result.current).toEqual({
      context: {
        data: [],
        input: '',
        iterator: 36,
      },
      mode: 'strict',
      scheduleds: 76,
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
    const select = selector('context.iterator');
    const { result } = renderHook(() =>
      useState(select, (a, b) => a === b),
    );
    expect(result.current).toEqual(36);
  });

  describe('#03 => count log calls', () => {
    test('#01 => length', () => {
      expect(log).toHaveBeenCalledTimes(18);
    });

    test('#02 => Called with the same param "sendPanelToUser"', () => {
      expect(log).toHaveBeenNthCalledWith(10, 'sendPanelToUser');
      expect(log).toHaveBeenNthCalledWith(18, 'sendPanelToUser');
      expect(log).not.toHaveBeenNthCalledWith(19, 'sendPanelToUser');
    });

    test('#03 => Not called with other param', () => {
      expect(log).not.toHaveBeenNthCalledWith(
        1,
        expect.not.stringContaining('sendPanelToUser'),
      );
    });
  });

  test('#04 => test string -> context.input', async () => {
    const select = selector('context.input');
    const { result } = renderHook(() =>
      useState(select, (a, b) => a === b),
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
    expect(log).toHaveBeenCalledTimes(184);
  });

  test('#06 => test array -> context.data', async () => {
    const select = selector('context.data');
    const { result } = renderHook(() => useState(select));

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
    expect(log).toHaveBeenCalledTimes(184);
  });
});
