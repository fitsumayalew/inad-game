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
  Base64Images,
  DEFAULT_IMAGES,
} from "./helpers";



export class Main extends DurableObject<CloudflareBindings> {
  private prizes: Prize[] = DEFAULT_PRIZES;
  private winningProbability: number = DEFAULT_WINNING_PROBABILITY;
  private colors: Colors = {
    primary: DEFAULT_PRIMARY_COLOR,
    secondary: DEFAULT_SECONDARY_COLOR,
  };

  private base64Images: Base64Images = DEFAULT_IMAGES

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

      this.base64Images=(await ctx.storage.get("base64Images")) || DEFAULT_IMAGES
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
      winningProbability:this.winningProbability,
      base64Images:this.base64Images
    };
  }

  async setSettings(settings: Settings) {
    this.prizes = settings.prizes;
    console.log("prizes set");

    this.colors = settings.colors;
    console.log("colors set");

    this.winningProbability = settings.winningProbability;
    console.log("winningProbability set");

    this.texts = settings.texts;
    console.log("texts set");

    this.base64Images = settings.base64Images;
    console.log("base64Images set");


    await this.ctx.storage.put("winningProbability", this.winningProbability);
    console.log("winningProbability stored");
    await this.ctx.storage.put("colors", this.colors);
    console.log("colors stored");
    await this.ctx.storage.put("texts", this.texts);
    console.log("texts stored");
    await this.ctx.storage.put("base64Images", this.base64Images)
    console.log("base64Images stored");
    await this.ctx.storage.put("prizes", this.prizes);
    console.log("prizes stored");
  }
}
