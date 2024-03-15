import { FormLabel, InputLabel, SxProps, Typography, TypographyVariant } from "@mui/material";
import React, { ReactElement } from "react";
import { Theme } from "@mui/material/styles";

/**
 * {@link Label} props
 * @category PropsType
 */
type LabelPropsType = {
    /**
     * 라벨 스타일
     */
    labelStyle?: "input" | "form";
    /**
     * 라벨의 typpovariant
     */
    labelVariant?: TypographyVariant;
    /**
     * 텍스트
     */
    title?: string | ReactElement;
    /**
     * 특정 인풋과 연결시키기 위한 id
     */
    id: string;
    /**
     * 필수 여부
     */
    required: boolean;
    /**
     * 라벨 색상
     */
    labelColor?: string;
    /**
     * sx
     */
    sx?: SxProps<Theme>;
};

/**
 * 모든 input component 의 label 컴포넌트.
 *
 * input: textbox 위에 걸쳐서 shrink 된 형태 [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1546%3A81968)
 *
 * form: 일반적인 형태 [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1519%3A73080)
 *
 * @category Form
 */
function Label(props: LabelPropsType) {
    const { labelStyle, title, required, id, labelVariant, labelColor, sx } = props;

    if (!title) return <span />;

    if (labelStyle === "input") {
        return (
            <InputLabel
                htmlFor={id}
                title={typeof title === "string" ? title : ""}
                required={false}
                margin="dense"
                size="small"
                shrink
                sx={{ pr: 2, pl: 2, background: "white", ...sx }}
                data-cy="label"
            >
                <Typography variant={labelVariant} data-cy="input-label" color="secondary.main">
                    {title}
                </Typography>
            </InputLabel>
        );
    }
    return (
        <FormLabel htmlFor={id} data-cy="label" required={required && !!title} sx={{ mb: labelVariant === "h3" ? 5 : 2, ...sx }} title={typeof title === "string" ? title : ""}>
            <Typography role="heading" data-cy="input-label" variant={labelVariant} color={labelColor}>
                {title}
            </Typography>
        </FormLabel>
    );
}

Label.defaultProps = {
    title: "",
    labelStyle: "form",
    labelVariant: "subtitle1",
    labelColor: undefined,
    sx: {},
};
export default React.memo(Label, (prevProps, nextProps) => prevProps.labelStyle !== nextProps.labelStyle);
