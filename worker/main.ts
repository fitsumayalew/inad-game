import { DurableObject } from "cloudflare:workers";
import {
  DEFAULT_SHUFFLE_PRIZES,
  DEFAULT_SPIN_PRIZES,
  DEFAULT_SHUFFLE_IMAGES,
  DEFAULT_SPIN_IMAGES,
  Settings,
  Base64Images,
  Prize,
  Colors,
  Texts,
  DEFAULT_COLORS,
  DEFAULT_TEXTS,
} from "./helpers";

export class Main extends DurableObject<CloudflareBindings> {
  private shufflePrizes: Prize[] = DEFAULT_SHUFFLE_PRIZES;
  private spinPrizes: Prize[] = DEFAULT_SPIN_PRIZES;
  private shuffleImages: Base64Images = DEFAULT_SHUFFLE_IMAGES;
  private spinImages: Base64Images = DEFAULT_SPIN_IMAGES;
  private shuffleWinningProbability: number = 0.5;
  private spinWinningProbability: number = 0.5;
  private colors: Colors = DEFAULT_COLORS;
  private texts: Texts = DEFAULT_TEXTS;

  constructor(ctx: DurableObjectState, env: CloudflareBindings) {
    super(ctx, env);

    ctx.blockConcurrencyWhile(async () => {
      this.shufflePrizes = (await ctx.storage.get("shufflePrizes")) || DEFAULT_SHUFFLE_PRIZES;
      this.spinPrizes = (await ctx.storage.get("spinPrizes")) || DEFAULT_SPIN_PRIZES;
      this.shuffleImages = (await ctx.storage.get("shuffleImages")) || DEFAULT_SHUFFLE_IMAGES;
      this.spinImages = (await ctx.storage.get("spinImages")) || DEFAULT_SPIN_IMAGES;
      this.shuffleWinningProbability = (await ctx.storage.get("shuffleWinningProbability")) || 0.5;
      this.spinWinningProbability = (await ctx.storage.get("spinWinningProbability")) || 0.5;
      this.colors = (await ctx.storage.get("colors")) || DEFAULT_COLORS;
      this.texts = (await ctx.storage.get("texts")) || DEFAULT_TEXTS;
    });
  }
  async sayHello() {
    return "Hello, world!";
  }

  async getSettings() {
    return {
      shufflePrizes: this.shufflePrizes,
      spinPrizes: this.spinPrizes,
      shuffleImages: this.shuffleImages,
      spinImages: this.spinImages,
      shuffleWinningProbability: this.shuffleWinningProbability,
      spinWinningProbability: this.spinWinningProbability,
      colors: this.colors,
      texts: this.texts,
    };
  }

  async setSettings(settings: Settings) {
    this.shufflePrizes = settings.shufflePrizes;
    this.spinPrizes = settings.spinPrizes;
    this.shuffleImages = settings.shuffleImages;
    this.spinImages = settings.spinImages;
    this.shuffleWinningProbability = settings.shuffleWinningProbability;
    this.spinWinningProbability = settings.spinWinningProbability;
    this.colors = settings.colors;
    this.texts = settings.texts;

    await this.ctx.storage.put("shufflePrizes", this.shufflePrizes);
    await this.ctx.storage.put("spinPrizes", this.spinPrizes);
    await this.ctx.storage.put("shuffleImages", this.shuffleImages);
    await this.ctx.storage.put("spinImages", this.spinImages);
    await this.ctx.storage.put("shuffleWinningProbability", this.shuffleWinningProbability);
    await this.ctx.storage.put("spinWinningProbability", this.spinWinningProbability);
    await this.ctx.storage.put("colors", this.colors);
    await this.ctx.storage.put("texts", this.texts);
  }
}
