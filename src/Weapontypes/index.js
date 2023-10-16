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
import { fetchWeapontypes, deleteWeapontype } from "../api/weapontypes";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";
import Header from "../Header";
import Footer from "../Footer";

export default function Weapontypes() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const { data: weapontypes } = useQuery({
    queryKey: ["weapontypes"],
    queryFn: () => fetchWeapontypes(),
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  const deleteMutation = useMutation({
    mutationFn: deleteWeapontype,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["weapontypes"],
      });
      notifications.show({
        title: "Weapon Type Deleted",
        color: "green",
      });
    },
  });

  return (
    <>
      <Header title="Weapon Types" page="weapontypes" />
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
                to="/weapontypes_add"
                size="md"
                sx={{
                  color: "white",
                  border: "1px solid black",
                  background: "5" ? "black" : "none",
                  "&:hover": { backgroundColor: "#808080" },
                }}
              >
                Add New Weapon Type
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
                  <Text size={"20px"}>Info</Text>
                </th>
                <th>
                  <Text size={"20px"}>Actions</Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {weapontypes ? (
                weapontypes.map((weapontype) => {
                  return (
                    <tr key={weapontype._id}>
                      <td>
                        {weapontype.image && weapontype.image !== "" ? (
                          <>
                            <Image
                              src={"http://10.1.104.2:5000/" + weapontype.image}
                              width="200px"
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
                          {weapontype.name}
                        </Text>
                      </td>
                      <td>
                        <Text weight={500} size={"20px"}>
                          {weapontype.info}
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
                                id: weapontype._id,
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
                    No Weapon Type added yet .
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
