import * as React from "react";
import { createContext, FormEvent, ReactElement, useEffect, useMemo, useState } from "react";
import { Box, Button, TypographyVariant } from "@mui/material";
import { useRouter } from "next/router";
import WithGenericMemo from "../../hoc/WithGenericMemo";
import EventUtil from "../../util/EventUtil";

export type HelperType = {
    message: string;
    error: boolean;
};

/**
 * InputPropsType
 * @type InputPropsType
 */
export type InputPropsType<T = string> = {
    /**
     * 제목
     */
    title?: string | ReactElement;
    /**
     * name
     */
    name: string;
    /**
     * 기본값
     */
    defaultValue?: T;
    /**
     *  variant
     */
    variant?: "standard" | "filled" | "outlined";
    /**
     *  placeholder
     */
    placeholder?: string;
    /**
     *  placeholder
     */
    required?: boolean;
    /**
     *  필수값 여부. default는 false
     */
    disabled?: boolean;
    /**
     *  최대값. default는 undefined
     */
    maxLength?: number;
    /**
     *  값이 변할 때 마다 호출되는 change handler method
     */
    onChange?: (name: string, value: T, extra?: any) => void;
    /**
     *  input field 앞쪽에 있는 element
     */
    startAdornment?: ReactElement | string;
    /**
     *  input field 뒤쪽에 있는 element
     */
    endAdornment?: ReactElement | string;
    /**
     *  label style
     */
    labelStyle?: "input" | "form";
    /**
     *  label labelVariant
     */
    labelVariant?: TypographyVariant;
    /**
     *  labelColor
     */
    labelColor?: string;
    /**
     *  자동 포커스
     */
    autoFocus?: boolean;
    /**
     *  helper message
     */
    helperText?: ReactElement | string;
    isPopup?: boolean;
    description?: string;
    onClick?: () => void;
    onValidate?: (value: T | undefined) => Promise<boolean> | boolean;
    innerRef?: React.Ref<{ setValue(value: T): void }>;
};
export const defaultInputProps: InputPropsType = {
    title: "",
    name: "",
    defaultValue: "",
    placeholder: "",
    variant: "outlined",
    required: false,
    disabled: false,
    maxLength: 0,
    onChange: undefined,
    startAdornment: undefined,
    endAdornment: undefined,
    labelStyle: "input",
    labelVariant: "subtitle1",
    autoFocus: false,
    helperText: undefined,
    isPopup: false,
    description: undefined,
    onClick: undefined,
    onValidate: undefined,
    innerRef: undefined,
};

/**
 * forwardValue 가 inject 된 input child 들의 정보를 받는 interface
 */
export interface InputValueInterface {
    /**
     해당 input child 의 값
     */
    value: any | undefined;
    /**
     해당 input child 의 valid 여부
     */
    isValid: boolean;
}

/**
 * FormContext Interface
 * @interface
 */
export interface FormContextInterface {
    handleChangeValue?: (name: string, inputValue: InputValueInterface) => void | undefined;
    submit: Function | undefined;
    unmountInput: Function | undefined;
}

/**
 * FormContext init
 */
export const FormContext = createContext<FormContextInterface>({
    handleChangeValue: undefined,
    submit: undefined,
    unmountInput: undefined,
});

/**
 * FormContext init
 */
export const FormContextPopup = createContext<FormContextInterface>({
    handleChangeValue: undefined,
    submit: undefined,
    unmountInput: undefined,
});

/**
 * FormPropsType
 * @type FormPropsType
 */
type FormPropsType<T = object> = {
    /**
     * <form>태그안에 랜더링될 input 을 포함한 다양한 element
     */
    children?: ReactElement | ReactElement[];
    /**
     * 하단 버튼 텍스트
     */
    buttonText?: string;
    /**
     * 추가 parameter 값
     */
    parameter?: object;
    /**
     * submit 받는 함수. form에서 받은 데이터를 받아온다.
     */
    onSubmit?: (params: T) => any;
    /**
     * 팝업 boolean 여부
     */
    isPopup?: boolean;
    /**
     * 팝업 boolean 여부
     */
    disabled?: boolean;
    onChange?: (name: string, value: any) => void;
    defaultValid?: boolean;
};

