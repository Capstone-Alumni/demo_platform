import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthOptions } from 'next-auth';
import axios from 'axios';

export const nextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      type: 'credentials',
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        const payload = {
          email: credentials?.email,
          password: credentials?.password,
        };
        try {
          console.log('nextauth', credentials);
          const response = await axios({
            method: 'POST',
            url: '/api/internal_login',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
            },
            data: payload,
          });
          //   `${process.env.NEXTAUTH_URL}/api/internal_login`,
          //   {
          //     method: 'POST',
          //     body: JSON.stringify(payload),
          //     headers: {
          //       'Content-Type': 'application/json',
          //     },
          //   },
          // ).then(res => res.json());
          console.log('after auth [next auth]', response);

          if (!response.status) {
            return null;
          }
          return response.data;
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    signIn: 'sign_in',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = {
          ...token.user,
          ...user,
        };
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.user;

      return session;
    },
  },
} as AuthOptions;

export default NextAuth(nextAuthOptions);
