import React from "react";
import { Router } from "@reach/router";
import { Profile, Login, Register, ForgotPassword, ResetPassword } from "@/sections/user";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import type { PageProps } from "gatsby";

const App: React.FC<PageProps> = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const session = useRequireAuth();

  if (!session) {
    return (
      <Router>
        <Login default />
        <Register path="/app/register" />
        <ForgotPassword path="/app/forgot-password" />
      </Router>
    );
  }

  return (
    <Router>
      <Profile default path="/app/profile" />
      <ResetPassword path="/app/reset-password" />
    </Router>
  );
};

export default App;
