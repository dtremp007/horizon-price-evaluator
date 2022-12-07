import { Button, Center, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import fetchJson, { FetchError } from "../lib/auth/fetchJson";
import { sessionOptions } from "../lib/auth/session";
import useUser from "../lib/auth/useUser";

export default function Login() {
  const { mutateUser } = useUser();


  const [errorMsg, setErrorMsg] = useState("");

  const form = useForm({
    initialValues: { email: "", password: "" },
  });

  return (
    <Center>
      <form
        onSubmit={form.onSubmit(async function (values) {
          try {
            mutateUser(
              await fetchJson("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              })
            );
          } catch (error) {
            if (error instanceof FetchError) {
              setErrorMsg(error.data.message);
            } else {
              console.error("An unexpected error happened:", error);
            }
          }
        })}
      >
        <TextInput label="Email" {...form.getInputProps("email")} />
        <PasswordInput label="Password" {...form.getInputProps("password")} />
        <Button type="submit">Login</Button>
        {errorMsg && <p>{errorMsg}</p>}
      </form>
    </Center>
  );
}
