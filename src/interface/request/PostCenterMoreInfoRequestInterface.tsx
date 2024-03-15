import CenterMoreInfoInterface from "../CenterMoreInfoInterface";
import AddressType from "../../type/AddressType";

interface PostCenterMoreInfoRequestDto extends Omit<CenterMoreInfoInterface, "addressDetail" | "address"> {
    address: Pick<AddressType, "lotAddressName" | "addressDetail">;
}

export default interface PostCenterMoreInfoRequestInterface {
    requestDto: PostCenterMoreInfoRequestDto;
    recruiterSignatureFile: File;
}
