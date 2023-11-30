import { createEffect, createSignal, onMount } from 'solid-js';
import { buildGame, NewGenerator } from '@soku-games/core';

import '..';
import 'soku-game-backgammon/core';
import 'soku-game-backgammon/screen';
import 'soku-game-reversi';
import { Tape } from '../types.ts';

export const App = () => {
  let divRef: HTMLDivElement;
  const [tape, setTape] = createSignal<any>();

  const gameName = 'reversi';

  onMount(() => {
    const game = buildGame({
      name: gameName,
      plugins: [`${gameName}-validator`, {
        name: `${gameName}-screen`,
        extra: {
          el: divRef,
          couldControl: [true, true],
          emit: (stepStr: string) => {
            game?.step(stepStr);
          },
        },
      }, {
        name: 'the-recorder',
        extra: {
          tapeResolved: (tape: Tape) => {
            setTape(tape);
          },
        },
      }],
    });
    game?.prepare(NewGenerator(gameName).generate());
    setTimeout(()=> {
      game?.start();
    });
  });

  const [controller, setController] = createSignal<any>();

  const handleReview = () => {
    if (!tape()) return;
    const game = buildGame({
      name: gameName,
      plugins: [{
        name: `${gameName}-screen`,
        extra: {
          el: divRef,
          couldControl: [false, false],
          emit: (stepStr: string) => {
            game?.step(stepStr);
          },
        },
      }, {
        name: 'the-replayer',
        extra: {
          tape: tape(),
        },
      }],
    });
    setController(game?.bundler);
  };

  createEffect(() => {
    console.log('bundler', controller());
  });

  return (
    <>
      <div
        ref={el => divRef = el}
        style={{
          width: '1200px',
          'aspect-ratio': '16 / 9',
          'background-color': '#000',
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
        }}
      />
      <button onClick={handleReview}>Review</button>
      <button onClick={() => controller()?.start()}>start</button>
      <button onClick={() => controller()?.next()}>next</button>
      <button onClick={() => controller()?.back()}>back</button>
    </>
  );
};