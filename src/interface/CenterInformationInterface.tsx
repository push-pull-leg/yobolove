import CenterInterface from "./CenterInterface";
import { Base64SignType } from "../type/Base64ImageType";
import SeverancePayTypeEnum from "../enum/SeverancePayTypeEnum";
import AddressType from "../type/AddressType";

/**
 * 센터 등록정보 관련 interface
 * @interface CenterInformationInterface
 */

export default interface CenterInformationInterface extends Pick<CenterInterface, "adminPhoneNum" | "adminEmail" | "name"> {
    addressDetail: string;
    adminName: string;
    recruiterName: string;
    recruiterSignatureFile: Base64SignType;
    severancePayType: SeverancePayTypeEnum;
    workerCount: number;
    address: Pick<AddressType, "lotAddressName">;
    codeAuthToken?: string;
}
