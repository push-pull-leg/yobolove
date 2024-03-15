import React, { ChangeEvent, ChangeEventHandler, memo, ReactElement, useContext, useEffect, useMemo, useState } from "react";
import { Box, Button, FormControl, OutlinedInput, Typography } from "@mui/material";
import { CameraAlt, Check } from "@mui/icons-material";
import { css } from "@emotion/css";
import { PhotoSlider } from "react-photo-view";
import { FormContext, InputPropsType } from "./Form";
import Label from "./Label";
import "react-photo-view/dist/react-photo-view.css";
import UseCenterService from "../../hook/UseCenterService";
import UseLoading from "../../hook/UseLoading";
import converterUtil from "../../util/ConverterUtil";

export const wrapperInputStyle = css`
    position: relative;

    input {
        cursor: pointer;
    }
`;

export const fileInputStyle = css`
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;

    * {
        cursor: pointer;
    }

    left: 0;
    opacity: 0;
    z-index: 9;
    pointer-events: none;
`;

/**
 * {@link File} props
 * @category PropsType
 */
interface FilePropsInterface extends InputPropsType<any> {
    /**
     * 기본 값은 string / boolean
     */
    defaultValue?: string | boolean;
    /**
     * onChange 할때 넘기는 value 는 file
     * @param name
     * @param value
     */
    onChange?: (name: string, value: File) => void;
    /**
     * 파일 mime type
     */
    accept?: string;
}

/**
 * 파일 등록 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1875%3A93469)
 * @category Form
 */
