export interface Kid {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    phone?: string; // Optional since it may not always be provided
  }

export interface UserConnection {
    id: number;
    firstName: string;
    lastName: string;
  }

export interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}

export interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}

export interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
}

export interface SelectAddressProps {
  onSelect: React.Dispatch<React.SetStateAction<PlaceType | null>>;
}