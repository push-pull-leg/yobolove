import { atom, selector } from "recoil";
import { v1 } from "uuid";
import JwtAccessTokenDataInterface from "../interface/JwtAccessTokenDataInterface";
import RoleEnum from "../enum/RoleEnum";
import CaregiverAuthInterface from "../interface/CaregiverAuthInterface";

/**
 * 구직자 관련 recoil data
 */
export type CaregiverRecoilType = {
    /**
     * 토큰 데이터(JWT 토큰 파싱데이터)
     */
    tokenData: JwtAccessTokenDataInterface;
    /**
     * 구직자 인증 데이터(로그인 후에 받는 데이터)
     */
    auth: CaregiverAuthInterface;
};

export const defaultCaregiverRecoilStateInterface: CaregiverRecoilType = {
    tokenData: {
        sub: "",
        uuid: "",
        role: RoleEnum.ROLE_CAREGIVER,
        iat: 0,
        exp: 0,
    },
    auth: {
        phoneNum: "",
        uuid: "",
        accessToken: "",
        hasDesiredWork: false,
        message: undefined,
    },
};

/**
 * @category Recoil
 */
export const caregiverRecoilState = atom({
    key: `caregiverState${v1()}`,
    default: defaultCaregiverRecoilStateInterface,
});

/**
 * @category Recoil
 */
export const caregiverRecoilSelector = selector({
    key: `caregiverSelector${v1()}`,
    get: ({ get }): CaregiverRecoilType => get(caregiverRecoilState),
});
