import { useState } from "react";
import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Button,
  Group,
  Image,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import Header from "../Header";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { addElement, uploadElementImage } from "../api/elements";
import { useCookies } from "react-cookie";

function ElementAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [archon, setArchon] = useState("");
  const [uploading, setUploading] = useState(false);

  const createMutation = useMutation({
    mutationFn: addElement,
    onSuccess: () => {
      notifications.show({
        title: "Element Added",
        color: "green",
      });
      navigate("/elements");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewElement = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        name: name,
        image: image,
        archon: archon,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: uploadElementImage,
    onSuccess: (data) => {
      setImage(data.image_url);
      setUploading(false);
    },
    onError: (error) => {
      setUploading(false);
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleImageUpload = (files) => {
    uploadMutation.mutate(files[0]);
    setUploading(true);
  };

  return (
    <>
      <Header title="Add New Element" page="elements_add" />
      <Container>
        <Space h="50px" />
        <Card withBorder shadow="md" p="20px">
          <TextInput
            value={name}
            placeholder="Enter the element name here"
            label="Name"
            description="The name of the element"
            withAsterisk
            onChange={(event) => setName(event.target.value)}
          />
          <Space h="20px" />
          {image && image !== "" ? (
            <>
              <Image src={"http://localhost:5000/" + image} width="100%" />
              <Button color="dark" mt="15px" onClick={() => setImage("")}>
                Remove Image
              </Button>
            </>
          ) : (
            <Dropzone
              mutiple={false}
              accept={IMAGE_MIME_TYPE}
              onDrop={(files) => {
                handleImageUpload(files);
              }}
            >
              <Title order={4} align="center" py="20px">
                Click To Upload Or Drag Image To Upload
              </Title>
            </Dropzone>
          )}
          <Space h="20px" />
          <TextInput
            value={archon}
            placeholder="Enter the element archon here"
            label="Archon"
            description="The archon of the element"
            withAsterisk
            onChange={(event) => setArchon(event.target.value)}
          />
          <Space h="20px" />
          <Button fullWidth onClick={handleAddNewElement}>
            Add New Element
          </Button>
        </Card>
        <Space h="20px" />
        <Group position="center">
          <Button
            component={Link}
            to="/"
            variant="gradient"
            size="xs"
            gradient={{ from: "blue", to: "purple", deg: 105 }}
          >
            Go back to Home
          </Button>
        </Group>
        <Space h="100px" />
      </Container>
    </>
  );
}
export default ElementAdd;
