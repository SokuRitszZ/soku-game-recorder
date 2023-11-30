import { CustomEvent, Game, GamePlugin, GamePluginImpl, LifeCycle } from '@soku-games/core';
import { Tape } from './types.ts';
import { cloneDeep } from './utils.ts';

interface Extra {
  tape: Tape;
}

@GamePluginImpl('the-replayer')
export class TheReplayer extends GamePlugin {
  bindGame(game: Game, extra: Extra) {
    try {
      const start = () => {
        game.prepare(extra.tape.initData ?? '');
        setTimeout(() => {
          game.start();
        });
      };

      // step
      let i = 0;
      const next = () => {
        if (i >= extra.tape.steps.length) return;
        game.forceStep(extra.tape.steps[i++]);
      };

      const snapshots: any[] = [];
      game.subscribe(LifeCycle.BEFORE_STEP, () => {
        snapshots.push(cloneDeep(game.data));
      });
      const back = () => {
        if (snapshots.length === 0) return ;
        game.data = snapshots.pop()!;
        --i;
        game.publish(CustomEvent.CHANGE_SNAPSHOT);
      };

      return {
        start,
        next,
        back,
      };
    }
    catch {
      console.error('`the-replayer` error: you should set a valid tape in extra');
    }
  }
}
