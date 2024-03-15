import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";

/**
 * Mock Adapter 는 global 하게 사용. 실제 network delay 파악을 위해 delayResponse 를 1000ms로 설정
 */
export default new AxiosMockAdapter(axios, { delayResponse: 200 });
