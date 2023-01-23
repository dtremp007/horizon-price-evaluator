import { Modal, Select, TextInput, Button, Flex, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Listing } from "../../../lib/types/listings";
import { v4 as uuidv4 } from "uuid";
import useFilterContext from "../../listings/filters/FilterContext";
import { apiFetch } from "../../../lib/utils/api-fetch";
import { useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { SheetData } from "../../../pages/api/spreadsheet";
import { resolveDataStructure } from "../../../lib/spreadsheet/resolve-data-structure";
import { useResolverFunction } from "./use-resolver-function";

const CRUCIAL_FIELDS = [
  "id",
  "title",
  "price",
  "lat",
  "lng",
  "category",
  "date_scraped",
] as (keyof Listing)[];

export interface AddListingModalProps {
  lat: number;
  lng: number;
  opened: boolean;
  onClose: () => void;
  onSave: (listing: Listing) => void;
}

const AddListingModal = ({
  lat,
  lng,
  opened,
  onClose,
  onSave,
}: AddListingModalProps) => {
  const { availableCategories } = useFilterContext();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheetData, setSheetData] = useLocalStorage<SheetData[]>({
    key: "sheetData",
    defaultValue: [],
  });
  const resolve = useResolverFunction({ crucialKeys: CRUCIAL_FIELDS });

  const form = useForm<Listing>({
    initialValues: {
      id: uuidv4(),
      title: "Test Property",
      price: "$1000",
      lat,
      lng,
      url: "",
      thumbnail: "",
      category: "lote",
      campo: "",
      date_scraped: new Date().toISOString().slice(0, 10),
    },
  });

  return (
    <Modal opened={opened} onClose={onClose} title="Add Listing">
      <form
        onSubmit={form.onSubmit((values) => {
          setUploading(true);
          setError(null);

          try {
            const data = resolve(values);

            apiFetch("/api/listings", {
              method: "POST",
              body: JSON.stringify(data),
            }).then((res) => {
              if (!res.ok) {
                setUploading(false);
                res.json().then((data) => setError(data.message));
                return;
              }
              onSave(values);
              setUploading(false);
              onClose();
            });
          } catch (error) {
            setError((error as Error).message);
            setUploading(false);
          }
        })}
      >
        <Flex direction="column">
          <TextInput
            label="Title"
            name="title"
            required
            {...form.getInputProps("title")}
          />
          <TextInput
            label="Price"
            name="price"
            required
            {...form.getInputProps("price")}
          />
          <TextInput label="URL" name="url" {...form.getInputProps("url")} />
          <TextInput
            label="Image"
            name="thumbnail"
            {...form.getInputProps("thumbnail")}
          />
          <Select
            label="Category"
            name="category"
            required
            data={availableCategories}
            {...form.getInputProps("category")}
          />
          <TextInput
            label="Campo"
            name="campo"
            {...form.getInputProps("campo")}
          />
          <Flex justify="space-between">
            <Text color="red">{error}</Text>
            <Button type="submit" loading={uploading}>
              Save
            </Button>
          </Flex>
        </Flex>
      </form>
    </Modal>
  );
};

export default AddListingModal;
