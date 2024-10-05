import localforage from 'localforage';

// Initialize LocalForage
localforage.config({
  name: 'InvoiceGeneratorApp',
  storeName: 'users',
});

interface User {
  id: string;
  email: string;
  password: string;
  role: string;
}

const initDatabase = async () => {
  try {
    await localforage.ready();
    console.log('LocalForage is ready');
  } catch (error) {
    console.error('Error initializing LocalForage:', error);
    throw new Error('Failed to initialize database');
  }
};

export const initializeDatabase = async (): Promise<string | null> => {
  await initDatabase();
  try {
    const adminUser = await localforage.getItem('admin');
    if (!adminUser) {
      const tempPassword = Math.random().toString(36).slice(-8);
      const newAdmin: User = {
        id: 'admin-id',
        email: 'mungedijeancy@gmail.com',
        password: tempPassword,
        role: 'admin',
      };
      await localforage.setItem('admin', newAdmin);
      console.log('Admin user created with temporary password:', tempPassword);
      return tempPassword;
    }
    console.log('Admin user already exists');
    return null;
  } catch (error) {
    console.error('Error in initializeDatabase:', error);
    throw new Error('Failed to initialize database');
  }
};

export const getUser = async (email: string): Promise<User | null> => {
  try {
    const users = await localforage.getItem('users') as Record<string, User> | null;
    if (users && users[email]) {
      return users[email];
    }
    const adminUser = await localforage.getItem('admin') as User;
    if (adminUser && adminUser.email === email) {
      return adminUser;
    }
    return null;
  } catch (error) {
    console.error('Error in getUser:', error);
    throw new Error('Failed to retrieve user');
  }
};

export const createUser = async (email: string, password: string, role: string): Promise<void> => {
  try {
    const users = await localforage.getItem('users') as Record<string, User> | null || {};
    if (users[email]) {
      throw new Error('User already exists');
    }
    users[email] = {
      id: Date.now().toString(),
      email,
      password,
      role,
    };
    await localforage.setItem('users', users);
  } catch (error) {
    console.error('Error in createUser:', error);
    throw new Error('Failed to create user');
  }
};

export const updateUserPassword = async (userId: string, newPassword: string): Promise<void> => {
  try {
    const user = await localforage.getItem('admin') as User;
    if (user && user.id === userId) {
      user.password = newPassword;
      await localforage.setItem('admin', user);
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error in updateUserPassword:', error);
    throw new Error('Failed to update user password');
  }
};

export const verifyPassword = async (email: string, password: string, role: string): Promise<boolean> => {
  try {
    const user = await getUser(email);
    if (!user) {
      console.log('User not found:', email);
      return false;
    }
    if (user.role !== role) {
      console.log('Invalid role for user:', email, 'Expected:', role, 'Actual:', user.role);
      return false;
    }
    const isPasswordValid = user.password === password;
    console.log('Password verification result:', isPasswordValid);
    return isPasswordValid;
  } catch (error) {
    console.error('Error in verifyPassword:', error);
    throw new Error('Failed to verify password');
  }
};