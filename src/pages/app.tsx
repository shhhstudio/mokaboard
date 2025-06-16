import React from "react";
import { Router } from "@reach/router";
import {
  Profile,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
} from "@/sections/user";
import { useSession } from "@/providers/AuthProvider";
import { Home } from "@/sections/Home";
import { Board } from "@/sections/board";
import type { PageProps } from "gatsby";

const App: React.FC<PageProps> = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const session = useSession();

  if (session === undefined) {
    return <Router></Router>;
  }

  if (session === null) {
    return (
      <Router>
        <Register path="/app/register" />
        <ForgotPassword path="/app/forgot-password" />
        <Login default path="/app/login" />
      </Router>
    );
  }

  return (
    <Router>
      <Profile path="/app/profile" />
      <ResetPassword path="/app/reset-password" />
      {/* @ts-ignore: dynamic route import for reach router */}
      <Board path="/app/board/:uuid" />
      <Home default path="/app" />
    </Router>
  );
};

export default App;
