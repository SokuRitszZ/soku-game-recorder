import { createSignal, For, Show } from 'solid-js';
import { buildGame, NewGenerator } from '@soku-games/core';

import '..';
import 'soku-game-backgammon/core';
import 'soku-game-backgammon/screen';
import 'soku-game-snake';
import 'soku-game-reversi';
import { Tape } from '../types.ts';

export const App = () => {
  let divRef: HTMLDivElement;
  const [tape, setTape] = createSignal<any>();

  const games = ['snake', 'reversi', 'backgammon'] as const;
  const [gameName, setGameName] = createSignal<string>(games[0]);

  const handleStartGame = () => {
    const game = buildGame({
      name: gameName(),
      plugins: [`${gameName()}-validator`, {
        name: `${gameName()}-screen`,
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
    game?.prepare(NewGenerator(gameName()).generate());
    setTimeout(()=> {
      game?.start();
    });
  };

  const [controller, setController] = createSignal<any>();

  const handleReview = () => {
    if (!tape()) return;
    const game = buildGame({
      name: gameName(),
      plugins: [{
        name: `${gameName()}-screen`,
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
      <div>
        <div>Choose Your Game.</div>
        <For each={games}>
          {(game) => 
            <button onClick={() => setGameName(game)}>{game}</button>
          }
        </For>
        <button style={{ 'margin-left': '20px' }} onClick={handleStartGame}>start</button>
      </div>
      <div>
        <button onClick={handleReview}>review</button>
        <button onClick={() => controller()?.start()}>start</button>
        <button onClick={() => controller()?.next()}>next</button>
        <button onClick={() => controller()?.back()}>back</button>
      </div>
      <Show when={tape()}>
        <div>
          Here is your tape.
        </div>
        <div>
          Now you can click `review` & `start`, try to click `next` & `back`.
        </div>
        <pre style={{
          'max-width': '750px',
          'white-space': 'pre-wrap',
          'word-break': 'break-all',
          'font-family': 'monospace',
        }}>
          {JSON.stringify(tape(), null, '  ')}
        </pre>
      </Show>
    </>
  );
};