/**
 *
 * @param sx
 * @param maxWidth
 * @param isPage page인지 여부. true일 경우, py가 반응형에 따라 변한다. page이면서 py를 커스텀 할 때는 isPage를 false로 한다.
 */
const sectionStyle = (sx: object = {}, maxWidth: string = "lg", isPage: boolean = false) => {
    let style = { ...sx };
    if (isPage) {
        style = {
            py: { xs: 4, sm: 4, md: 6.5, lg: 6.5 },
            ...sx,
        };
    }
    return {
        maxWidth,
        width: "100%",
        sx: {
            flex: 1,
            px: { xs: 4, sm: 6, md: 8 },
            ...style,
        },
    };
};

export default sectionStyle;
