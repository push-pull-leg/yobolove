import { List, ListItem, ListItemText } from "@mui/material";
import Link from "next/link";
import React from "react";
import { MenuType } from "../type/MenuType";

type HeaderMenuPropsType = {
    menuList: MenuType[];
};

/**
 * 헤더 좌측 메뉴 컴포넌트
 * @param props
 * @category Component
 */
function HeaderMenu(props: HeaderMenuPropsType) {
    const { menuList } = props;
    return (
        <List>
            <ListItem>
                <ListItemText primary="전체메뉴" primaryTypographyProps={{ variant: "subtitle2", color: "text.secondary" }} />
            </ListItem>
            {menuList.map((menu: MenuType) => (
                <Link href={menu.href} as={menu.as} passHref key={menu.href}>
                    <ListItem component="a" button onClick={menu.onClick}>
                        <ListItemText primary={menu.title} primaryTypographyProps={{ variant: "body1" }} />
                    </ListItem>
                </Link>
            ))}
        </List>
    );
}

export default React.memo(HeaderMenu);
