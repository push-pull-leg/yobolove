import { NextApiRequest, NextApiResponse } from "next";
import CenterAuthService from "../../../server/CenterAuthService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await CenterAuthService.logout(req, res);
    res.status(200).json({ status: true });
}
