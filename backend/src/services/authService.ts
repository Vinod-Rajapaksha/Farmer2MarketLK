import { User, IUser, UserRole } from '../models/User';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/generateToken';

export const registerUser = async (data: any) => {
  const { name, email, password, phone, district, role } = data;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    passwordHash: hashedPassword,
    phone,
    district,
    role,
  });

  const token = generateToken(user._id as unknown as string, user.role);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await comparePassword(password, user.passwordHash);

  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id as unknown as string, user.role);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select('-passwordHash');
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};