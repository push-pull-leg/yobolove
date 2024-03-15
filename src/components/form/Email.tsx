import React, { ChangeEvent, ChangeEventHandler, ReactElement, useContext, useEffect, useRef, useState } from "react";
import { Box, FormControl, IconButton, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { FormContext, FormContextInterface, InputPropsType } from "./Form";
import Label from "./Label";
import WithGenericMemo from "../../hoc/WithGenericMemo";

const EMAIL_REGEX = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/;

/**
 * 이메일 도메인 기본 설정 값. direct > 직접입력
 */
const EMAIL_DOMAIN_LABEL: { [key: string]: string } = {
    "naver.com": "naver.com",
    "daum.net": "daum.net",
    "hanmail.net": "hanmail.net",
    "gmail.com": "gmail.com",
    direct: "직접입력",
};

type emailValueType = { emailId: string; domain: string; directDomain: string };

const DEFAULT_EMAIL_VALUE: emailValueType = {
    emailId: "",
    domain: "",
    directDomain: "",
};

/**
 * 이메일 입력 컴포넌트. 도메인 주소를 선택 및 직접 입력 가능.
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1875%3A93469)
 * @category Form
 */
function Email(props: InputPropsType) {
    const formContext = useContext<FormContextInterface>(FormContext);
    const { handleChangeValue, unmountInput } = formContext;
    const { title = "", name, defaultValue = "", placeholder, variant, required = false, onChange, endAdornment, labelStyle, maxLength, autoFocus, labelVariant } = props;

    /**
     * emailId, domain, directDomain 의 초기값을 만들기 위한 함수를 담은 useRef
     */
    const initialEmailValue = useRef<emailValueType>(
        (() => {
            if (!defaultValue) return DEFAULT_EMAIL_VALUE;

            const splitDefaultValue = defaultValue.split("@");

            if (!splitDefaultValue[1])
                return {
                    emailId: splitDefaultValue[0],
                    domain: "",
                    directDomain: "",
                };

            const isDefaultDomainIncludedInDomainLabel = Object.keys(EMAIL_DOMAIN_LABEL).includes(splitDefaultValue[1]);

            return {
                emailId: splitDefaultValue[0],
                domain: isDefaultDomainIncludedInDomainLabel ? splitDefaultValue[1] : "direct",
                directDomain: isDefaultDomainIncludedInDomainLabel ? "" : splitDefaultValue[1],
            };
        })(),
    );
    const isEmailChanged = useRef(false);

    const [email, setEmail] = useState<emailValueType>(initialEmailValue.current);
    const { emailId, domain, directDomain } = email;

    const [isValid, setIsValid] = useState<boolean>(!(required && !EMAIL_REGEX.test(defaultValue || "")));
    const [helperText, setHelperText] = useState<ReactElement | undefined>(undefined);

    /**
     * required 일 떄 값이 없으면, invalid. 이 떄 helper text 로 설정해줌.
     * EMAIL_REGEX 에 맞지 않으면 invalid
     *
     *
     * @return boolean
     * @param newEmailAddress
     */
    const validate = (newEmailAddress: string) => {
        setHelperText(undefined);
        if (required) {
            if (!newEmailAddress) {
                setIsValid(false);
                setHelperText(
                    <Typography data-cy="helper-text" variant="caption" color="error">
                        값을 입력해주세요
                    </Typography>,
                );
                return false;
            }
        }

        if (!EMAIL_REGEX.test(newEmailAddress)) {
            setHelperText(
                <Typography data-cy="helper-text" variant="caption" color="error">
                    이메일 형식으로 입력해주세요
                </Typography>,
            );
            if (required) {
                setIsValid(false);
                return false;
            }
        }
        setIsValid(true);
        return true;
    };

    /**
     * 새로 받은 값에 맞춰 이메일 주소 형태(emailId + @ + 도메인값) 제작
     *
     * @param newEmailId
     * @param newDomain
     * @param newDirectDomain
     */
    const convertEmailAddress = (newEmail: emailValueType) => {
        const { emailId: newEmailId, domain: newDomain, directDomain: newDirectDomain } = newEmail;
        const result = `${newEmailId}@${newDomain === "direct" ? newDirectDomain : newDomain}`;

        return result === "@" ? "" : result;
    };

    /**
     * 새로운 형성된 이메일을 필요에 따라 처리
     * - 새 값에 맞는 이메일 형식 만들기
     * - validation 체크
     * - props로 넘겨받은 함수에 값 전달 등
     */
    const handleChangeEmail = (newEmail: emailValueType) => {
        if (!isEmailChanged.current) isEmailChanged.current = true;

        const newEmailAddress = convertEmailAddress(newEmail);
        const valid = validate(newEmailAddress);

        onChange?.(name, newEmailAddress);
        handleChangeValue?.(name, { value: newEmailAddress, isValid: valid });
    };

    /**
     * 아이디 영역 변경 handler
     * @param e
     */
    const handleChangeEmailId: ChangeEventHandler<HTMLInputElement> = ({ currentTarget: { value: newEmailId } }: ChangeEvent<HTMLInputElement>) => {
        const newEmail = { ...email, emailId: newEmailId.replace(/ /, "") };

        setEmail(newEmail);
        handleChangeEmail(newEmail);
    };

    /**
     * 도메인 영역 변경 handler
     * @param e
     */
    const handleChangeDomain = ({ target: { value: newDomain } }: SelectChangeEvent<string>) => {
        const newEmail = { ...email, domain: newDomain, directDomain: newDomain !== "direct" && directDomain ? "" : directDomain };

        setEmail(newEmail);
        handleChangeEmail(newEmail);
    };

    /**
     * 도메인 직접 작성 영역 변경 handler
     * @param e
     */
    const handleChangeDirectDomain = ({ currentTarget: { value: newDirectDomain } }: ChangeEvent<HTMLInputElement>) => {
        const newEmail = { ...email, directDomain: newDirectDomain.replace(/ /, "") };

        setEmail(newEmail);
        handleChangeEmail(newEmail);
    };

    /**
     * 초기화
     */
    const reset = () => {
        setEmail(DEFAULT_EMAIL_VALUE);
    };

    useEffect(() => {
        const valid = validate(defaultValue);
        handleChangeValue?.(name, { value: defaultValue, isValid: valid });

        return () => {
            if (unmountInput) unmountInput(name);
        };
    }, [name]);

    return (
        <>
            <FormControl fullWidth variant={variant} required={required} size="small">
                <Label labelStyle={labelStyle} required={required} title={title} id={`text-${name}`} labelVariant={labelVariant} />
                <OutlinedInput
                    type="text"
                    label={labelStyle === "input" ? title : null}
                    value={emailId}
                    id={`text-${name}`}
                    fullWidth
                    name={name}
                    placeholder={placeholder}
                    required={required}
                    margin="dense"
                    size="small"
                    endAdornment={
                        !emailId ? (
                            endAdornment
                        ) : (
                            <IconButton size="small" data-cy="reset-button" onClick={reset}>
                                <Cancel />
                            </IconButton>
                        )
                    }
                    onChange={handleChangeEmailId}
                    autoFocus={autoFocus}
                    inputProps={{
                        maxLength,
                        "aria-invalid": `${!isValid}`,
                    }}
                    error={Boolean(emailId) && Boolean(helperText)}
                    data-cy="type-input"
                />
            </FormControl>
            <Box>
                <Box display="flex" flex={1} alignItems="center" gap={1.5}>
                    <Typography color="text" variant="subtitle1">
                        @
                    </Typography>
                    <Select
                        label=""
                        displayEmpty
                        value={domain}
                        onChange={handleChangeDomain}
                        sx={{ flex: 1 }}
                        required={required}
                        data-cy="email-select"
                        renderValue={domainKey => {
                            if (!domainKey) {
                                return <em>이메일 뒷주소 선택</em>;
                            }
                            return EMAIL_DOMAIN_LABEL[domainKey];
                        }}
                        error={Boolean(emailId) && Boolean(helperText)}
                    >
                        {Object.keys(EMAIL_DOMAIN_LABEL).map((domainKey: string) => (
                            <MenuItem value={domainKey} key={domainKey}>
                                {EMAIL_DOMAIN_LABEL[domainKey]}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                {domain === "direct" && (
                    <TextField
                        margin="dense"
                        size="small"
                        variant="outlined"
                        title="직접입력"
                        onChange={handleChangeDirectDomain}
                        required={required}
                        data-cy="direct-input"
                        fullWidth
                        value={directDomain}
                    />
                )}
                {helperText && isEmailChanged.current && (
                    <Box role="note" sx={{ mt: 2 }} textAlign="left">
                        {helperText}
                    </Box>
                )}
            </Box>
        </>
    );
}

Email.defaultProps = {
    type: "email",
};
export default WithGenericMemo(Email);
