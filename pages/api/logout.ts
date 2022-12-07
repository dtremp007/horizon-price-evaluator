import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from 'next'
import { User } from '../../lib/auth/session'
import { sessionOptions } from "../../lib/auth/session";

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  req.session.destroy();

  return res.json({} as User);
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions);
