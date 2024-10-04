export interface User {
  id: number;
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  rides: Ride[];
  kids: Kid[];
  connections: User[];
  connectedWith: User[];
}

export interface Kid {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    phone?: string; // Optional since it may not always be provided
  }

export interface Ride {
  id: number;
  creator: User;
  creatorId: number;
  title?: string;
  description?: string;
  rideType: string;
  pickupTime?: string;
  pickupAddress: string;
  dropoffAddress: string;
  dropoffTime?: string;
  wouldDrive: boolean;
  seatsOffered: number;
  wantRide: boolean;
  seatsNeeded: number;
  kids: Kid[];
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
  label: string;
  onSelect: React.Dispatch<React.SetStateAction<PlaceType | null>>;
  selectedAddress?: PlaceType | null;
}