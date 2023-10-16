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
  MantineProvider,
} from "@mantine/core";
import Footer from "../Footer";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { addRegion, uploadRegionImage } from "../api/regions";
import { useCookies } from "react-cookie";
import { AiOutlinePlusSquare, AiOutlineRollback } from "react-icons/ai";

function RegionAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const createMutation = useMutation({
    mutationFn: addRegion,
    onSuccess: () => {
      notifications.show({
        title: "Region Added",
        color: "green",
      });
      navigate("/regions");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewRegion = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        name: name,
        image: image,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: uploadRegionImage,
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
      <Container>
        <Space h="50px" />
        <Title order={2} align="center">
          Add New Region
        </Title>
        <Space h="50px" />
        <MantineProvider
          theme={{
            fontFamily: "Rajdhani, sans-serif",
          }}
        >
          <Card withBorder shadow="md" p="20px">
            <TextInput
              value={name}
              placeholder="Enter the region name here"
              label="Name"
              description="The name of the region"
              withAsterisk
              onChange={(event) => setName(event.target.value)}
            />
            <Space h="20px" />
            {image && image !== "" ? (
              <>
                <Image src={"10.1.104.2:5000/" + image} width="100%" />
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
            <Group position="center">
              <Button
                size="md"
                sx={{
                  color: "white",
                  border: "1px solid black",
                  background: "addreg" ? "black" : "none",
                  "&:hover": { backgroundColor: "#808080" },
                }}
                onClick={handleAddNewRegion}
              >
                <AiOutlinePlusSquare /> New Region
              </Button>
            </Group>
          </Card>

          <Space h="20px" />
          <Group position="center">
            <Button
              component={Link}
              to="/regions"
              variant="gradient"
              size="sm"
              gradient={{ from: "blue", to: "purple", deg: 105 }}
            >
              <AiOutlineRollback />
              Back to Regions
            </Button>
          </Group>
        </MantineProvider>
        <Space h="50px" />
      </Container>
      <Footer />
    </>
  );
}
export default RegionAdd;
