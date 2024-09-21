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