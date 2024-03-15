import React, { ReactElement, useContext, useMemo, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Box, Button, FormControl, OutlinedInput } from "@mui/material";
import { Check } from "@mui/icons-material";
import { dialogRecoilState } from "../recoil/DialogRecoil";
import SignInput from "./form/SignInput";
import Label from "./form/Label";
import { FormContext, InputPropsType } from "./form/Form";
import { Undefinable } from "../type/Undefinable";
import { Base64SignType } from "../type/Base64ImageType";
import { fileInputStyle, wrapperInputStyle } from "./form/File";

function SignInputButton(props: InputPropsType<Base64SignType>) {
    const { title = "", name, defaultValue, placeholder = "서명 작성하기", variant, required = false, labelStyle, labelVariant } = props;
    const formContext = useContext(FormContext);
    const setDialogRecoil = useSetRecoilState(dialogRecoilState);
    const [value, setValue] = useState<Undefinable<Base64SignType>>(defaultValue);
    const { handleChangeValue } = formContext;

    const onClick = () => {
        setDialogRecoil({
            open: true,
            title: "구인 담당자 서명",
            content: (
                <SignInput
                    name={name}
                    onConfirmClick={(dataUrl, isValid) => {
                        setDialogRecoil({ open: false });
                        setValue(dataUrl);
                        handleChangeValue?.(name, { value: dataUrl, isValid });
                    }}
                    defaultValue={value}
                    required
                />
            ),
            hasConfirmButton: false,
        });
    };

    const SignDom = useMemo<ReactElement>(() => {
        if (value) {
            return (
                <>
                    <OutlinedInput
                        startAdornment={<Check color="success" />}
                        fullWidth
                        value="서명 입력 완료"
                        readOnly
                        onClick={onClick}
                        sx={{ cursor: "pointer" }}
                        data-cy="changed-sign-input"
                        name={name}
                        required={required}
                    />
                    <Button size="large" data-cy="changed-sign-button" onClick={onClick} variant="outlined" sx={{ flex: "none" }}>
                        수정
                    </Button>
                </>
            );
        }
        return (
            <Button variant="outlined" data-cy="sign-button" fullWidth color="inherit" size="large" onClick={onClick}>
                {placeholder}
            </Button>
        );
    }, [value]);

    return (
        <FormControl fullWidth variant={variant} required={required} size="small">
            <Label labelStyle={labelStyle} required={required} title={title} id={`text-${name}`} data-cy="signature-label" labelVariant={labelVariant} />
            <Box className={wrapperInputStyle} display="flex" gap={3}>
                {SignDom}
                <input name={name} defaultValue={value || ""} className={fileInputStyle} required={required} id="file-hidden-input" data-cy="sign-input" />
            </Box>
        </FormControl>
    );
}

export default SignInputButton;

SignInputButton.defaultProps = {
    isLoading: false,
};
