import * as React from "react";
import { AppProvider } from "@/providers/AppProvider";

import type { WrapRootElementNodeArgs } from "gatsby";

export const wrapRootElement = ({ element }: WrapRootElementNodeArgs) => (
  <AppProvider>{element}</AppProvider>
);
