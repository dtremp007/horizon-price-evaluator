import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "../../lib/auth/session";
import database from "../../lib/dev_database/database.json";

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    if (password === "password") {
      const user = database.users.find((user) => user.email === email)!;
      //   req.session.user = {
      //     id: 1,
      //     name: "John Doe",
      //     email: "johndoe@email.com",
      //     isLoggedIn: true,
      //   };
      req.session.user = { ...user, isLoggedIn: true };

      await req.session.save();
      res.json(req.session.user)
    } else {
      res.status(500).json({ error: "Login failed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
