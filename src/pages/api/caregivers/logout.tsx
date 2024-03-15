import { NextApiRequest, NextApiResponse } from "next";
import CaregiverAuthService from "../../../server/CaregiverAuthService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await CaregiverAuthService.logout(req, res);
    res.status(200).json({ status: true });
}
