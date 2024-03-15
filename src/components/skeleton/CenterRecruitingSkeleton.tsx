import { Button, Card, CardContent, CardHeader, List, ListItem, ListItemText, Skeleton } from "@mui/material";
import React from "react";

/**
 * 기관용 - 구인공고 skeleton
 *
 * @category Skeleton
 */
function CenterRecruitingSkeleton() {
    return (
        <>
            <Card
                sx={{
                    p: 4,
                    borderRadius: 0,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                    width: "100%",
                    boxSizing: "border-box",
                }}
                elevation={0}
                raised={false}
            >
                <CardHeader
                    title={<Skeleton data-cy="skeleton" variant="text" width="20%" />}
                    titleTypographyProps={{ variant: "body1", role: "heading", "data-cy": "title" }}
                    sx={{ p: 0, textAlign: "left", alignItems: "flex-start" }}
                    subheader={<Skeleton variant="text" width="30%" height="50%" data-cy="skeleton" />}
                    action={<Skeleton variant="text" width="50px" data-cy="skeleton" />}
                />
                <CardContent component={List} sx={{ p: 0, "&:last-child": { pb: 0, mt: 2.5 } }}>
                    <ListItem disablePadding sx={{ mt: 1, clear: "both", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                        <ListItemText
                            primary={<Skeleton data-cy="skeleton" variant="text" width="25%" />}
                            primaryTypographyProps={{ variant: "body1" }}
                            secondary={
                                <Button variant="outlined" color="secondary" disabled>
                                    <Skeleton variant="text" width="80px" data-cy="skeleton" />
                                </Button>
                            }
                            secondaryTypographyProps={{ sx: { mt: 5 } }}
                        />
                    </ListItem>
                </CardContent>
            </Card>

            <Card
                sx={{
                    p: 4,
                    borderRadius: 0,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                    width: "100%",
                    boxSizing: "border-box",
                }}
                elevation={0}
                raised={false}
            >
                <CardHeader
                    title={<Skeleton variant="text" width="20%" data-cy="skeleton" />}
                    titleTypographyProps={{ variant: "body1", role: "heading", "data-cy": "title" }}
                    sx={{ p: 0, textAlign: "left", alignItems: "flex-start" }}
                    subheader={<Skeleton variant="text" width="30%" height="50%" data-cy="skeleton" />}
                    action={<Skeleton variant="text" width="50px" data-cy="skeleton" />}
                />
                <CardContent component={List} sx={{ p: 0, "&:last-child": { pb: 0, mt: 2.5 } }}>
                    <ListItem disablePadding sx={{ mt: 1, clear: "both", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                        <ListItemText
                            primary={<Skeleton variant="text" width="25%" data-cy="skeleton" />}
                            primaryTypographyProps={{ variant: "body1" }}
                            secondary={
                                <Button variant="outlined" color="secondary" disabled>
                                    <Skeleton variant="text" width="80px" data-cy="skeleton" />
                                </Button>
                            }
                            secondaryTypographyProps={{ sx: { mt: 5 } }}
                        />
                    </ListItem>
                </CardContent>
            </Card>
        </>
    );
}

export default CenterRecruitingSkeleton;
