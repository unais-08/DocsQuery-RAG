import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';

import { env } from '../../config/env.js';
import { prisma } from '../../config/prisma.js';

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

const toPublicUser = ({
  id,
  name,
  email,
  createdAt,
  updatedAt
}: PublicUser): PublicUser => ({ id, name, email, createdAt, updatedAt });

const createToken = (userId: string): string =>
  jwt.sign(
    { sub: userId },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as NonNullable<SignOptions['expiresIn']> }
  );

export const register = async (input: {
  name: string;
  email: string;
  password: string;
}) => {
  const passwordHash = await bcrypt.hash(input.password, 12);

  try {
    const user = await prisma.user.create({
      data: { name: input.name, email: input.email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true }
    });

    return { user: toPublicUser(user), token: createToken(user.id) };
  } catch (error) {
    const prismaError = error as { code?: string } | null;

    if (prismaError && prismaError.code === 'P2002') {
      throw new AuthError('An account with this email already exists', 409, 'EMAIL_IN_USE');
    }

    throw error;
  }
};

export const login = async (input: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  const passwordMatches = user ? await bcrypt.compare(input.password, user.passwordHash) : false;

  if (!user || !passwordMatches) {
    throw new AuthError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  return {
    user: toPublicUser(user),
    token: createToken(user.id)
  };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, createdAt: true, updatedAt: true }
  });

  if (!user) {
    throw new AuthError('User account no longer exists', 401, 'INVALID_TOKEN');
  }

  return user;
};
