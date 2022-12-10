import { Button, Center, Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import Cookies from "js-cookie";

export default function Settings() {
  const form = useForm({
    initialValues: {
      spreadsheetLink: Cookies.get("spreadsheetLink") || "",
      range: Cookies.get("range") || "",
    },
  });
  return (
    <Center>
      <form
        onSubmit={form.onSubmit((values) => {
            Cookies.set("spreadsheetLink", values.spreadsheetLink);
            Cookies.set("range", values.range);
        })}
      >
        <Flex direction="column">
          <TextInput
            label="Paste spreadsheet link in here."
            {...form.getInputProps("spreadsheetLink")}
          />
          <TextInput
            label="Range"
            placeholder="Sheet1!A1:G"
            {...form.getInputProps("range")}
          />
          <Button type="submit">Apply</Button>
        </Flex>
      </form>
    </Center>
  );
}
