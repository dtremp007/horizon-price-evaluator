import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "../../lib/auth/session";
import database from "../../lib/dev_database/database.json";

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  const user = database.users.find((user) => user.email === email);
  if (user) {
    req.session.user = { ...user, isLoggedIn: true };

    await req.session.save();
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "Email not found." });
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
