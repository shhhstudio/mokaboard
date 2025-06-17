import './src/wdyr';
import React from "react";
import { AppProvider } from "@/providers/AppProvider";

import type { GatsbyBrowser } from "gatsby";

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({ element }) => (
    <AppProvider>{element}</AppProvider>
);
