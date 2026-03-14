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

const AuthContext = createContext<{
  signIn: (data?: string | null) => void;
  signOut: () => Promise<void>;
  session?: string | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
}>({
  signIn: () => null,
  signOut: async () => undefined,
  session: null,
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
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncSession = useCallback((authSession: Session | null) => {
    setSession(authSession?.user?.id ?? null);
    setIsLoading(false);
  }, []);

  const refreshSession = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Failed to refresh Supabase session", error.message);
      setSession(null);
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
          setSession(null);
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
        setSession(null);
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

  return (
    <AuthContext.Provider
      value={{
        signIn: (data) => {
          setSession(data ?? null);
          setIsLoading(false);
        },
        signOut: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error("Failed to sign out", error.message);
          }
          setSession(null);
          setIsLoading(false);
        },
        session,
        isLoading,
        refreshSession,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
