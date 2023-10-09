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
import Header from "../Header";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { addWeapontype, uploadWeapontypeImage } from "../api/weapontypes";
import { useCookies } from "react-cookie";

function WeapontypeAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [info, setInfo] = useState("");
  const [uploading, setUploading] = useState(false);

  const createMutation = useMutation({
    mutationFn: addWeapontype,
    onSuccess: () => {
      notifications.show({
        title: "Weapontype Added",
        color: "green",
      });
      navigate("/weapontypes");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewWeapontype = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        name: name,
        image: image,
        info: info,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: uploadWeapontypeImage,
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
    <Container>
      <Space h="50px" />
      <Header title="Add New Weapon Type" page="weapontypes_add" />
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={name}
          placeholder="Enter the weapon type name here"
          label="Name"
          description="The name of the weapon type"
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
          value={info}
          placeholder="Enter the weapon type info here"
          label="Info"
          description="The info of the weapon type"
          withAsterisk
          onChange={(event) => setInfo(event.target.value)}
        />
        <Space h="20px" />
        <Button fullWidth onClick={handleAddNewWeapontype}>
          Add New Weapontype
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
  );
}
export default WeapontypeAdd;
