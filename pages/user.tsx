import { Button } from "@mantine/core";
import { withIronSessionSsr } from "iron-session/next";
import fetchJson from "../lib/auth/fetchJson";
import { sessionOptions, User } from "../lib/auth/session";
import useUser from "../lib/auth/useUser";

type UserPageProps = {
  user: User;
};

export default function UserPage({ user }: UserPageProps) {
  const { mutateUser } = useUser();

  return (
    <div>
      <div>{user.email}</div>
      <Button
        onClick={() => mutateUser(fetchJson("/api/logout", { method: "POST" }))}
      >
        Logout
      </Button>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;

  if (user === undefined) {
    res.setHeader("location", "/login");
    res.statusCode = 302;
    res.end();
    return {
      props: {
        user: {} as User,
      },
    };
  }

  return {
    props: { user: req.session.user },
  };
},
sessionOptions);
