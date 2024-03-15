import RecruitingInterface from "../interface/RecrutingInterface";
import GenderEnum, { GenderLabel } from "../enum/GenderEnum";
import RecruitingSimpleInterface from "../interface/RecruitingSimpleInterface";
import JobEnum, { JobCategoryLabel, JobSubTitle, JobSummaryLabel } from "../enum/JobEnum";
import DateUtil from "../util/DateUtil";
import { MoveJobOffUnitLabel } from "../enum/MoveJobOffUnitEnum";
import RecruitingCertTypeEnum from "../enum/RececruitingCertTypeEnum";
import { Nullable } from "../type/NullableType";
import { RecipientServiceLifeLabel } from "../enum/RecipientServiceLifeEnum";
import { RecipientServiceHomeLabel } from "../enum/RecipientServiceHomeEnum";
import { RecipientServiceCognitiveLabel } from "../enum/RecipientServiceCognitiveEnum";
import { RecipientServiceBodyLabel } from "../enum/RecipientServiceBodyEnum";
import ConverterUtil from "../util/ConverterUtil";
import { RecipientMotionStateLabel } from "../enum/RecipientMotionStateEnum";
import { RecipientCognitiveStateLabel } from "../enum/RecipientCognitiveState";
import { PayTypeLabel } from "../enum/PayTypeEnum";
import SubmitToConfirmCenterRecruitingContentInterface from "../interface/SubmitToConfirmCenterRecruitingContentInterface";
import { GetRecruitingResponseDataInterface } from "../interface/response/GetRecruitingResponseInterface";
import RecruitingIncludesOneTouchChannelInterface from "../interface/RecruitingIncludesOneTouchChannelInterface";

type RecruitingServiceType = RecruitingInterface | RecruitingSimpleInterface | GetRecruitingResponseDataInterface | undefined | "loading";

/**
 * 구인공고 관련 서비스. 구인공고상세, 구인공고리스트 등 여러 컴포넌트에서 사용하는 공통 method 이용
 * UseRecruitingService 대체
 */
export default class RecruitingService {
    /**
     * static class 는 직접 인스턴스화 불가능
     */
    private constructor() {
        throw new Error("cannot instantiate using a static class");
    }

    public static getGradeTitle(recruiting: RecruitingServiceType | SubmitToConfirmCenterRecruitingContentInterface): string {
        if (!recruiting || recruiting === "loading") return "";

        const {
            recipient: { grade },
        } = recruiting;

        return `${grade || "무"}등급`;
    }

    /**
     * 구인공고 subtitle
     * 등급 연세 성별
     */
    public static getSubTitle(recruiting: RecruitingServiceType | RecruitingIncludesOneTouchChannelInterface): string {
        if (!recruiting || recruiting === "loading") return "";
        if (recruiting.certType !== RecruitingCertTypeEnum.YOBOLOVE) return "";
        const text = JobSubTitle.get(recruiting.job) || "";
        return text || `${this.getGradeTitle(recruiting)} ${recruiting.recipient.age}세 ${GenderLabel.get(recruiting.recipient.gender)} 어르신`;
    }

    /**
     * 거리가 없거나 0 이면 "-"
     * distance 가 4800 즉, 이동시간이 60분 이하인경우, 도보 이동시간 / 이동거리
     * 아니면 장거리 근무지 라고 노출
     */
    public static getDistanceText(recruiting: RecruitingServiceType): string {
        if (!recruiting || recruiting === "loading") return "";

        const { distance } = recruiting;
        const hasDistance = ConverterUtil.isNumber(distance);

        if (hasDistance) {
            if (distance <= 4800) {
                return `도보 ${Math.round(distance / 80)}분 / ${Math.round(distance)}m`;
            }
            return "장거리 근무지";
        }
        return "이동거리를 보려면 ‘근무조건 필터’ 설정";
    }

    /**
     * 메인타이틀 텍스트.
     * 임시 대근인 경우, 서비스 유형에 대근을 붙인다.
     */
    public static getMainText(recruiting: RecruitingServiceType): string {
        if (!recruiting || recruiting === "loading") return "";
        const {
            isTemporary,
            job,
            address: { roadAddressName },
        } = recruiting;
        const text = isTemporary ? `${JobSummaryLabel.get(job)}대근` : JobCategoryLabel.get(job);
        return `[${text}] ${ConverterUtil.convertSimpleAddress(recruiting.address) || roadAddressName}`;
    }

