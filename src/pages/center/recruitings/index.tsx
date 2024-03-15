import type { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import CenterProfile from "../../../components/CenterProfile";
import UseCenterService from "../../../hook/UseCenterService";
import RecruitingSimpleInterface from "../../../interface/RecruitingSimpleInterface";
import CenterRecruiting from "../../../components/CenterRecruiting";
import MetaInterface from "../../../interface/response/MetaInterface";
import CenterRecruitingSkeleton from "../../../components/skeleton/CenterRecruitingSkeleton";
import { Undefinable } from "../../../type/Undefinable";
import WithCenterAuth from "../../../hoc/WithCenterAuth";
import WithHeadMetaData from "../../../hoc/WithHeadMetaData";
import StorageUtil from "../../../util/StorageUtil";
import RecruitingSessionStorageKeys from "../../../enum/RecruitingSessionStorageKeys";
import GetCenterRecruitingsSimpleResponseInterface from "../../../interface/response/GetCenterRecruitingsSimpleResponseInterface";
import EventUtil from "../../../util/EventUtil";

/**
 * 기관용 서비스 - 나의공고
 * [피그마 시안](https://www.figma.com/file/85CY08gPusZbEJfMirZ440/%EC%9A%94%EB%B3%B4%EC%82%AC%EB%9E%91-%ED%99%94%EB%A9%B4-%EC%84%A4%EA%B3%84%2F220510?node-id=1600%3A91241)
 * @category Page
 * @Center
 */
const Recruitings: NextPage = function Recruitings() {
    const { isLoading, getRecruitingsSimple } = UseCenterService();
    const [ref, inView] = useInView({});

    const meta = useRef<Undefinable<MetaInterface>>();
    const recruitingsLoadable = useRef<boolean>(true);
    const [recruitings, setRecruitings] = useState<RecruitingSimpleInterface[]>([]);

    const handlePostingNewButtonClick = () => {
        StorageUtil.removeItem([RecruitingSessionStorageKeys.WRITTEN_RECRUITING_CONTENT, RecruitingSessionStorageKeys.SELECTED_CENTER_ONETOUCH_CHANNEL]);

        EventUtil.gtmEvent("click", "create", "cenRecruitings", "0");
    };

    /**
     * 구인 공고 불러올시 참고하는 상태 값들을 관리 하는 함수
     *
     * @param response
     */
    const updateRecruitingsStatus = (response: GetCenterRecruitingsSimpleResponseInterface) => {
        meta.current = response.meta;
        if (!response.meta.nextToken) {
            recruitingsLoadable.current = false;
        }
    };
    /**
     * 구인공고 내역 가져오기
     * 공고 상태 변경으로 인해 구인공고를 처음부터 불러 와야 할 때를 위해 isFirst 매개변수 사용
     * @param isFirst
     */
    const getRecruitings = async (isFirst = false): Promise<GetCenterRecruitingsSimpleResponseInterface | null> => {
        if (isFirst) meta.current = undefined;
        const response = await getRecruitingsSimple({ size: 20, nextToken: meta.current?.nextToken });
        if (!response) return null;
        return response;
    };

    /**
     * recrutigins get, set, update 실행 하는 함수
     * @param isFirst
     */
    const loadRecruitings = async (isFirst = false) => {
        const res = await getRecruitings(isFirst);
        if (isFirst) setRecruitings(res.data);
        else setRecruitings(prev => [...prev, ...res.data]);
        updateRecruitingsStatus(res);
    };
    useEffect(() => {
        loadRecruitings();
    }, []);

    useEffect(() => {
        if (inView && recruitingsLoadable.current) {
            loadRecruitings();
        }
    }, [inView]);
    return (
        <CenterProfile sx={{ pt: 0 }}>
            <Box sx={{ p: 4 }}>
                <Link href="/기관/구인공고등록" passHref>
                    <Button variant="contained" sx={{ width: "fit-content", color: "primary" }} onClick={handlePostingNewButtonClick}>
                        + 새로운 공고 등록
                    </Button>
                </Link>
            </Box>
            <Box>
                {recruitings.map((currentRecruiting: RecruitingSimpleInterface, index: number) => (
                    <CenterRecruiting
                        recruiting={currentRecruiting}
                        key={currentRecruiting.uuid}
                        ref={index === recruitings.length - 1 ? ref : null}
                        onChange={() => {
                            loadRecruitings(true);
                            recruitingsLoadable.current = true;
                        }}
                    />
                ))}
            </Box>
            {isLoading ? <CenterRecruitingSkeleton /> : <div />}
        </CenterProfile>
    );
};
export const getServerSideProps: GetServerSideProps = WithCenterAuth(undefined, true);

export default WithHeadMetaData(Recruitings);
