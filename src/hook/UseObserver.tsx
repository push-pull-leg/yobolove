import { RefObject, useEffect, useState } from "react";
import RecruitingSimpleInterface from "../interface/RecruitingSimpleInterface";

/**
 * 주석 설명 필요
 * @category Type
 */
type InfiniteScrollPropsType = {
    target: RefObject<HTMLUListElement | null>;
    targetArray: RecruitingSimpleInterface[];
    loadLocation: number;
    onIntersect(): void | Promise<void>;
};

/**
 * 주석 설명 필요
 * @category Hook
 */
export const UseObserver = ({ target, onIntersect, targetArray, loadLocation }: InfiniteScrollPropsType) => {
    const [pageSize, setPageSize] = useState(0);

    const onMount = async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        if (target?.current === null) {
            return;
        }
        if (entries[0].isIntersecting) {
            await onIntersect();
            setPageSize(prev => prev + 1);
            observer.disconnect();
        }
    };
    useEffect(() => {
        let observe;
        if (target && target.current) {
            observe = new IntersectionObserver(onMount, { root: null, rootMargin: "0px", threshold: 0.3 });
            if (20 * (pageSize + 1) > targetArray.length) {
                return;
            }
            if (20 * (pageSize + 1) <= targetArray.length) {
                observe.observe(target.current.children[target.current.children.length - loadLocation]);
            }
            if (observe) {
                observe.unobserve(target.current);
            }
        }
    }, [targetArray]);
    return { setPageSize };
};
