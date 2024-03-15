/// <reference types="cypress" />
// @ts-nocheck
import React from "react";
import RecruitingService from "../../../src/service/RecruitingService";
import recruiting from "../../../src/mocks/faker/Recruiting";
import { faker } from "@faker-js/faker";
import DateUtil from "../../../src/util/DateUtil";
import RecruitingCertTypeEnum from "../../../src/enum/RececruitingCertTypeEnum";
import { GenderLabel } from "../../../src/enum/GenderEnum";
import JobEnum, { JobSummaryLabel } from "../../../src/enum/JobEnum";
import dayjs from "dayjs";
import { MoveJobOffUnitLabel } from "../../../src/enum/MoveJobOffUnitEnum";
import RecipientServiceLifeEnum from "../../../src/enum/RecipientServiceLifeEnum";
import RecipientServiceCognitiveEnum from "../../../src/enum/RecipientServiceCognitiveEnum";
import RecipientServiceHomeEnum from "../../../src/enum/RecipientServiceHomeEnum";
import RecipientServiceBodyEnum from "../../../src/enum/RecipientServiceBodyEnum";

faker.locale = "ko";
let randomString = faker.datatype.string(10);
let secondRandomString = faker.datatype.string(12);
let randomNumber = faker.datatype.number({ min: 1, max: 4800 });
let randomMemo = faker.lorem.lines(3);
const defaultData = recruiting();
const testData = recruiting();

