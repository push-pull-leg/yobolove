/**
 * @interface CaregiverInterface
 */

interface UtmInterface {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
}

export const UtmKeys: (keyof UtmInterface)[] = ["utmSource", "utmMedium", "utmCampaign", "utmContent", "utmTerm"];
export default UtmInterface;
