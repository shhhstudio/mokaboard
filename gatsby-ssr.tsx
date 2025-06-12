import React from "react";
import { AppProvider } from "@/providers/AppProvider";

import type { WrapRootElementNodeArgs, GatsbySSR } from "gatsby";

export const wrapRootElement: GatsbySSR["wrapRootElement"] = ({
  element,
}: WrapRootElementNodeArgs) => <AppProvider>{element}</AppProvider>;