    /**
     * <dl>
     * <dt>Recruiting 이 없거나 "loading"인 경우, ""</dt>
     * <dt>1. 임시대근인 경우,
     * <dd> 1. 방문요양인 경우,
     * <dd>     1. 메모가 있으면 workingDay / 메모 형태</dd>
     * <dd>     2. 메모가 없으면 workingDay / 요일 + 시작,종료일시</dd>
     * </dd>
     * <dd>2. 입주요양인 경우, workingDay / 24시간 입주 / 휴무일단위 + 휴무일횟수</dd>
     * </dt>
     * <dt>2. 요보사랑 인증타입이고 입주요양인 경우, 24시간 입주 / 휴무일단위 + 휴무일횟수</dt>
     * <dt>3. visitTime 없으면 -</dt>
     * <dt>4. visitTime 의 메모가 있으면 해당 메모</dt>
     * <dt>5. visitTime 의 요일 정보 + 시간,종료일</dt>
     * </dl>
     */
    public static getVisitTimeText(recruiting: RecruitingServiceType | SubmitToConfirmCenterRecruitingContentInterface): string {
        if (!recruiting || recruiting === "loading") return "";

        const { isTemporary, job, workTime } = recruiting;

        if (isTemporary) {
            return workTime?.memo;
        }

        const isYoboloveHomecareHolidayRecruiting =
            "certType" in recruiting && recruiting?.certType === RecruitingCertTypeEnum.YOBOLOVE && job === JobEnum.HOME_CARE && "holiday" in recruiting;

        if (isYoboloveHomecareHolidayRecruiting) {
            return `24시간 입주 ${recruiting?.holiday?.unit ? `/ ${MoveJobOffUnitLabel.get(recruiting?.holiday?.unit)}` : ""} ${
                recruiting?.holiday?.days ? `${recruiting?.holiday?.days}회 휴무` : ""
            }`;
        }

        if (!workTime) {
            return "-";
        }
        if (workTime.memo) {
            return workTime.memo;
        }
        return `${DateUtil.toDayFromWeekNumber(workTime.days)} ${workTime.startAt}~${workTime.endAt}`;
    }

    /**
     * 필요 서비스 텍스트
     */
    public static getNeedServiceText(recruiting: GetRecruitingResponseDataInterface | SubmitToConfirmCenterRecruitingContentInterface): string {
        if (!("recipientService" in recruiting)) return "";
        const services: Nullable[] = [];
        const { lifeSet, bodySet, homeSet, cognitiveSet } = recruiting.recipientService;

        if (lifeSet?.length) {
            services.push(...lifeSet.map(value => RecipientServiceLifeLabel.get(value)));
        }
        if (homeSet?.length) {
            services.push(...homeSet.map(value => RecipientServiceHomeLabel.get(value)));
        }
        if (cognitiveSet?.length) {
            services.push(...cognitiveSet.map(value => RecipientServiceCognitiveLabel.get(value)));
        }
        if (bodySet?.length) {
            services.push(...bodySet.map(value => RecipientServiceBodyLabel.get(value)));
        }
        return services.length ? services.filter((service: Nullable) => Boolean(service)).join(", ") : "-";
    }

    /**
     * 어르신 상태 텍스트
     * @param recruiting
     */
    public static getRecipientState(recruiting: SubmitToConfirmCenterRecruitingContentInterface): string {
        const states: string[] = [];
        const { motionState, cognitiveState } = recruiting.recipient;

        if (motionState && RecipientMotionStateLabel.has(motionState)) {
            states.push(RecipientMotionStateLabel.get(motionState));
        }
        if (cognitiveState && RecipientCognitiveStateLabel.has(cognitiveState)) {
            states.push(RecipientCognitiveStateLabel.get(cognitiveState));
        }
        return states.join(" / ");
    }

    /**
     * 선호 요양보호사 텍스트
     */
    public static getPreferGenderText(preferCaregiverGender: GenderEnum | null): string {
        if (preferCaregiverGender === null) {
            return "성별 상관 없이 지원 가능";
        }
        return `${GenderLabel.get(preferCaregiverGender)} 선생님만 지원가능`;
    }

    /**
     * pay 정보 텍스트로 리턴
     * @param recruiting
     */
    public static getPayInfo(recruiting: SubmitToConfirmCenterRecruitingContentInterface): string {
        const { pay, payType } = recruiting;

        return `${PayTypeLabel.get(payType)} ${ConverterUtil.toCommaString(pay)}원`;
    }

    /**
     * 최종 확인에 사용되는 어르신 정보 텍스트
     * @param recruiting
     */
    public static getRecipientInfo(recruiting: SubmitToConfirmCenterRecruitingContentInterface): string {
        const { age, gender } = recruiting.recipient;
        return `${this.getGradeTitle(recruiting)} ${age}세 ${GenderLabel.get(gender)} 어르신`;
    }

    /**
     * 최종 확인에 사용되는 휴무일 정보 (입주 요양시)
     * 임시 대근일시에 휴무일이 없으므로 memo 리턴
     * @param recruiting
     */
    public static getHolidayInfo(recruiting: SubmitToConfirmCenterRecruitingContentInterface): string {
        return recruiting.isTemporary ? recruiting.workTime.memo : `${MoveJobOffUnitLabel.get(recruiting.holiday.unit)} ${recruiting.holiday.days}회 휴무`;
    }
}
