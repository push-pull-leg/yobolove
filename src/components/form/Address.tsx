import React, { memo, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FormControl, FormHelperText, IconButton, OutlinedInput } from "@mui/material";
import DaumPostcodeEmbed, { Address as DaumAddress } from "react-daum-postcode";
import { ArrowForwardIos, Cancel } from "@mui/icons-material";
import { css } from "@emotion/css";
import { useRouter } from "next/router";
import { FormContext, InputPropsType } from "./Form";
import Label from "./Label";
import LongSwiper from "../LongSwiper";
import AddressType from "../../type/AddressType";
import { toRem } from "../../styles/options/Function";
import EventUtil from "../../util/EventUtil";
import UsePreventBack from "../../hook/UsePreventBack";

const inputClass = css`
    textarea {
        padding: 0 !important;
    }
`;
const inputStyle = css`
    cursor: pointer;

    ::placeholder,
    ::-webkit-input-placeholder {
        color: rgba(0, 0, 0, 0.5);
        opacity: 100;
        font-weight: 400;
    }
`;

/**
 * {@link Address} props
 * @category PropsType
 */
interface AddressPropsInterface extends InputPropsType<AddressType | undefined> {
    /**
     * value change 이벤트
     * @param name input name
     * @param value input value
     */
    onChange?: (name: string, value: AddressType | undefined) => void;
    /**
     * default Value
     */
    defaultValue?: AddressType;
}

/**
 * 주소검색 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=2009%3A101025)
 * @category Form
 */
function Address(props: AddressPropsInterface) {
    const formContext = useContext(FormContext);
    const { handleChangeValue, unmountInput } = formContext;
    const { title, name, defaultValue = undefined, placeholder, variant, required = false, onChange, labelStyle, autoFocus, helperText, disabled, innerRef } = props;
    const isClosing = useRef<boolean>(false);
    const [value, setValue] = useState<AddressType | undefined>(defaultValue);
    const [openSwiper, setOpenSwiper] = useState<boolean>(false);
    const [invalid, setInvalid] = useState<boolean>(required && !defaultValue);
    const router = useRouter();

    const close = useCallback(() => {
        if (disabled) return;
        setOpenSwiper(false);
    }, []);

    const open = useCallback(() => {
        if (disabled) return;
        setOpenSwiper(true);
    }, []);

    UsePreventBack("address", openSwiper, close);

    /**
     * 값이 유효한지 체크하는 validate method. 유효하면 true, 유효하지 않으면 false 를 리턴한다.
     *
     * @param currentValue
     */
    const validate = (currentValue: AddressType | undefined) => {
        const valid = !(required && !currentValue);
        setInvalid(!valid);
        return valid;
    };

    /**
     * 값 초기화
     */
    const reset = () => {
        if (disabled) return;

        isClosing.current = true;
        setValue(undefined);
        const valid = validate(undefined);
        if (onChange !== undefined) {
            onChange(name, undefined);
        }
        if (handleChangeValue) {
            handleChangeValue(name, { value: undefined, isValid: valid });
        }
    };

    /**
     * 다음주소에서 text 형 데이터 추출하기
     * {@link AddressType}에서 roadAddressName, basicTitle 2가지를 가져옴.
     * @param currentValue 다음 주소 타입
     */
    const getTitleFromDaumAddress = (currentValue: DaumAddress): Pick<AddressType, "roadAddressName" | "lotAddressName"> => {
        let roadAddressName = currentValue.address;
        const lotAddressName = currentValue.jibunAddress || currentValue.autoJibunAddress;
        let extraAddress = "";
        if (currentValue.addressType === "R") {
            if (currentValue.bname !== "") {
                extraAddress += currentValue.bname;
            }
            if (currentValue.buildingName !== "") {
                extraAddress += extraAddress !== "" ? `, ${currentValue.buildingName}` : currentValue.buildingName;
            }
            roadAddressName += extraAddress !== "" ? ` (${extraAddress})` : "";
        }

        return { roadAddressName, lotAddressName };
    };

    /**
     * input 값이 변경될 때마다 호출되는 change handler. setValue 를 해준 후, onChange 가 있으면(호출자) onChange 를 호출해준다. forwardValue 가 있으면(form) value 와 isValid 를 넘긴다.
     * defaultValue 를 통해서 들어올 때는 {@link AddressType}, 직접 검색후 변경할 떄는 {@link DaumAddress} 로 들어온다.
     * @param currentValue
     * @Gtm
     */
    const handleChange = (currentValue: DaumAddress | AddressType) => {
        if (disabled) return;

        close();

        let resultValue: AddressType | undefined;
        if (currentValue) {
            if ("roadAddressName" in currentValue) resultValue = currentValue;
            else {
                resultValue = {
                    ...getTitleFromDaumAddress(currentValue as DaumAddress),
                };
            }
        }

        setValue(resultValue);
        if (router && resultValue) {
            if (router.pathname === "/account/desired-work") {
                EventUtil.gtmEvent("click", "condition", "area", resultValue.roadAddressName);
            } else if (router.pathname === "/recruitings") {
                EventUtil.gtmEvent("click", "filterAddress", "board", resultValue.roadAddressName);
            }
        }

        const valid = validate(resultValue);
        onChange?.(name, resultValue);
        handleChangeValue?.(name, { value: resultValue, isValid: valid });
    };

    useEffect(() => {
        const valid = validate(defaultValue);
        if (handleChangeValue) {
            handleChangeValue(name, { value: defaultValue, isValid: valid });
        }
        return () => {
            close();
            if (unmountInput) unmountInput(name);
        };
    }, [name]);

    useImperativeHandle(innerRef, () => ({
        setValue(currentValue: DaumAddress | AddressType | undefined) {
            if (!currentValue) {
                reset();
            } else {
                handleChange(currentValue);
            }
        },
    }));

    return (
        <FormControl fullWidth variant={variant} size="small" required={required}>
            <Label labelStyle={labelStyle} required={required} title={title} id={`date-${name}`} />
            <OutlinedInput
                required={required}
                label={labelStyle === "input" ? title : null}
                sx={{ flex: 1 }}
                size="small"
                readOnly
                value={value?.roadAddressName || value?.lotAddressName || ""}
                name={name}
                id={`address-${name}`}
                placeholder={placeholder}
                endAdornment={
                    !value ? (
                        <ArrowForwardIos sx={{ color: "rgba(0, 0, 0, 0.45)", fontSize: toRem(24) }} />
                    ) : (
                        <IconButton size="small" data-cy="reset" onClick={reset} disabled={disabled}>
                            <Cancel />
                        </IconButton>
                    )
                }
                onClick={() => {
                    if (!isClosing.current) open();

                    isClosing.current = false;
                }}
                role="textbox"
                className={inputClass}
                inputProps={{ "aria-invalid": invalid, className: inputStyle }}
                autoFocus={autoFocus}
                multiline={Boolean(value?.roadAddressName)}
                rows={value?.roadAddressName ? 2 : 1}
                disabled={disabled}
            />
            {helperText && (
                <FormHelperText sx={{ ml: 0 }} color="text.secondary" role="note" component="div">
                    {helperText}
                </FormHelperText>
            )}
            <LongSwiper title="주소검색" open={openSwiper} onClose={close} isRounded={false}>
                <DaumPostcodeEmbed data-cy="navigation" onComplete={handleChange} style={{ height: "100%" }} autoClose={false} {...props} focusInput />
            </LongSwiper>
        </FormControl>
    );
}

Address.defaultProps = {
    onChange: undefined,
    defaultValue: undefined,
};
export default memo(Address);
