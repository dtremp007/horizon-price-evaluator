import { LoginForm } from "../src/auth/Login";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions, User } from "../lib/auth/session";

export default function IndexPage() {
  return <LoginForm />;
}

export const getServerSideProps = withIronSessionSsr(function ({
  req,
  res,
  query,
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


  if (query["spreadsheetLink"] && query["range"]) {
    res.setHeader("Set-Cookie", [
      `spreadsheetLink=${query["spreadsheetLink"]}; Expires=Wed, 01 Jan 2025 07:28:00 GMT;`,
      `range=${query["range"]}; Expires=Wed, 01 Jan 2025 07:28:00 GMT;`,
    ]);
  }

  return {
    props: { user: {} as User },
  };
},
sessionOptions);
