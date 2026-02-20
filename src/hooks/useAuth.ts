import { useContext } from 'react';
import { AuthContext } from '@/components/providers/AuthProvider';
import type { AuthContextValue } from '@/components/providers/AuthProvider';

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
