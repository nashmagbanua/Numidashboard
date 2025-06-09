
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Mantech' | 'Opscrew' | 'Guest';
  createdAt: Date;
  isApproved: boolean;
  user_metadata?: {
    full_name?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
