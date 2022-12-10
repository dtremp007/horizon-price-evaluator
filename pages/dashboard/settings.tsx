import {
  ActionIcon,
  Button,
  Center,
  CopyButton,
  Divider,
  Flex,
  Popover,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconHelp } from "@tabler/icons";
import Cookies from "js-cookie";
import { buildLink } from "../../lib/utils/build-link";

export default function Settings() {
  const form = useForm({
    initialValues: {
      spreadsheetLink: Cookies.get("spreadsheetLink") || "",
      range: Cookies.get("range") || "",
    },
  });
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Flex direction="column" sx={{
        maxWidth: 600,
        marginLeft: 64,
    }}>
    <Divider label={<Title order={3}>Spreadsheet</Title>}/>
      <form
        onSubmit={form.onSubmit((values) => {
          Cookies.set("spreadsheetLink", values.spreadsheetLink);
          Cookies.set("range", values.range);
        })}
      >
        <Flex direction="column" align="flex-start">
          <TextInput
            label="Paste spreadsheet link in here."
            {...form.getInputProps("spreadsheetLink")}
          />
          <TextInput
            label={
              <Flex justify="space-between" align="center">
                <Text>Sheet Range</Text>
                <Popover
                  width={200}
                  position="top"
                  withArrow
                  shadow="md"
                  opened={opened}
                >
                  <Popover.Target>
                    <ActionIcon onMouseEnter={open} onMouseLeave={close}>
                      <IconHelp size={16} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Text>
                      The range is the sheet name name followed by an
                      exclamation point, followed by the cell range. For
                      example, Sheet1!A1:G
                    </Text>
                  </Popover.Dropdown>
                </Popover>
              </Flex>
            }
            placeholder="Sheet1!A1:G"
            {...form.getInputProps("range")}
          />
          <Button type="submit">Apply</Button>
        </Flex>
      </form>
    <Divider label={<Title order={3}>Share This Page</Title>}/>
    <Flex>
    <CopyButton value={buildLink(form.values)}>
      {({ copied, copy }) => (
        <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
          {copied ? 'Copied url' : 'Copy url'}
        </Button>
      )}
    </CopyButton>
    </Flex>

    </Flex>
  );
}
