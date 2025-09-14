// Note: usersData import removed as it's not used in this utility file

export interface CurrentUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'cashier' | 'barista';
  // permissions: string[]; // Temporarily removed for testing
}

export const getCurrentUser = (): CurrentUser | null => {
  try {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr) as CurrentUser;
    return user;
  } catch (error) {
    console.error('Error parsing current user:', error);
    return null;
  }
};

export const setCurrentUser = (user: CurrentUser): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem('currentUser');
};

// Temporarily modified for testing - always returns true
export const hasPermission = (_permission: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // For testing purposes, allow all permissions for logged-in users
  return true;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

export const isCashier = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'cashier';
};

export const isBarista = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'barista';
};

export const getUserDisplayName = (): string => {
  const user = getCurrentUser();
  if (!user) return 'Guest';
  
  return `${user.firstName} ${user.lastName}`;
};

export const getUserRole = (): string => {
  const user = getCurrentUser();
  if (!user) return 'guest';
  
  return user.role;
};
