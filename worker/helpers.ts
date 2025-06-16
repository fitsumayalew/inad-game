export interface Prize {
  id: string;
  name: string;
  amount: number;
  isActive: boolean;
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

export interface Settings {
  prizes: Prize[];
  colors: Colors;
  texts: Texts;
  winningProbability: number;
}

export const DEFAULT_PRIZES: Prize[] = [
  {
    id: "1",
    name: "Prize 1",
    amount: 100,
    isActive: true,
  },
  {
    id: "2",
    name: "Prize 2",
    amount: 200,
    isActive: true,
  },
  {
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
    name: "Prize 1",
    amount: 100,
    isActive: false,
  },
];

export const DEFAULT_PRIMARY_COLOR = "#D60007";
export const DEFAULT_SECONDARY_COLOR = "#FFF9EC";

export const DEFAULT_WINNING_PROBABILITY = 0.5;

export const DEFAULT_WIN_TEXT_AM = "YOU WIN";
export const DEFAULT_WIN_TEXT_EN = "YOU WIN";
export const DEFAULT_LOSE_TEXT_AM = "YOU LOSE";
export const DEFAULT_LOSE_TEXT_EN = "YOU LOSE";


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
  };