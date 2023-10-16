import { Link } from "react-router-dom";
import {
  Group,
  Space,
  Button,
  Image,
  Table,
  Container,
  Text,
  MantineProvider,
} from "@mantine/core";
import { useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchRegions, deleteRegion } from "../api/regions";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";
import Header from "../Header";
import Footer from "../Footer";

export default function Regions() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const { data: regions } = useQuery({
    queryKey: ["regions"],
    queryFn: () => fetchRegions(),
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  const deleteMutation = useMutation({
    mutationFn: deleteRegion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["regions"],
      });
      notifications.show({
        title: "Region Deleted",
        color: "green",
      });
    },
  });

  return (
    <>
      <Header title="Regions" page="regions" />
      <Container size="90%">
        <Space h="20px" />{" "}
        <Group position="right">
          {isAdmin && (
            <MantineProvider
              theme={{
                fontFamily: "Rajdhani, sans-serif",
              }}
            >
              <Button
                component={Link}
                to="/regions_add"
                size="md"
                sx={{
                  color: "white",
                  border: "1px solid black",
                  background: "4" ? "black" : "none",
                  "&:hover": { backgroundColor: "#808080" },
                }}
              >
                Add New Region
              </Button>
            </MantineProvider>
          )}
        </Group>
        <Space h="20px" />
        <MantineProvider
          theme={{
            fontFamily: "Rajdhani, sans-serif",
          }}
        >
          <Table horizontalSpacing="xl" striped>
            <thead>
              <tr>
                <th>
                  <Text size={"20px"}>Image</Text>
                </th>
                <th>
                  <Text size={"20px"}>Name</Text>
                </th>
                <th>
                  <Text size={"20px"}>Actions</Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {regions ? (
                regions.map((region) => {
                  return (
                    <tr key={region._id}>
                      <td>
                        {region.image && region.image !== "" ? (
                          <>
                            <Image
                              src={"http://10.1.104.2:5000/" + region.image}
                              width="500px"
                            />
                          </>
                        ) : (
                          <Image
                            src={
                              "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                            }
                            width="100px"
                          />
                        )}
                      </td>
                      <td>
                        <Text weight={500} size={"20px"}>
                          {region.name}
                        </Text>
                      </td>
                      <td>
                        {isAdmin && (
                          <Button
                            sx={{
                              backgroundColor: "#FFFFFF",
                              color: "black",
                              border: "2px solid red",
                              "&:hover": { backgroundColor: "#FF0000" },
                            }}
                            position="right"
                            onClick={() => {
                              deleteMutation.mutate({
                                id: region._id,
                                token: currentUser ? currentUser.token : "",
                              });
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <Group position="center">
                  <Space h="120px" />
                  <h1 className="text-center text-muted">
                    No Region added yet .
                  </h1>
                </Group>
              )}
            </tbody>
          </Table>
        </MantineProvider>
      </Container>
      <Space h="50px" />
      <Footer />
    </>
  );
}
