import { NextApiRequest, NextApiResponse } from "next";
import SessionInterface from "../../../interface/SessionInterface";
import CaregiverAuthService from "../../../server/CaregiverAuthService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.body) {
        res.status(200).json({ status: false });
        return;
    }

    const caregiverSession: SessionInterface = req.body;
    if (!caregiverSession) {
        res.status(200).json({ status: false });
        return;
    }

    await CaregiverAuthService.login(caregiverSession, req, res);
    res.status(200).json({ status: true });
}
