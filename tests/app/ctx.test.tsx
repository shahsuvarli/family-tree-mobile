import SessionProvider, { useSession } from "@/app/ctx";
import { supabase } from "@/lib/supabase/client";
import React from "react";
import { act, create } from "react-test-renderer";

jest.mock("@/lib/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

type SessionContextValue = ReturnType<typeof useSession>;

let latestSessionContext: SessionContextValue | undefined;

function SessionProbe() {
  latestSessionContext = useSession();
  return null;
}

async function flushAsyncWork() {
  await act(async () => {
    await Promise.resolve();
  });
}

describe("SessionProvider", () => {
  const mockedAuth = supabase.auth as unknown as {
    getSession: jest.Mock;
    onAuthStateChange: jest.Mock;
    signOut: jest.Mock;
  };

  beforeEach(() => {
    latestSessionContext = undefined;
    jest.clearAllMocks();
  });

  it("loads the active session and reacts to auth state changes", async () => {
    let authStateChangeHandler:
      | ((event: string, session: { user: { id: string } } | null) => void)
      | undefined;
    const unsubscribe = jest.fn();

    mockedAuth.getSession.mockResolvedValue({
      data: { session: { user: { id: "user-1" } } },
      error: null,
    });
    mockedAuth.onAuthStateChange.mockImplementation((handler) => {
      authStateChangeHandler = handler;
      return {
        data: {
          subscription: { unsubscribe },
        },
      };
    });

    let tree: ReturnType<typeof create>;

    await act(async () => {
      tree = create(
        <SessionProvider>
          <SessionProbe />
        </SessionProvider>
      );
      await Promise.resolve();
    });

    expect(latestSessionContext?.isLoading).toBe(false);
    expect(latestSessionContext?.session).toBe("user-1");

    act(() => {
      authStateChangeHandler?.("SIGNED_OUT", null);
    });

    expect(latestSessionContext?.session).toBeNull();

    act(() => {
      tree.unmount();
    });

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("supports refreshSession, signIn, and signOut flows", async () => {
    const unsubscribe = jest.fn();

    mockedAuth.getSession
      .mockResolvedValueOnce({
        data: { session: null },
        error: null,
      })
      .mockResolvedValueOnce({
        data: { session: { user: { id: "user-2" } } },
        error: null,
      });
    mockedAuth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: { unsubscribe },
      },
    });
    mockedAuth.signOut.mockResolvedValue({ error: null });

    await act(async () => {
      create(
        <SessionProvider>
          <SessionProbe />
        </SessionProvider>
      );
      await Promise.resolve();
    });

    expect(latestSessionContext?.session).toBeNull();

    act(() => {
      latestSessionContext?.signIn("manual-user");
    });

    expect(latestSessionContext?.session).toBe("manual-user");

    await act(async () => {
      await latestSessionContext?.refreshSession();
    });

    expect(latestSessionContext?.session).toBe("user-2");

    await act(async () => {
      await latestSessionContext?.signOut();
    });

    expect(mockedAuth.signOut).toHaveBeenCalledTimes(1);
    expect(latestSessionContext?.session).toBeNull();

    await flushAsyncWork();
  });
});
