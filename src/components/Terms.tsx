import { ListItem, ListItemIcon, ListItemText, SxProps, Typography } from "@mui/material";
import { AddAlertOutlined } from "@mui/icons-material";
import Link from "next/link";
import React, { ReactElement, useMemo } from "react";
import { css } from "@emotion/css";
import { Theme } from "@mui/material/styles";
import DateUtil from "../util/DateUtil";
import { toRem } from "../styles/options/Function";
import TermsAgreementInterface from "../interface/TermsAgreementInterface";
import UserType from "../type/UserType";

const titleStyle = css`
    padding-left: ${toRem(10)};
    align-self: flex-start;
`;

/**
 * {@link Terms} props
 * @category PropsType
 */
type TermsPropsType = {
    /**
     * 동의/비동의가 들어간 이용약관 데이터
     */
    termsAgreement: TermsAgreementInterface;
    /**
     * 구직자용/기관용 구분
     */
    userType: UserType;
    /**
     * sx
     */
    sx?: SxProps<Theme>;
};

/**
 * (공통) 내정보 > 이용약관 개별 리스트.
 * termsAgreement.agreedDate 에 따라서 동의/비동의 UI 다름
 *
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1519%3A75186)
 * @category Component
 */
function Terms(props: TermsPropsType) {
    const { termsAgreement, userType, sx } = props;
    const { terms, agreedDate } = termsAgreement;

    const link = useMemo<string>(() => {
        if (userType === "CENTER") {
            return `/center/terms/${terms.uuid}`;
        }
        return `/terms/${terms.uuid}`;
    }, [userType]);

    const secondary = useMemo<{ action: ReactElement; label: string }>(() => {
        if (agreedDate) {
            return {
                action: (
                    <Typography variant="body2" color="primary.main">
                        동의
                    </Typography>
                ),
                label: `동의 ${DateUtil.toString(agreedDate, "YYYY.MM.DD")}`,
            };
        }
        return {
            action: (
                <Typography variant="body2" color="error">
                    미동의
                </Typography>
            ),
            label: "-",
        };
    }, [termsAgreement.agreedDate]);
    return (
        <Link href={link} key={terms.uuid} passHref>
            <ListItem button secondaryAction={secondary.action} sx={sx}>
                <ListItemIcon sx={{ alignSelf: "flex-start", mt: 2 }}>
                    <AddAlertOutlined />
                </ListItemIcon>
                <ListItemText
                    primary={terms.title}
                    primaryTypographyProps={{ variant: "subtitle1", className: titleStyle }}
                    data-cy="terms-title"
                    secondary={secondary.label}
                    secondaryTypographyProps={{ variant: "caption", className: titleStyle }}
                />
            </ListItem>
        </Link>
    );
}

Terms.defaultProps = {
    sx: {},
};

export default React.memo(Terms);
