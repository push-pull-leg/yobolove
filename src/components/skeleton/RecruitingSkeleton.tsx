import { Card, CardContent, CardHeader, Divider, List, ListItem, ListItemIcon, ListItemText, Skeleton, Typography } from "@mui/material";
import React from "react";
import { CalendarToday, DirectionsRun } from "@mui/icons-material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { toRem } from "../../styles/options/Function";
import MoneyLogo from "../../styles/images/img-icon-money.svg";

type RecruitingSkeletonPropsType = {
    certTypeAndDateStyle: string;
    moneyIconStyle: string;
};

/**
 * 구직자용 - 구인공고 skeleton
 *
 * @category Skeleton
 */
function RecruitingSkeleton(props: RecruitingSkeletonPropsType) {
    const { certTypeAndDateStyle, moneyIconStyle } = props;
    return (
        <Card
            sx={{
                borderRadius: 0,
                width: "100%",
                boxSizing: "border-box",
            }}
            elevation={0}
            raised={false}
            data-cy="recruiting-skeleton"
        >
            <CardHeader
                title={
                    <>
                        <div className={certTypeAndDateStyle} data-cy="skeleton-title">
                            <Typography
                                sx={{
                                    height: toRem(24),
                                    fontSize: toRem(14),
                                    mb: 2.5,
                                    pt: 1,
                                    color: "rgba(0, 0, 0, 0.87)",
                                }}
                            >
                                <Skeleton data-cy="skeleton" animation="wave" variant="text" width="10%" height={15} />
                            </Typography>
                            <Typography data-cy="date" color="secondary.dark" variant="body2">
                                <Skeleton data-cy="skeleton" animation="wave" variant="text" width="10%" height={15} />
                            </Typography>
                        </div>
                        <Skeleton data-cy="skeleton" animation="wave" variant="text" width="80%" height={20} />
                    </>
                }
                sx={{ p: 0, textAlign: "left", alignItems: "flex-start" }}
            />
            <CardContent component={List} sx={{ p: 0, "&:last-child": { pb: 0, mt: 2.5 } }}>
                <ListItem sx={{ pt: 1.5, pb: 0, px: 0 }}>
                    <ListItemIcon>
                        <DirectionsRun fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "text.secondary" }}>
                        <Skeleton animation="wave" data-cy="skeleton" variant="text" width="80%" height={15} />
                    </ListItemText>
                </ListItem>
                <ListItem sx={{ pt: 1.5, pb: 0, px: 0 }}>
                    <ListItemIcon>
                        <CalendarToday fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "text.secondary" }}>
                        <Skeleton animation="wave" data-cy="skeleton" variant="text" width="80%" height={15} />
                    </ListItemText>
                </ListItem>
                <ListItem sx={{ pt: 1.5, pb: 0, px: 0 }}>
                    <ListItemIcon>
                        <MoneyLogo className={moneyIconStyle} data-cy="money-icon" />
                    </ListItemIcon>
                    <ListItemText data-cy="pay" sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "text.secondary" }}>
                        &nbsp;
                        <Skeleton animation="wave" data-cy="skeleton" variant="text" width="80%" height={15} />
                    </ListItemText>
                </ListItem>
            </CardContent>
            <Divider sx={{ pt: 4 }} />
            <CardContent component={List} sx={{ p: 0, "&:last-child": { pb: 0, mt: 4 } }}>
                <ListItem sx={{ padding: "0 0 1rem" }}>
                    <ListItemIcon>
                        <HomeOutlinedIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "kakaotalk.contrastText" }}>
                        <Skeleton animation="wave" data-cy="skeleton" variant="text" width="80%" height={15} />
                    </ListItemText>
                </ListItem>
                <ListItem disablePadding sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                    <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.5)" }}>
                        <Skeleton animation="wave" data-cy="skeleton" variant="text" width="20%" height={15} />
                    </Typography>
                    <ListItemText sx={{ m: 0 }} primaryTypographyProps={{ variant: "body2", color: "text.primary" }}>
                        <Skeleton animation="wave" data-cy="skeleton" variant="text" width="80%" height={15} />
                    </ListItemText>
                </ListItem>
            </CardContent>
        </Card>
    );
}

export default RecruitingSkeleton;
