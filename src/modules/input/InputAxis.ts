import { InputEvents, Input } from '@needle-tools/engine';

export class InputAxis {
  positive: string | undefined;
  negative: string | undefined;

  value: number = 0;

  constructor(positive: string, negative: string, input: Input) {
    this.positive = positive;
    this.negative = negative;
    input.addEventListener(InputEvents.KeyDown, (e) => {
      if (e.key === this.positive) this.value += 1;
      if (e.key === this.negative) this.value += -1;
    });
    input.addEventListener(InputEvents.KeyUp, (e) => {
      if (e.key === this.positive) this.value -= 1;
      if (e.key === this.negative) this.value -= -1;
    });
  }
}
