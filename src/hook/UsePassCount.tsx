import { useEffect, useState } from "react";
import UseCenterService from "./UseCenterService";

const UsePassCount = () => {
    /**
     * 현재 보유 등록권 갯수
     */
    const [passCount, setPassCount] = useState<number>(undefined);
    const { getCurrentPassAmount, setIsLoading, isLoading } = UseCenterService();

    /**
     * 등록권 갯수 업데이트
     */
    const loadPassCount = async () => {
        setIsLoading(true);
        const response = await getCurrentPassAmount();
        setIsLoading(false);

        setPassCount(response);
    };

    useEffect(() => {
        loadPassCount();
    }, []);

    return {
        passCount,
        isPassCountLoading: isLoading,
    };
};
export default UsePassCount;
