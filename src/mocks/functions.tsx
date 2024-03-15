import ResponseErrorCodeEnum from "../enum/ResponseErrorCodeEnum";
import BadResponseInterface from "../interface/response/BadResponseInterface";
import MetaInterface from "../interface/response/MetaInterface";

export const toResponse = (data: any, meta?: MetaInterface) => {
    console.info(`%c MOCKING DATA`, "font-weight:bold;color:lime", data);
    return {
        data,
        meta,
    };
};
export const toBadResponse = (errorCode: ResponseErrorCodeEnum, errorMessage: string) => {
    const response: BadResponseInterface = {
        error: {
            code: errorCode,
            message: errorMessage,
        },
    };
    console.info(`%c MOCKING DATA`, "font-weight:bold;color:coral", response.error);
    return response;
};
