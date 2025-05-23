export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  entries: Record<string, GiveawayEntry>;
}

export interface Giveaway {
  id: string;
  title: string;
  description: string;
  images: string[];
  rules: string;
  createdAt: number;
  endDate: number | null;
  active: boolean;
}

export interface GiveawayEntry {
  id: string;
  giveawayId: string;
  userId: string;
  fullName: string;
  location: string;
  phoneNumber: string;
  message: string;
  submittedAt: number;
  giveawayTitle?: string;
}

export interface AdminState {
  isAuthenticated: boolean;
}