

export const NumbersFilter = {
  SameDigits: "same-digits",        
  SameLetters: "same-letters",       
  Mirror: "mirror",                  
  ByRegion: "by-region",             
  LeadingZeros: "leading-zeros"     
} as const;

export type NumbersFilter = typeof NumbersFilter[keyof typeof NumbersFilter];

export type NumbersFilterUnion =
  | "same-digits"
  | "same-letters"
  | "mirror"
  | "by-region"
  | "leading-zeros";
