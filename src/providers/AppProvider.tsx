"use client";
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { system } from "@/theme";
import { AuthProvider } from "@/providers/AuthProvider";

export const AppProvider = ({ children }: PropsWithChildren) => (
  <ChakraProvider value={system}>
    <AuthProvider>{children}</AuthProvider>
  </ChakraProvider>
);
