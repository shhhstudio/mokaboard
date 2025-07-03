import React from "react";
import { App } from "./App";
import { Editor } from "./Editor";
import { Web } from "./Web";

export interface HeaderProps {
    hasLogout?: boolean;
    type?: "default" | "editor" | "web";
}

export const Header: React.FC<HeaderProps> = ({ hasLogout = true, type = "default" }) => {
    if (type === "editor") {
        return <Editor />
    }

    if (type === "web") {
        return <Web />;
    }

    return <App hasLogout={hasLogout} />
};
