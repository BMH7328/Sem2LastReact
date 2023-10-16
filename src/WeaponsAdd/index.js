import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Divider,
  Button,
  Group,
  Image,
  Grid,
  MantineProvider,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useState, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { addWeapon, uploadWeaponImage } from "../api/weapons";
import { useCookies } from "react-cookie";
import { fetchWeapontypes } from "../api/weapontypes";
import { AiOutlinePlusSquare, AiOutlineRollback } from "react-icons/ai";
import Footer from "../Footer";

function WeaponsAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [quality, setQuality] = useState("");
  const [weapontype, setWeapontype] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const { data: weapontypes } = useQuery({
    queryKey: ["weapontypes"],
    queryFn: () => fetchWeapontypes(),
  });

  const memoryWeapontypes = queryClient.getQueryData(["weapontypes"]);
  const weapontypeOptions = useMemo(() => {
    let options = [];
    if (weapontypes && weapontypes.length > 0) {
      weapontypes.forEach((weapontype) => {
        if (!options.includes(weapontype)) {
          options.push(weapontype);
        }
      });
    }
    return options;
  }, [memoryWeapontypes]);

  const createMutation = useMutation({
    mutationFn: addWeapon,
    onSuccess: () => {
      notifications.show({
        title: "Weapon Added",
        color: "green",
      });
      navigate("/weapons");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewWeapons = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        name: name,
        quality: quality,
        weapontype: weapontype,
        release_date: releaseDate,
        image: image,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: uploadWeaponImage,
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
          Add Weapon
        </Title>
        <Space h="50px" />
        <MantineProvider
          theme={{
            fontFamily: "Rajdhani, sans-serif",
          }}
        >
          <Card withBorder shadow="md" p="20px">
            <Grid gutter={20}>
              <Grid.Col span={6}>
                <TextInput
                  value={name}
                  placeholder="Enter the weapon name here"
                  label="Name"
                  description="The name of the weapon"
                  withAsterisk
                  onChange={(event) => setName(event.target.value)}
                />
              </Grid.Col>
              <Space h="20px" />
              <Grid.Col span={6}>
                <TextInput
                  value={quality}
                  placeholder="Enter the weapon quality here"
                  label="Quality"
                  description="The quality of the weapon"
                  withAsterisk
                  onChange={(event) => setQuality(event.target.value)}
                />
              </Grid.Col>
              <Space h="20px" />
              <Grid.Col>
                {image && image !== "" ? (
                  <>
                    <Image
                      src={"http://10.1.104.2:5000/" + image}
                      width="100%"
                    />
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
              </Grid.Col>
              <Space h="20px" />
              <Divider />
              <Space h="20px" />
              <Grid.Col span={6}>
                <select
                  value={weapontype}
                  onChange={(event) => {
                    setWeapontype(event.target.value);
                  }}
                >
                  <option value="">Select Weapon Type</option>
                  {weapontypeOptions.map((weapontype) => {
                    return (
                      <option key={weapontype._id} value={weapontype._id}>
                        {weapontype.name}
                      </option>
                    );
                  })}
                </select>
              </Grid.Col>
              <Space h="20px" />
              <Grid.Col span={6}>
                <TextInput
                  value={releaseDate}
                  placeholder="Enter the weapon release date here"
                  label="Release Date"
                  description="The release date of the weapon"
                  withAsterisk
                  onChange={(event) => setReleaseDate(event.target.value)}
                />
              </Grid.Col>
            </Grid>
            <Space h="20px" />
            <Group position="center">
              <Button
                size="md"
                sx={{
                  color: "white",
                  border: "1px solid black",
                  background: "addwea" ? "black" : "none",
                  "&:hover": { backgroundColor: "#808080" },
                }}
                onClick={handleAddNewWeapons}
              >
                <AiOutlinePlusSquare /> New Weapon
              </Button>
            </Group>
          </Card>
          <Space h="20px" />
          <Group position="center">
            <Button
              component={Link}
              to="/weapons"
              variant="gradient"
              size="sm"
              gradient={{ from: "blue", to: "purple", deg: 105 }}
            >
              <AiOutlineRollback />
              Back to Weapons
            </Button>
          </Group>
        </MantineProvider>
        <Space h="100px" />
      </Container>
      <Footer />
    </>
  );
}

export default WeaponsAdd;
