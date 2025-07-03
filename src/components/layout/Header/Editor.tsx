import React from "react";
import { IconButton, Flex } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa6";
import { navigate } from "gatsby";

export const Editor: React.FC = () => {
    return (
        <Flex
            as="header"
            w="100%"
            bg="moka.800"
            px={4}
            py={2}
            align="center"
            justify="space-between"
            boxShadow="xs"
            minH={"30px"}
        >
            <IconButton
                aria-label="Back"
                variant="ghost"
                size="sm"
                borderRadius="full"
                onClick={() => navigate("/app")}
            >
                <FaArrowLeft />
            </IconButton>
        </Flex>
    );
};
