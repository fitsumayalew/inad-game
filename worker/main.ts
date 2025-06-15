import { DurableObject } from "cloudflare:workers";

interface Prize {
  id: string;
  name: string;
  amount: number;
  isActive: boolean;
}

interface Images {
  cap: string | null;
  header: string | null;
  banner: string | null;
}

interface Texts {
  am: {
    win: string | null;
    lose: string | null;
  };
  en: {
    win: string | null;
    lose: string | null;
  };
}

interface Colors {
  primary: string | null;
  secondary: string | null;
}

interface Settings {
  prizes: Prize[];
  colors: Colors;
  images: Images;
  texts: Texts;
}

function getStartingPrizes(): Prize[] {
  return [{
    id: "1",
    name: "Prize 1",
    amount: 100,
    isActive: false,
  }, {
    id: "2",
    name: "Prize 2",
    amount: 200,
    isActive: false,
  }, {
    id: "3",
    name: "Prize 3",
    amount: 300,
    isActive: false,
  },
  {
    id: "4",
    name: "Prize 4",
    amount: 100,
    isActive: false,
  },
  {
    id: "5",
    name: "Prize 5",
    amount: 100,
    isActive: false,
  },
  {
    id: "6",
    name: "Prize 6",
    amount: 100,
    isActive: false,
  },
  {
    id: "7",
    name: "Prize 7",
    amount: 100,
    isActive: false,
  },
  {
    id: "8",
    name: "Prize 8",
    amount: 100,
    isActive: false,
  }]
}

export class Main extends DurableObject<CloudflareBindings> {
  private prizes: Prize[] = getStartingPrizes();
  private winningProbability: number = 0.5;
  private colors: Colors = {
    primary: null,
    secondary: null,
  };

  private images: Images = {
    cap: null,
    header: null,
    banner: null,
  };

  private texts: Texts = {
    am: {
      win: null,
      lose: null,
    },
    en: {
      win: null,
      lose: null,
    },
  };

  constructor(ctx: DurableObjectState, env: CloudflareBindings) {
    super(ctx, env);

    ctx.blockConcurrencyWhile(async () => {
      // After initialization, future reads do not need to access storage.
      this.prizes = (await ctx.storage.get("prizes")) || getStartingPrizes();
      this.winningProbability = (await ctx.storage.get("winningProbability")) || 0.5;
      this.colors = (await ctx.storage.get("colors")) || {
        primary: null,
        secondary: null,
      };
      this.images = (await ctx.storage.get("images")) || {
        cap: null,
        header: null,
        banner: null,
      };
      this.texts = (await ctx.storage.get("texts")) || {
        am: {
          win: null,
          lose: null,
        },
        en: {
          win: null,
          lose: null,
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
      images: this.images,
      texts: this.texts,
    };
  }

  async setSettings(settings: Settings) {
    this.prizes = settings.prizes;
    this.colors = settings.colors;
    this.images = settings.images;
    this.texts = settings.texts;
    await this.ctx.storage.put("prizes", this.prizes);
    await this.ctx.storage.put("winningProbability", this.winningProbability);
    await this.ctx.storage.put("colors", this.colors);
    await this.ctx.storage.put("images", this.images);
    await this.ctx.storage.put("texts", this.texts);
  }
}
