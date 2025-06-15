export interface Prize {
  id: string;
  name: string;
  amount: number;
  isActive: boolean;
  image?: string | null;
}

export interface Images {
  cap: string | null;
  header: string | null;
  banner: string | null;
}

export interface Texts {
  am: {
    win: string | null;
    lose: string | null;
  };
  en: {
    win: string | null;
    lose: string | null;
  };
}

export interface Colors {
  primary: string | null;
  secondary: string | null;
}

export interface Settings {
  prizes: Prize[];
  colors: Colors;
  images: Images;
  texts: Texts;
} 