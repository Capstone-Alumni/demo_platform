import 'next-auth';
import { User } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    id?: string;
    accessToken?: string;
    user: {
      id: string;
      accessLevel?: string;
      accessStatus?: string;
      accessMode?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id?: string;
    accessToken?: string;
    user_id: string;
    user: User & {
      accessLevel?: string;
      accessStatus?: string;
      accessMode?: string;
    };
  }
}
