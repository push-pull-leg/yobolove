import { atom, selector } from "recoil";
import { v1 } from "uuid";
import JwtAccessTokenDataInterface from "../interface/JwtAccessTokenDataInterface";
import RoleEnum from "../enum/RoleEnum";

export const defaultCenterRecoilStateInterface: JwtAccessTokenDataInterface = {
    sub: "",
    role: RoleEnum.ROLE_CENTER,
    iat: 0,
    exp: 0,
};

/**
 * 센터 정보는 단순히 {@link JwtAccessTokenDataInterface} 형태로 저장됨
 * @category Recoil
 */
export const centerRecoilState = atom({
    key: `centerState${v1()}`,
    default: defaultCenterRecoilStateInterface,
});

/**
 * @category Recoil
 */
export const centerRecoilSelector = selector({
    key: `centerSelector${v1()}`,
    get: ({ get }): JwtAccessTokenDataInterface => get(centerRecoilState),
});
