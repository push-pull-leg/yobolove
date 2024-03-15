import { NextApiRequest, NextApiResponse } from "next";
import SessionInterface from "../../../interface/SessionInterface";
import CenterAuthService from "../../../server/CenterAuthService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.body) {
        res.status(200).json({ status: false });
        return;
    }

    const centerSession: SessionInterface = req.body;
    if (!centerSession) {
        res.status(200).json({ status: false });
        return;
    }

    await CenterAuthService.login(centerSession, req, res);
    res.status(200).json({ status: true });
}
