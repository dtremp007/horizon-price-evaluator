import { Modal, Select, TextInput, Button, Flex } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Listing } from "../../../lib/types/listings";
import { v4 as uuidv4 } from "uuid";
import useFilterContext from "../../listings/filters/FilterContext";
import { apiFetch } from "../../../lib/utils/api-fetch";
import { useState } from "react";

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
          apiFetch("/api/listings", {
            method: "POST",
            body: JSON.stringify(values),
          }).then((res) => {
            onSave(values);
            setUploading(false);
            onClose();
          });
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
          <Button type="submit" sx={{ alignSelf: "flex-end" }} loading={uploading}>
            Save
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};

export default AddListingModal;
