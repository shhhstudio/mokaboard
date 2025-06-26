import React, { useRef, useLayoutEffect, useState } from "react";
import { Input, Box, InputProps } from "@chakra-ui/react";

interface EditableLineProps extends Omit<InputProps, "onChange" | "value"> {
    defaultValue?: string;
    onChange?: (s: string) => void;
    minWidth?: number;
    fontFamily?: string;
    fontSize?: string | number;
    fontWeight?: string | number;
    lineHeight?: string | number;
}

export function EditableLine({
    defaultValue = "",
    onChange,
    minWidth = 1,
    fontFamily = "inherit",
    fontSize = "inherit",
    fontWeight = "inherit",
    lineHeight = "inherit",
    ...props
}: EditableLineProps) {
    const ghostRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputWidth, setInputWidth] = useState<number>(minWidth);

    // Set initial width on mount
    useLayoutEffect(() => {
        if (ghostRef.current) {
            ghostRef.current.textContent = defaultValue || props?.placeholder || " ";
            setInputWidth(Math.max(minWidth, ghostRef.current.scrollWidth));
        }
    }, [defaultValue, minWidth, fontFamily, fontSize, fontWeight, lineHeight]);

    // Update width on input
    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        if (ghostRef.current) {
            ghostRef.current.textContent = e.currentTarget.value || props?.placeholder || " ";
            setInputWidth(Math.max(minWidth, ghostRef.current.scrollWidth));
        }
    };

    // Commit on blur or Enter/Escape
    const commitChange = (e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
        const cleaned = (inputRef.current?.value || "").replace(/^[\s\u200B\u200C\u200D\uFEFF]+|[\s\u200B\u200C\u200D\uFEFF]+$/g, "");
        if (inputRef.current) inputRef.current.value = cleaned;
        if (onChange && inputRef.current) {
            // Create a synthetic event with the correct target
            const event = {
                ...e,
                target: inputRef.current,
                currentTarget: inputRef.current,
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(event.target.value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            e.preventDefault();
            if (inputRef.current) {
                inputRef.current.value = defaultValue;
                if (ghostRef.current) {
                    ghostRef.current.textContent = defaultValue || props?.placeholder || " ";
                    setInputWidth(Math.max(minWidth, ghostRef.current.scrollWidth));
                }
                inputRef.current.blur();
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            inputRef.current?.blur();
        }
    };

    return (
        <Box position="relative" display="inline-block" height="100%">
            <Input
                ref={inputRef}
                defaultValue={defaultValue}
                onInput={handleInput}
                position="relative"
                width={`${inputWidth}px`}
                overflow="hidden"
                whiteSpace="nowrap"
                border="none"
                outline="none"
                _focus={{ border: "none", outline: "none" }}
                _focusVisible={{ border: "none", outline: "none" }}
                padding={0}
                minWidth={minWidth + "px"}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                lineHeight={lineHeight}
                onBlur={commitChange}
                onKeyDown={handleKeyDown}
                height="100%"
                {...props}
            />
            <Box
                ref={ghostRef}
                position="absolute"
                top={0}
                left={0}
                zIndex={-1}
                whiteSpace="pre"
                fontSize={fontSize}
                fontFamily={fontFamily}
                fontWeight={fontWeight}
                lineHeight={lineHeight}
                padding={0}
                minWidth={minWidth + "px"}
                visibility="hidden"
            >
                {defaultValue || props?.placeholder || " "}
            </Box>
        </Box>
    );
}
