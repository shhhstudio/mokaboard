import React from "react";
import { Heading as ChakraHeading, HeadingProps as ChakraHeadingProps } from "@chakra-ui/react";


export const Heading: React.FC<ChakraHeadingProps> = ({ children }) => (
    <ChakraHeading size="lg" fontWeight={500}>{children}</ChakraHeading>
);
