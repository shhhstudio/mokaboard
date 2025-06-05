import * as React from "react";
import { Provider } from "@/components/ui/provider";

import type { WrapRootElementNodeArgs } from "gatsby";

export const wrapRootElement = ({ element }: WrapRootElementNodeArgs) => (
    <Provider>{element}</Provider>
);