/**
 * Form 을 통한 Axios http 통신 컴포넌트. children 에 input 을 받을 때, forwardValue method 를 inject 해서 child input 들의 변화값을 받아온다.
 * 받아온 값들에 대해 validation 을 진행함. submit 시 onSubmit 함수에서 return false 및 preventDefault 를 한 후, HttpUtl.call 을 호출한다.
 * @function
 *
 * @param props FormPropsType: Form Props
 *
 * @return <form>
 *
 */
function Form<T extends object>(props: FormPropsType<T>) {
    const { children, isPopup, disabled, onChange, defaultValid } = props;
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [inputValues] = useState<Map<string, InputValueInterface>>(new Map<string, InputValueInterface>());
    const router = useRouter();

    useEffect(() => {
        if (defaultValid !== undefined) {
            setIsFormValid(defaultValid);
            return;
        }
        let IsFormValid = true;
        inputValues.forEach(inputValueInterface => {
            IsFormValid = inputValueInterface.isValid && IsFormValid;
        });
        setIsFormValid(IsFormValid);
    }, []);

    /**
     * form 의 onSubmit 이벤트를 핸들링하는 method. e.preventDefault 를 통해 기본동작을 차단. input child 의 값들을 params object 에 넣어서 http 호출을 한다.
     *
     * @param e FormEvent
     */
    const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        if (disabled) return;

        const { parameter, onSubmit } = props;
        if (!onSubmit) return;

        const params: { [key: string]: any } = { ...parameter };

        inputValues.forEach((inputValue, name) => {
            params[name] = inputValue.value;
        });
        /**
         * onSubmit prop 가 넘어오면 onSubmit validation 을 진행한 후 false 면 return;
         */
        const requestParams = params as T;
        onSubmit(requestParams);

        if (router) {
            if (router.pathname === "/signup") {
                EventUtil.gtmEvent("click", "tryReceive", "signup", "0");
            } else if (router.pathname === "/account/desired-work") {
                EventUtil.gtmEvent("click", "save", "work", "0");
            }
        }
    };

    /**
     * input child 에서 여러가지 항목들의 전달받는 method. value, isValid 등 form 에 필요한 여러가지 데이터를 받는다.
     * 값 변경시 마다 호출
     *
     * @param name input child 의 name
     * @param inputValue input Value
     */

    const handleChangeValue = (name: string, inputValue: InputValueInterface): void => {
        if (inputValues.has(name)) {
            if (onChange) onChange(name, inputValue.value);
            inputValues.set(name, Object.assign(inputValues.get(name), inputValue));
            let IsFormValid = true;
            inputValues.forEach(inputValueInterface => {
                IsFormValid = inputValueInterface.isValid && IsFormValid;
            });

            setIsFormValid(IsFormValid);
        } else {
            inputValues.set(name, inputValue);
            if (!inputValue.isValid) {
                setIsFormValid(false);
            }
        }
    };

    const unmountInput = (name: string): void => {
        if (!inputValues.has(name)) return;

        inputValues.delete(name);
        let IsFormValid = true;
        inputValues.forEach(inputValueInterface => {
            IsFormValid = inputValueInterface.isValid && IsFormValid;
        });
        setIsFormValid(IsFormValid);
    };

    const { buttonText } = props;
    const formContextValue = useMemo(() => ({ handleChangeValue, submit: handleSubmit, unmountInput }), [handleChangeValue, handleSubmit, unmountInput]);

    const FormProvider = useMemo(() => {
        if (isPopup) {
            return FormContextPopup.Provider;
        }
        return FormContext.Provider;
    }, []);
    return (
        <Box component="form" autoComplete="off" onSubmit={handleSubmit} display="flex" flexDirection="column" maxWidth="sm" gap={6} sx={{ m: "0 auto" }} width="100%">
            <FormProvider value={formContextValue}>
                {children}
                {buttonText && (
                    <Button type="submit" variant="contained" data-cy="submit-button" size="large" role="button" disabled={!isFormValid} fullWidth>
                        {buttonText}
                    </Button>
                )}
            </FormProvider>
        </Box>
    );
}

Form.defaultProps = {
    children: undefined,
    parameter: {},
    onSubmit: undefined,
    buttonText: undefined,
    isPopup: false,
    disabled: false,
    onChange: undefined,
    defaultValid: undefined,
};
export default WithGenericMemo(Form);
