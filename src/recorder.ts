import { Game, GamePlugin, GamePluginImpl, LifeCycle } from '@soku-games/core';
import { Tape } from './types.ts';

interface Extra {
  tapeResolved?: (tape: Tape) => void;
}

@GamePluginImpl('the-recorder')
export class TheRecorder extends GamePlugin {
  bindGame(game: Game, extra?: Extra): void {
    const tape: Record<string, any> = {
      steps: <string[]>[],
    };
    game.subscribe(LifeCycle.BEFORE_PREPARE, (initData: string) => {
      tape.initData = initData;
    });
    game.subscribe(LifeCycle.BEFORE_STEP, (stepStr: string) => {
      tape.steps.push(stepStr);
    });
    game.subscribe(LifeCycle.AFTER_END, (reason: string) => {
      tape.reason = reason;
      extra?.tapeResolved?.(tape as Tape);
    });
  }
}
