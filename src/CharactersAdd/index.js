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
  Textarea,
  MantineProvider,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useState, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { addCharacter, uploadCharacterImage } from "../api/characters";
import { useCookies } from "react-cookie";
import { fetchElements } from "../api/elements";
import { fetchRegions } from "../api/regions";
import { fetchWeapontypes } from "../api/weapontypes";
import Footer from "../Footer";

function CharactersAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [quality, setQuality] = useState("");
  const [element, setElement] = useState("");
  const [weapontype, setWeapontype] = useState("");
  const [region, setRegion] = useState("");
  const [birthday, setBirthday] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [image, setImage] = useState("");
  const [detail, setDetail] = useState("");
  const [constellation, setConstellation] = useState("");
  const [uploading, setUploading] = useState(false);
  const { data: elements } = useQuery({
    queryKey: ["elements"],
    queryFn: () => fetchElements(),
  });
  const { data: regions } = useQuery({
    queryKey: ["regions"],
    queryFn: () => fetchRegions(),
  });
  const { data: weapontypes } = useQuery({
    queryKey: ["weapontypes"],
    queryFn: () => fetchWeapontypes(),
  });

  const memoryElements = queryClient.getQueryData(["elements"]);
  const elementOptions = useMemo(() => {
    let options = [];
    if (elements && elements.length > 0) {
      elements.forEach((element) => {
        if (!options.includes(element)) {
          options.push(element);
        }
      });
    }
    return options;
  }, [memoryElements]);

  const memoryRegions = queryClient.getQueryData(["regions"]);
  const regionOptions = useMemo(() => {
    let options = [];
    if (regions && regions.length > 0) {
      regions.forEach((region) => {
        if (!options.includes(region)) {
          options.push(region);
        }
      });
    }
    return options;
  }, [memoryRegions]);

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
    mutationFn: addCharacter,
    onSuccess: () => {
      notifications.show({
        title: "Character Added",
        color: "green",
      });
      navigate("/characters");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewCharacters = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        name: name,
        quality: quality,
        element: element,
        weapontype: weapontype,
        region: region,
        birthday: birthday,
        release_date: releaseDate,
        image: image,
        detail: detail,
        constellation: constellation,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: uploadCharacterImage,
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
          Add New Character
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
                  placeholder="Enter the character name here"
                  label="Name"
                  description="The name of the character"
                  withAsterisk
                  onChange={(event) => setName(event.target.value)}
                />
              </Grid.Col>
              <Space h="20px" />
              <Grid.Col span={6}>
                <TextInput
                  value={quality}
                  placeholder="Enter the character quality here"
                  label="Quality"
                  description="The quality of the character"
                  withAsterisk
                  onChange={(event) => setQuality(event.target.value)}
                />
              </Grid.Col>
              <Space h="20px" />
              <Grid.Col>
                {image && image !== "" ? (
                  <>
                    <Image
                      src={"http://localhost:5000/" + image}
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
              <Grid.Col span={4}>
                <select
                  value={element}
                  onChange={(event) => {
                    setElement(event.target.value);
                  }}
                >
                  <option value="">All Elements</option>
                  {elementOptions.map((element) => {
                    return (
                      <option key={element._id} value={element._id}>
                        {element.name}
                      </option>
                    );
                  })}
                </select>
              </Grid.Col>
              <Grid.Col span={4}>
                <select
                  value={region}
                  onChange={(event) => {
                    setRegion(event.target.value);
                  }}
                >
                  <option value="">All Regions</option>
                  {regionOptions.map((region) => {
                    return (
                      <option key={region._id} value={region._id}>
                        {region.name}
                      </option>
                    );
                  })}
                </select>
              </Grid.Col>
              <Grid.Col span={4}>
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
              <Divider />
              <Space h="20px" />
              <Grid.Col span={6}>
                <TextInput
                  value={birthday}
                  placeholder="Enter the character birthday here"
                  label="Birthday"
                  description="The birthday of the character"
                  withAsterisk
                  onChange={(event) => setBirthday(event.target.value)}
                />
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
              \
              <Grid.Col>
                <Textarea
                  value={constellation}
                  placeholder="Enter the character constellation here"
                  label="Constellation"
                  description="The constellation of the character"
                  withAsterisk
                  onChange={(event) => setConstellation(event.target.value)}
                />
              </Grid.Col>
              <Grid.Col>
                <Textarea
                  value={detail}
                  placeholder="Enter the character details here"
                  label="Detail"
                  description="The detail of the character"
                  withAsterisk
                  minRows={10}
                  onChange={(event) => setDetail(event.target.value)}
                />
              </Grid.Col>
            </Grid>
            <Space h="20px" />
            <Button fullWidth onClick={handleAddNewCharacters}>
              Add New Character
            </Button>
          </Card>
        </MantineProvider>
        <Space h="20px" />
        <Group position="center">
          <Button
            component={Link}
            to="/characters"
            variant="subtle"
            size="xs"
            color="gray"
          >
            Go back to Characters
          </Button>
        </Group>
        <Space h="100px" />
      </Container>
      <Footer />
    </>
  );
}

export default CharactersAdd;
