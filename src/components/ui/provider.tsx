"use client";
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { system } from "@/theme";

export const Provider = ({ children }: PropsWithChildren) => (
    <ChakraProvider value={system}>{children}</ChakraProvider>
);

