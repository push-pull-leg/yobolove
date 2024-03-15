import { useRouter } from "next/router";
import React, { ComponentType } from "react";
import HeadMeta, { HeadMetaDataType } from "../components/Head";
import HeadMetaDataConfig from "../config/HeadMetaDataConfig";

/**
 * {@link WithHeadMetaData} props
 * @category PropsType
 */
type WithHeadMetaType = {
    /**
     * {@link HeadMetaDataType}
     */
    metaData: HeadMetaDataType;
};

/**
 * SEO 를 위한 {@link HeadMeta} component hoc.
 * 컴포넌트 페이지들의 최종 return 에 가변적 HeadMetaData 를 넣음
 *
 * @category Hoc
 */
const WithHeadMetaData = <P extends {}>(Component: ComponentType<P>): React.FC<P & WithHeadMetaType> =>
    function HeadMetaFunction({ metaData, ...props }: WithHeadMetaType) {
        const router = useRouter();

        let currentHeadMeta: HeadMetaDataType = {};
        if (metaData) {
            /**
             * 커스텀 head meta 데이터가 있는 경우 해당데이터를 넣으줌
             */
            currentHeadMeta = metaData;
        } else if (HeadMetaDataConfig.has(router.route)) {
            /**
             * HeadMetaDataConfig 파일에 해당 route 가 있는 경우, 해당 고정 값으로 사용한다.
             */
            currentHeadMeta = HeadMetaDataConfig.get(router.route) || {};
        }

        return (
            <>
                <HeadMeta {...currentHeadMeta} />
                <Component {...(props as P)} />
            </>
        );
    };

WithHeadMetaData.defaultProps = {
    metaData: undefined,
};

export default WithHeadMetaData;