function File(props: FilePropsInterface) {
    const { openLoading, closeLoading } = UseLoading();
    const formContext = useContext(FormContext);
    const { getMeDetailCertFile } = UseCenterService();
    const { handleChangeValue, unmountInput } = formContext;
    const { title = "", name, defaultValue, placeholder, variant, required = false, onChange, labelStyle, labelVariant, accept, description } = props;
    const [value, setValue] = useState<File | undefined>(undefined);

    /**
     * image 값이 true 이면 값이 있는건 알지만 어떤 이미지 값인지 모르는상태 > getMeDetailCertFile 를 통해 certFile 데이터를 가져와야함.
     * 현재 해당 로직은 매우 의존적으로 좋지 않은 코드임. 다만 설계가 추후에 어떻게 바뀔지 모르는 상태라 일단 이대로 놔둠
     */
    const [image, setImage] = useState<string | undefined | boolean>(defaultValue);
    const [helperText, setHelperText] = useState<ReactElement | string | undefined>(undefined);
    const [isValid, setIsValid] = useState<boolean>(!(required && !defaultValue));
    const [isVisible, setIsVisible] = useState<boolean>(false);

    /**
     * #### 1. required 일 때 file 이 없으면 invalid
     * #### 2. 파일이 있는데 파일타입이 accept 랑 맞지 않으면 invalid
     *
     * @return boolean
     */
    const validate = (file: File) => {
        if (required) {
            if (!file) {
                setHelperText("기관 증명서 이미지를 등록해주세요.");
                setIsValid(false);
                return false;
            }
        }

        if (file && accept) {
            if (!file.type.includes(accept.replace("*", ""))) {
                setHelperText("사진으로 등록해주세요");
                setIsValid(false);
                return false;
            }
        }
        setHelperText(undefined);
        setIsValid(true);
        return true;
    };

    /**
     * File 타입을 base64 stringify 한 후, Image 변수 저장.
     * javascript 특성상 바로 변환하는건없고 img 태그를 이용해서 실제 로딩이 되는 데이터를 받아와야함.
     * @param file
     */
    const toImage = (file: File | undefined) => {
        if (!file) {
            setImage(undefined);
            return;
        }
        const reader = new FileReader();
        reader.addEventListener(
            "load",
            () => {
                if (reader.result) setImage(reader.result.toString());
            },
            false,
        );

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    /**
     * File 값이 변경될 때 event.target.files 에서 제일 첫번째 파일을 받아와서 데이터 변경 작업.
     * 나중에 multiple file handling 해야될 때 해당 부분 수정.
     * @param e ChangeEvent
     */
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>): void => {
        if (!e || !e.target || !e.target.files || e.target.files.length === 0) {
            return;
        }
        let file: File | undefined = e.target.files[0];
        const valid = validate(file);
        if (!valid) {
            file = undefined;
        }
        setValue(file);
        toImage(file);

        if (onChange && file) {
            onChange(name, file);
        }
        if (handleChangeValue && file) {
            handleChangeValue(name, { value: file, isValid: valid });
        }
    };

    /**
     * file-hidden-input 컴포넌트를 강제로 클릭해서 file change 이벤트를 발생
     */
    const onClick = () => {
        if (document) {
            if (document.getElementById("file-hidden-input")) {
                // @ts-ignore
                document.getElementById("file-hidden-input").click();
            }
        }
    };

    /**
     * 모달 형태의 이미지뷰어 열기.
     * image 값이 스트링이 아닌 true 값일 때는 getMeDetailCertFile 를 통해 이미지 값을 가져옴
     * image 값을 가져온 후, isVisible 을 true 로 만들어서 이미지뷰어 열기
     */
    const openSlider = async (): Promise<void> => {
        if (image === true) {
            openLoading();
            const response = await getMeDetailCertFile();
            closeLoading();
            if (!response) return;
            let base64 = response?.certFileAsBase64;
            if (base64.indexOf("data:") !== 0) {
                base64 = `data:image/jpg;base64,${base64}`;
            }
            setImage(base64);
        }
        setIsVisible(true);
    };

    useEffect(() => {
        const valid = Boolean(defaultValue) || image === true;
        if (handleChangeValue) {
            handleChangeValue(name, { value, isValid: valid });
        }
        return () => {
            if (unmountInput) unmountInput(name);
        };
    }, [name]);
    useEffect(() => {
        if (typeof defaultValue === "string") {
            const imageFile = converterUtil.convertToFile(defaultValue as string, `${name}.png`);
            const valid = validate(imageFile);
            setImage(defaultValue);
            setValue(imageFile);
            setIsValid(true);
            if (handleChangeValue) {
                handleChangeValue(name, { value: imageFile, isValid: valid });
            }
        }
    }, []);

    const fileDom = useMemo<ReactElement>(() => {
        if (image) {
            return (
                <>
                    <OutlinedInput
                        startAdornment={<Check color="success" />}
                        fullWidth
                        value="이미지 등록 완료"
                        readOnly
                        onClick={() => openSlider()}
                        sx={{ cursor: "pointer" }}
                        data-cy="changed-file-input"
                    />
                    <Button size="large" data-cy="changed-file-button" onClick={onClick} variant="outlined" sx={{ flex: "none" }}>
                        변경
                    </Button>
                </>
            );
        }

        return (
            <Button variant="outlined" data-cy="file-button" startIcon={<CameraAlt color="action" />} fullWidth color="inherit" size="large" onClick={onClick}>
                {placeholder}
            </Button>
        );
    }, [image]);
    return (
        <>
            <FormControl fullWidth variant={variant} required={required} size="small">
                <Label labelStyle={labelStyle} required={required} title={title} id={`text-${name}`} labelVariant={labelVariant} />
                {description && (
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 5 }} role="note">
                        {description}
                    </Typography>
                )}
                <Box className={wrapperInputStyle} display="flex" gap={3}>
                    <input
                        type="file"
                        name={name}
                        onChange={handleChange}
                        className={fileInputStyle}
                        accept={accept}
                        id="file-hidden-input"
                        aria-invalid={!isValid}
                        data-cy="file-input"
                    />
                    {fileDom}
                </Box>
                {helperText && (
                    <Box role="note" sx={{ mt: 2 }} textAlign="left">
                        <Typography data-cy="helper-text" color="error" variant="caption">
                            {helperText}
                        </Typography>
                    </Box>
                )}
            </FormControl>
            {typeof image === "string" && (
                <PhotoSlider
                    images={[
                        {
                            src: image || "",
                            key: "1",
                        },
                    ]}
                    visible={isVisible}
                    onClose={() => setIsVisible(false)}
                    index={0}
                />
            )}
        </>
    );
}

File.defaultProps = {
    defaultValue: undefined,
    onChange: undefined,
    accept: "image/*",
};
export default memo(File);
