import React from "react";
import { Box, SxProps } from "@mui/material";

/**
 * flex-gap display 인 컴포넌트에서 하위 자식들을 gap 만큼 더 띄우기 위한 spacer
 *
 * @category Component
 */

export type SpacerPropsType = {
    sx?: SxProps;
};

function Spacer(props: SpacerPropsType) {
    const { sx } = props;
    return <Box data-cy="spacer" sx={sx} />;
}

Spacer.defaultProps = {
    sx: undefined,
};

export default Spacer;
