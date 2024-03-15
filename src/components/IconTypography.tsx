import { SxProps, Typography, TypographyVariant } from "@mui/material";
import React, { ReactElement } from "react";
import { Theme } from "@mui/material/styles";

/**
 * {@link IconTypography} props
 * @category PropsType
 */
type IconTypographyPropsType = {
    /**
     * 텍스트
     */
    label: string | ReactElement;
    /**
     * 텍스트 컬러
     */
    labelColor?: string;
    /**
     * 좌측 아이콘 컴포넌트
     */
    icon?: ReactElement;
    /**
     * 아이콘 컬러
     */
    iconColor?: string;
    /**
     * Typography variant
     */
    typographyVariant?: TypographyVariant;
    /**
     * sx
     */
    sx?: SxProps<Theme>;
    /**
     * test 를 위한 selector
     */
    labelSelector?: string;
    iconSelector?: string;
};

/**
 * 아이콘이 좌측에 있고 우측에 {@link Typography}가 있는 형태의 컴포넌트
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1875%3A93469)
 * @category Component
 */
function IconTypography(props: IconTypographyPropsType) {
    const { label, labelColor, icon, iconColor, typographyVariant, sx, iconSelector, labelSelector } = props;
    return (
        <Typography variant="caption" display="flex" color={iconColor} sx={sx} component="div">
            {icon && <span data-cy={iconSelector}>{icon}</span>}
            <Typography color={labelColor} data-cy={labelSelector} variant={typographyVariant} sx={{ ml: 1.5 }}>
                {label}
            </Typography>
        </Typography>
    );
}

IconTypography.defaultProps = {
    icon: undefined,
    iconColor: "text.disabled",
    typographyVariant: "caption",
    labelColor: "text",
    sx: {},
    labelSelector: undefined,
    iconSelector: undefined,
};
export default React.memo(IconTypography);