describe("RecruitingService 테스트", () => {
    context("method 테스트", () => {
        it("getGradeTitle 테스트", () => {
            expect(RecruitingService.getGradeTitle()).to.eq("");
            expect(RecruitingService.getGradeTitle("loading")).to.eq("");
            expect(RecruitingService.getGradeTitle(defaultData)).to.eq(`${defaultData.recipientGrade}등급`);
            testData.recipientGrade = undefined;
            expect(RecruitingService.getGradeTitle(testData)).to.eq("무등급");
        });
        it("getSubTitle 테스트", () => {
            expect(RecruitingService.getSubTitle()).to.eq("");
            expect(RecruitingService.getSubTitle("loading")).to.eq("");
            testData.certType = RecruitingCertTypeEnum.WORKNET;
            expect(RecruitingService.getSubTitle(testData)).to.eq("");
            testData.certType = RecruitingCertTypeEnum.YOBOLOVE;
            expect(RecruitingService.getSubTitle(testData)).to.eq(
                `${RecruitingService.getGradeTitle(testData)} ${testData.recipientAge}세 ${GenderLabel.get(testData.recipientGender)} 어르신`,
            );
        });
        it("getDistanceText 테스트", () => {
            expect(RecruitingService.getDistanceText()).to.eq("");
            expect(RecruitingService.getDistanceText("loading")).to.eq("");
            testData.distance = faker.datatype.number({ max: 4800 });
            expect(RecruitingService.getDistanceText(testData)).to.eq(`도보 ${Math.round(testData.distance / 80)}분 / ${Math.round(testData.distance)}m`);
            testData.distance = faker.datatype.number({ min: 4801 });
            expect(RecruitingService.getDistanceText(testData)).to.eq("장거리 근무지");
            testData.distance = undefined;
            expect(RecruitingService.getDistanceText(testData)).to.eq("이동거리를 보려면 ‘근무조건 필터’ 설정");
        });
        it("getMainText 테스트", () => {
            expect(RecruitingService.getMainText()).to.eq("");
            expect(RecruitingService.getMainText("loading")).to.eq("");
            testData.isTemporary = true;
            testData.address.basicTitle = randomString;
            expect(RecruitingService.getMainText(testData)).to.eq(`[${JobSummaryLabel.get(testData.job)}대근] ${testData.address.basicTitle}`);
            testData.address.basicTitle = undefined;
            testData.address.detailTitle = secondRandomString;
            expect(RecruitingService.getMainText(testData)).to.eq(`[${JobSummaryLabel.get(testData.job)}대근] ${testData.address.detailTitle}`);
            testData.isTemporary = false;
            expect(RecruitingService.getMainText(testData)).to.eq(`[${JobSummaryLabel.get(testData.job)}] ${testData.address.detailTitle}`);
            testData.address.basicTitle = randomString;
            expect(RecruitingService.getMainText(testData)).to.eq(`[${JobSummaryLabel.get(testData.job)}] ${testData.address.basicTitle}`);
        });
        it("getVisitTimeText 테스트", () => {
            expect(RecruitingService.getVisitTimeText()).to.eq("");
            expect(RecruitingService.getVisitTimeText("loading")).to.eq("");
            testData.isTemporary = true;
            testData.temporaryDays = testData.visitTime.memo = randomMemo;
            testData.job = JobEnum.VISIT_CARE;
            expect(RecruitingService.getVisitTimeText(testData)).to.eq(`${dayjs(testData.temporaryDays[0].workingDay).format("YY년 MM월 DD일")} / ${testData.visitTime.memo}`);
            testData.visitTime.memo = undefined;
            expect(RecruitingService.getVisitTimeText(testData)).to.eq(
                `${dayjs(testData.temporaryDays[0].workingDay).format("YY년 MM월 DD일")} / ${DateUtil.toDayFromWeekNumber(testData.visitTime?.days)} ${
                    testData.visitTime?.startAt
                }~${testData.visitTime?.endAt}`,
            );
            testData.job = JobEnum.HOME_CARE;
            testData.temporaryDays = [
                {
                    workingDay: DateUtil.toString(faker.date.recent()),
                },
            ];
            expect(RecruitingService.getVisitTimeText(testData)).to.eq(
                `${dayjs(testData.temporaryDays[0].workingDay).format("YY년 MM월 DD일")} / 24시간 입주 ${
                    testData.moveJobOffUnit ? `/ ${MoveJobOffUnitLabel.get(testData.moveJobOffUnit)}` : ""
                } ${testData.moveJobOffDays ? `${testData.moveJobOffDays}회 휴무` : ""}`,
            );
            testData.isTemporary = false;
            testData.certType = RecruitingCertTypeEnum.YOBOLOVE;
            expect(RecruitingService.getVisitTimeText(testData)).to.eq(
                `24시간 입주 ${testData.moveJobOffUnit ? `/ ${MoveJobOffUnitLabel.get(testData.moveJobOffUnit)}` : ""} ${testData.moveJobOffDays}회 휴무`,
            );
            testData.certType = RecruitingCertTypeEnum.WORKNET;
            testData.visitTime = undefined;
            expect(RecruitingService.getVisitTimeText(testData)).to.eq("-");
            testData.visitTime = defaultData.visitTime;
            testData.visitTime.memo = randomMemo;
            expect(RecruitingService.getVisitTimeText(testData)).to.eq(randomMemo);
            testData.visitTime.memo = undefined;
            expect(RecruitingService.getVisitTimeText(testData)).to.eq(
                `${DateUtil.toDayFromWeekNumber(testData.visitTime.days)} ${testData.visitTime.startAt}~${testData.visitTime.endAt}`,
            );
        });
        it("getNeedServiceText 테스트", () => {
            testData.recipientServiceLifeSet = [RecipientServiceLifeEnum.BATH];
            testData.recipientServiceHomeSet = [RecipientServiceHomeEnum.CLEAN];
            testData.recipientServiceCognitiveSet = [RecipientServiceCognitiveEnum.PROGRAM_PREPARE];
            testData.recipientServiceBodySet = [RecipientServiceBodyEnum.HOSPITAL];
            expect(RecruitingService.getNeedServiceText(testData)).to.eq("샤워/목욕 도움, 청소, 인지 프로그램 준비, 병원 이동");
        });
        it("getPreferGenderText 테스트", () => {
            testData.preferCaregiverGender = null;
            expect(RecruitingService.getPreferGenderText(testData)).to.eq("성별 상관 없이 지원 가능");
            testData.preferCaregiverGender = defaultData.preferCaregiverGender;
            expect(RecruitingService.getPreferGenderText(testData)).to.eq(`${GenderLabel.get(testData.preferCaregiverGender)} 선생님만 지원가능`);
        });
    });
});
