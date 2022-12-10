import { LoginForm } from "../src/auth/Login";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions, User } from "../lib/auth/session";

export default function IndexPage() {
  return <LoginForm />;
}

export const getServerSideProps = withIronSessionSsr(function ({
  req,
  res,
}) {
  const user = req.session.user;

  if (user) {
    res.setHeader("location", "/dashboard");
    res.statusCode = 302;
    res.end();
    return {
      props: {
        user: req.session.user,
      },
    };
  }

  return {
    props: {user: {} as User},
  };
},
sessionOptions);
