"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function TestLoginPage() {
  const { data: session } = useSession();

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Test Google Login</h1>

      {session ? (
        <div>
          <p>Welcome, {session.user?.name}!</p>
          <p>Email: {session.user?.email}</p>
          <p>MongoDB ID: {(session.user as any).id}</p>
          <button onClick={() => signOut()} style={{ marginTop: "1rem" }}>
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <button
            onClick={() =>
              signIn("google", {
                callbackUrl: "/recipes", 
              })
            }
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}
