import findPrimaryPerson from "@/features/people/lib/findPrimaryPerson";
import { supabase } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextValue = {
  /**
   * Internal canonical identifier for the authenticated user.
   * Historically exposed as `session`; both fields are kept in sync.
   */
  userId: string | null;
  /**
   * Backwards-compatible alias for `userId`.
   * Prefer `userId` in new code.
   */
  session: string | null;
  signIn: (userId?: string | null) => void;
  signOut: () => Promise<void>;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  userId: null,
  session: null,
  signIn: () => null,
  signOut: async () => undefined,
  isLoading: false,
  refreshSession: async () => undefined,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export default function SessionProvider(props: PropsWithChildren) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncSession = useCallback((authSession: Session | null) => {
    setUserId(authSession?.user?.id ?? null);
    setIsLoading(false);
  }, []);

  const refreshSession = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Failed to refresh Supabase session", error.message);
      setUserId(null);
      setIsLoading(false);
      return;
    }

    syncSession(data.session);
  }, [syncSession]);

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) {
          return;
        }

        if (error) {
          console.error("Failed to load Supabase session", error.message);
          setUserId(null);
          setIsLoading(false);
          return;
        }

        syncSession(data.session);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        console.error("Unexpected Supabase session error", error);
        setUserId(null);
        setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, authSession) => {
      if (!isMounted) {
        return;
      }

      syncSession(authSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [syncSession]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    void findPrimaryPerson(userId);
  }, [userId]);

  return (
    <AuthContext.Provider
      value={{
        userId,
        session: userId,
        signIn: (nextUserId) => {
          setUserId(nextUserId ?? null);
          setIsLoading(false);
        },
        signOut: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error("Failed to sign out", error.message);
          }
          setUserId(null);
          setIsLoading(false);
        },
        isLoading,
        refreshSession,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
