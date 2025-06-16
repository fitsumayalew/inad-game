import { DurableObject } from "cloudflare:workers";
import {
  DEFAULT_PRIZES,
  DEFAULT_WINNING_PROBABILITY,
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SECONDARY_COLOR,
  DEFAULT_WIN_TEXT_AM,
  DEFAULT_WIN_TEXT_EN,
  DEFAULT_LOSE_TEXT_AM,
  DEFAULT_LOSE_TEXT_EN,
  Prize,
  Settings,
  Colors,
  Texts,
} from "./helpers";




export class Main extends DurableObject<CloudflareBindings> {
  private prizes: Prize[] = DEFAULT_PRIZES;
  private winningProbability: number = DEFAULT_WINNING_PROBABILITY;
  private colors: Colors = {
    primary: DEFAULT_PRIMARY_COLOR,
    secondary: DEFAULT_SECONDARY_COLOR,
  };

  private texts: Texts = {
    am: {
      win: DEFAULT_WIN_TEXT_AM,
      lose: DEFAULT_LOSE_TEXT_AM,
    },
    en: {
      win: DEFAULT_WIN_TEXT_EN,
      lose: DEFAULT_LOSE_TEXT_EN,
    },
  };

  constructor(ctx: DurableObjectState, env: CloudflareBindings) {
    super(ctx, env);

    ctx.blockConcurrencyWhile(async () => {
      // After initialization, future reads do not need to access storage.
      this.prizes = (await ctx.storage.get("prizes")) || DEFAULT_PRIZES;
      this.winningProbability =
        (await ctx.storage.get("winningProbability")) ||
        DEFAULT_WINNING_PROBABILITY;
      this.colors = (await ctx.storage.get("colors")) || {
        primary: DEFAULT_PRIMARY_COLOR,
        secondary: DEFAULT_SECONDARY_COLOR,
      };
      this.texts = (await ctx.storage.get("texts")) || {
        am: {
          win: DEFAULT_WIN_TEXT_AM,
          lose: DEFAULT_LOSE_TEXT_AM,
        },
        en: {
          win: DEFAULT_WIN_TEXT_EN,
          lose: DEFAULT_LOSE_TEXT_EN,
        },
      };
    });
  }
  async sayHello() {
    return "Hello, world!";
  }

  async getSettings() {
    return {
      prizes: this.prizes,
      colors: this.colors,
      texts: this.texts,
    };
  }

  async setSettings(settings: Settings) {
    this.prizes = settings.prizes;
    this.colors = settings.colors;
    this.texts = settings.texts;
    await this.ctx.storage.put("prizes", this.prizes);
    await this.ctx.storage.put("winningProbability", this.winningProbability);
    await this.ctx.storage.put("colors", this.colors);
    await this.ctx.storage.put("texts", this.texts);
  }
}
