import { Box, List, ListItem, ListItemText, Skeleton as MaterialSkeleton } from "@mui/material";
import React from "react";
import sectionStyle from "../../styles/sectionStyle";

/**
 * 리스트형 skeleton
 *
 * @category Skeleton
 */
function ListSkeleton() {
    return (
        <Box display="flex" height="100%" alignItems="center" flexDirection="column" {...sectionStyle({ pt: 8, textAlign: "left" }, "sm")}>
            <List sx={{ width: "100%" }}>
                <ListItem divider>
                    <ListItemText primary={<MaterialSkeleton data-cy="skeleton" variant="text" />} />
                </ListItem>
                <ListItem divider>
                    <ListItemText primary={<MaterialSkeleton data-cy="skeleton" variant="text" />} />
                </ListItem>
                <ListItem>
                    <ListItemText primary={<MaterialSkeleton data-cy="skeleton" variant="text" />} />
                </ListItem>
            </List>
        </Box>
    );
}

export default React.memo(ListSkeleton);
