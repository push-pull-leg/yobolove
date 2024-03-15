import { ReactElement, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { Box, Button, Typography } from "@mui/material";
import { FormContext, FormContextPopup, InputPropsType } from "./Form";
import { Base64SignType } from "../../type/Base64ImageType";
import { Undefinable } from "../../type/Undefinable";
import theme from "../../styles/Theme";

interface SignInputProps extends Omit<InputPropsType<Undefinable<Base64SignType>>, "placeholder" | "onChange"> {
    signInputCanvasSize?: { width: number; height: number };
    placeholder?: string | ReactElement;
    hasButtons?: boolean;
    onChange?: (dataUrl: Undefinable<Base64SignType>, isValid: boolean) => void;
    onConfirmClick?: (dataUrl: Undefinable<Base64SignType>, isValid: boolean) => void;
}

function SignInput({
    name,
    signInputCanvasSize = { width: 406, height: 406 },
    defaultValue,
    placeholder = "여기에 서명을 그려주세요",
    required,
    disabled,
    innerRef,
    isPopup,
    hasButtons = true,
    onChange,
    onConfirmClick,
}: SignInputProps) {
    const formContext = useContext(isPopup ? FormContextPopup : FormContext);
    const { width, height } = signInputCanvasSize;
    const { handleChangeValue, unmountInput } = formContext;
    const [value, setValue] = useState<Undefinable<Base64SignType>>(defaultValue);
    const [isValid, setIsValid] = useState<boolean>(!required || !!defaultValue);
    const [isDrawn, setIsDrawn] = useState<boolean>(!!defaultValue);
    const canvas = useRef<HTMLCanvasElement>(null);
    const signPad = useRef<SignaturePad>();

    const handleBeginStroke = useCallback(() => {
        setIsDrawn(true);
    }, [setIsDrawn]);

    const updateValueAndIsValid = (valueNew: Base64SignType | undefined) => {
        setValue(valueNew);
        const isValidNew = !required || !!valueNew;
        setIsValid(isValidNew);
        setIsDrawn(!!valueNew);
        onChange?.(valueNew, isValidNew);
        handleChangeValue?.(name, { value: valueNew, isValid: isValidNew });
    };
    const handleChange = (dataUrl: string | undefined) => {
        if (value === dataUrl) {
            return;
        }
        const valueNew = dataUrl ? (dataUrl as Base64SignType) : undefined;
        updateValueAndIsValid(valueNew);
    };

    const handlePointerOut = () => {
        if (!signPad.current || disabled) return;
        const dataUrl = signPad.current?.toDataURL();
        handleChange(dataUrl);
    };

    useEffect(() => {
        if (canvas.current && !signPad.current) {
            signPad.current = new SignaturePad(canvas.current);
            signPad.current.addEventListener("beginStroke", handleBeginStroke);
            if (value) {
                signPad.current.fromDataURL(value, { ratio: 1, width, height });
            }
        }

        return () => {
            signPad.current?.removeEventListener("beginStroke", handleBeginStroke);
            signPad.current?.clear();
        };
    }, [disabled]);

    useEffect(() => () => unmountInput?.(name), [name]);

    const handleClearClick = () => {
        handleChange(undefined);
        signPad.current?.clear();
    };

    const handleConfirmClick = () => {
        if (!isValid) {
            return;
        }
        handleChangeValue?.(name, { value, isValid });
        onConfirmClick?.(value, isValid);
    };

    useImperativeHandle(innerRef, () => ({
        setValue(currentValue: string | undefined) {
            handleChange(currentValue);
        },
    }));

    return (
        <Box>
            <Box
                position="relative"
                width={width}
                height={height}
                sx={{
                    backgroundColor: disabled ? theme.palette.text.disabled : undefined,
                    opacity: disabled ? 0.25 : 1,
                    border: `1px solid ${disabled ? theme.palette.text.disabled : "#0000003B"}`,
                    borderRadius: 1,
                    pointerEvents: disabled ? "none" : "auto",
                }}
            >
                <canvas id={`sign-input-canvas-${name}`} ref={canvas} aria-label={`sign-input-canvas-${name}`} onPointerOut={handlePointerOut} width={width} height={height} />
                {!isDrawn && !value && (
                    <Box
                        position="fixed"
                        sx={{
                            textAlign: "center",
                            position: "absolute",
                            top: "50%",
                            left: 0,
                            right: 0,
                            margin: "auto",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                        }}
                    >
                        {typeof placeholder === "string" ? (
                            <Typography variant="subtitle1" color="#00000061">
                                {placeholder}
                            </Typography>
                        ) : (
                            placeholder
                        )}
                    </Box>
                )}
            </Box>
            {hasButtons && (
                <Box display="flex" gap={3} sx={{ mt: 7 }}>
                    <Button disabled={disabled} variant="outlined" size="large" role="button" data-cy="clear-sign" fullWidth onClick={handleClearClick}>
                        지우기
                    </Button>
                    <Button variant="contained" color="primary" size="large" role="button" data-cy="confirm-sign" fullWidth onClick={handleConfirmClick}>
                        확인
                    </Button>
                </Box>
            )}
        </Box>
    );
}

SignInput.defaultProps = {
    signInputCanvasSize: { width: 406, height: 406 },
    placeholder: undefined,
    hasButtons: true,
    onChange: undefined,
    onConfirmClick: undefined,
};

export default SignInput;
