import { useEffect } from "react";
import Router from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { User } from "./session";


export default function useUser({ redirectTo = "/login" } = {}) {
  const { data: user, mutate: mutateUser } = useSWR<User>("/api/user");

  useEffect(() => {
    if (!user) {
      Router.push(redirectTo);
    }
  }, [user]);

  return { user, mutateUser };
}
