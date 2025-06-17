import React, { useRef, useState } from "react";
import { Textarea, TextareaProps } from "@chakra-ui/react";

interface EditableTextProps extends Omit<TextareaProps, "onChange" | "value"> {
    value?: string;
    onChange?: (v: string) => void;
    placeholder?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({ value, onChange, placeholder = "Type something...", ...rest }) => {
    const [isFocused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(value);
    const ref = useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        setInternalValue(value || "");
    }, [value]);

    return (
        <Textarea
            ref={ref}
            value={internalValue}
            onChange={(e) => setInternalValue(e.target.value)}
            placeholder={placeholder}
            autoresize
            resize="none"
            bgColor="transparent"
            rows={1}
            whiteSpace="pre-wrap"
            px={0}
            py={0}
            marginTop={1.5}
            overflowWrap="break-word"
            width="100%"
            border="none"
            _focus={{ border: "none", outline: "none" }}
            _focusVisible={{ border: "none", outline: "none" }}
            _readOnly={{
                userSelect: "none",
                cursor: "text",
            }}
            readOnly={!isFocused}
            onClick={() => {
                setFocused(true);
                ref.current?.focus();
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => {
                setFocused(false);
                if (onChange && internalValue !== undefined) {
                    const cleaned = internalValue.replace(/^[\s\u200B\u200C\u200D\uFEFF]+|[\s\u200B\u200C\u200D\uFEFF]+$/g, "");
                    setInternalValue(cleaned);
                    if (cleaned !== value) {
                        onChange(cleaned);
                    }
                }
            }}
            onKeyDown={(e) => {
                if (e.key === "Escape") {
                    e.preventDefault();
                    setInternalValue(value);
                    ref.current?.blur();
                } else if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    ref.current?.blur();
                }
            }}
            {...rest}
        />
    );
};
