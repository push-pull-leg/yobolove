import ResponseInterface from "../response/ResponseInterface";

export interface GetJobCenterInfoResponseDataInterface {
    name: string | null;
    phoneNum: string | null;
}

export default interface GetJobCenterInfoResponseInterface extends ResponseInterface<GetJobCenterInfoResponseDataInterface> {}
