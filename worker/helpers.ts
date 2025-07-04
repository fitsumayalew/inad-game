import captxt from "./assets/cap.txt";
import bannertxt from "./assets/banner.txt";
import headertxt from "./assets/header.txt";
import losetxt from "./assets/lose.txt";
import backCaptxt from "./assets/backcap.txt";
import wheeltxt from "./assets/wheel.txt?raw"

export interface Prize {
  id: string;
  name: string;
  amount: number;
  isActive: boolean;
  base64image: string | null;
}

export interface Base64Images {
  cap: string;
  header: string;
  banner: string;
  lose: string;
  lose2: string;
  backCap: string;
  wheel: string;
}

// Shared between both games
export interface Texts {
  am: {
    win: string;
    lose: string;
  };
  en: {
    win: string | null;
    lose: string | null;
  };
}

export interface Colors {
  primary: string;
  secondary: string;
}

// Settings for both games
export interface Settings {
  shufflePrizes: Prize[];
  spinPrizes: Prize[];
  shuffleImages: Base64Images;
  spinImages: Base64Images;
  shuffleWinningProbability: number;
  spinWinningProbability: number;
  colors: Colors; // shared
  texts: Texts;   // shared
}

// Default prizes for Shuffle
export const DEFAULT_SHUFFLE_PRIZES: Prize[] = [
  {
    id: "1",
    name: "Shuffle Prize 1",
    amount: 100,
    isActive: true,
    base64image: null,
  },
  {
    id: "2",
    name: "Shuffle Prize 2",
    amount: 200,
    isActive: true,
    base64image: null,
  },
  {
    id: "3",
    name: "Prize 3",
    amount: 300,
    isActive: false,
    base64image: null,
  },
  {
    id: "4",
    name: "Prize 4",
    amount: 100,
    isActive: false,
    base64image: null,
  },
  {
    id: "5",
    name: "Prize 5",
    amount: 100,
    isActive: false,
    base64image: null,
  },
  {
    id: "6",
    name: "Prize 6",
    amount: 100,
    isActive: false,
    base64image: null,
  },
  {
    id: "7",
    name: "Prize 7",
    amount: 100,
    isActive: false,
    base64image: null,
  },
  {
    id: "8",
    name: "Prize 1",
    amount: 100,
    isActive: false,
    base64image: null,
  },
];

// Default prizes for Spin
export const DEFAULT_SPIN_PRIZES: Prize[] = [
  {
    id: "1",
    name: "Spin Prize 1",
    amount: 150,
    isActive: true,
    base64image: null,
  },
  {
    id: "2",
    name: "Spin Prize 2",
    amount: 250,
    isActive: true,
    base64image: null,
  },
  {
    id: "3",
    name: "Prize 3",
    amount: 300,
    isActive: false,
    base64image: null,
  },
  {
    id: "4",
    name: "Prize 4",
    amount: 100,
    isActive: false,
    base64image: null,
  },
  {
    id: "5",
    name: "Prize 5",
    amount: 100,
    isActive: false,
    base64image: null,
  },
  {
    id: "6",
    name: "Prize 6",
    amount: 100,
    isActive: false,
    base64image: null,
  },
  {
    id: "7",
    name: "Prize 7",
    amount: 100,
    isActive: false,
    base64image: null,
  },
  {
    id: "8",
    name: "Prize 1",
    amount: 100,
    isActive: false,
    base64image: null,
  },
];

// Default images for Shuffle
export const DEFAULT_SHUFFLE_IMAGES: Base64Images = {
  cap: captxt,
  header: headertxt,
  banner: bannertxt,
  lose: losetxt,
  lose2: losetxt,
  backCap: backCaptxt,
  wheel: "",
};

// Default images for Spin
export const DEFAULT_SPIN_IMAGES: Base64Images = {
  cap: "",
  header: "",
  banner: "",
  lose: "",
  lose2: "",
  backCap: "",
  wheel: wheeltxt
};

export const DEFAULT_PRIMARY_COLOR = "#D60007";
export const DEFAULT_SECONDARY_COLOR = "#FFF9EC";

export const DEFAULT_WINNING_PROBABILITY = 0.5;

export const DEFAULT_WIN_TEXT_AM = "እንኳን ደስ አላቹ!";
export const DEFAULT_WIN_TEXT_EN = "Congratulations!";
export const DEFAULT_LOSE_TEXT_AM =  "እንደገና ይሞክሩ!";
export const DEFAULT_LOSE_TEXT_EN = "Try Again!";

export const DEFAULT_COLORS: Colors = {
  primary: DEFAULT_PRIMARY_COLOR,
  secondary: DEFAULT_SECONDARY_COLOR,
};

export const DEFAULT_TEXTS: Texts = {
  am: {
    win: DEFAULT_WIN_TEXT_AM,
    lose: DEFAULT_LOSE_TEXT_AM,
  },
  en: {
    win: DEFAULT_WIN_TEXT_EN,
    lose: DEFAULT_LOSE_TEXT_EN,
  },
};

export const DEFAULT_SETTINGS: Settings = {
  shufflePrizes: DEFAULT_SHUFFLE_PRIZES,
  spinPrizes: DEFAULT_SPIN_PRIZES,
  shuffleImages: DEFAULT_SHUFFLE_IMAGES,
  spinImages: DEFAULT_SPIN_IMAGES,
  shuffleWinningProbability: DEFAULT_WINNING_PROBABILITY,
  spinWinningProbability: DEFAULT_WINNING_PROBABILITY,
  colors: DEFAULT_COLORS,
  texts: DEFAULT_TEXTS,
};
