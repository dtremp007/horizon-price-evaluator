import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "../../lib/auth/session";

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { email, inviteCode } = req.body;


  if (email && inviteCode === process.env.INVITE_CODE) {
    req.session.user = { email, isLoggedIn: true };


    await req.session.save();
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "This invite code is invalid." });
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
