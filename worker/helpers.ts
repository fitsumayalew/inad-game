import captxt from "./assets/cap.txt";
import bannertxt from "./assets/banner.txt";
import headertxt from "./assets/header.txt";
import losetxt from "./assets/lose.txt";

export interface Prize {
  id: string;
  name: string;
  amount: number;
  isActive: boolean;
  base64image: string | null;
}

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

export interface Base64Images {
  cap: string;
  header: string;
  banner: string;
  lose: string;
}
export interface Settings {
  prizes: Prize[];
  colors: Colors;
  texts: Texts;
  winningProbability: number;
  base64Images: Base64Images;
}

export const DEFAULT_PRIZES: Prize[] = [
  {
    id: "1",
    name: "Prize 1",
    amount: 100,
    isActive: true,
    base64image: null,
  },
  {
    id: "2",
    name: "Prize 2",
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

export const DEFAULT_PRIMARY_COLOR = "#D60007";
export const DEFAULT_SECONDARY_COLOR = "#FFF9EC";

export const DEFAULT_WINNING_PROBABILITY = 0.5;

export const DEFAULT_WIN_TEXT_AM = "እንኳን ደስ አላቹ!";
export const DEFAULT_WIN_TEXT_EN = "Congratulations!";
export const DEFAULT_LOSE_TEXT_AM =  "እንደገና ይሞክሩ!";
export const DEFAULT_LOSE_TEXT_EN = "Try Again!";

export const DEFAULT_IMAGES: Base64Images = {
  cap: captxt,
  header: headertxt,
  banner: bannertxt,
  lose: losetxt,
};

export const DEFAULT_SETTINGS: Settings = {
  prizes: DEFAULT_PRIZES,
  winningProbability: DEFAULT_WINNING_PROBABILITY,
  colors: {
    primary: DEFAULT_PRIMARY_COLOR,
    secondary: DEFAULT_SECONDARY_COLOR,
  },
  texts: {
    am: {
      win: DEFAULT_WIN_TEXT_AM,
      lose: DEFAULT_LOSE_TEXT_AM,
    },
    en: {
      win: DEFAULT_WIN_TEXT_EN,
      lose: DEFAULT_LOSE_TEXT_EN,
    },
  },
  base64Images: DEFAULT_IMAGES,
};
