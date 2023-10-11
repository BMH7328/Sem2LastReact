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
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useState, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getWeapon, updateWeapon, uploadWeaponImage } from "../api/weapons";
import { useCookies } from "react-cookie";
import { fetchWeapontypes } from "../api/weapontypes";
import Footer from "../Footer";

function WeaponsEdit() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [quality, setQuality] = useState("");
  const [weapontype, setWeapontype] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const { isLoading } = useQuery({
    queryKey: ["weapon", id],
    queryFn: () => getWeapon(id),
    onSuccess: (data) => {
      setName(data.name);
      setQuality(data.quality);
      setWeapontype(data.weapontype);
      setReleaseDate(data.release_date);
      setImage(data.image);
    },
  });
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

  const updateMutation = useMutation({
    mutationFn: updateWeapon,
    onSuccess: () => {
      notifications.show({
        title: "Weapon Edited",
        color: "green",
      });
      navigate("/");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleUpdateWeapons = async (event) => {
    event.preventDefault();
    updateMutation.mutate({
      id: id,
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
          Edit Weapon
        </Title>
        <Space h="50px" />
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
                <option value="">All Weapon Types</option>
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
                placeholder="Enter the character release date here"
                label="Release Date"
                description="The release date of the character"
                withAsterisk
                onChange={(event) => setReleaseDate(event.target.value)}
              />
            </Grid.Col>
          </Grid>
          <Space h="20px" />
          <Button fullWidth onClick={handleUpdateWeapons}>
            Add New Weapon
          </Button>
        </Card>
        <Space h="20px" />
        <Group position="center">
          <Button
            component={Link}
            to="/"
            variant="subtle"
            size="xs"
            color="gray"
          >
            Go back to Home
          </Button>
        </Group>
        <Space h="50px" />
      </Container>
      <Footer />
    </>
  );
}

export default WeaponsEdit;
