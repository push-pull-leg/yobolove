import { NextApiRequest, NextApiResponse } from "next";
import CaregiverAuthService from "../../../server/CaregiverAuthService";
import UtmInterface from "../../../interface/UtmInterface";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.body) {
        res.status(200).json({ status: false });
        return;
    }

    const utm: UtmInterface = req.body;
    if (!utm) {
        res.status(200).json({ status: false });
        return;
    }

    await CaregiverAuthService.setUtm(utm, req, res);
    res.status(200).json({ status: true });
}
