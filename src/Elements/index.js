import { Link } from "react-router-dom";
import {
  Group,
  Space,
  Button,
  Image,
  Table,
  Text,
  Container,
  MantineProvider,
} from "@mantine/core";
import { useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchElements, deleteElement } from "../api/elements";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";
import Header from "../Header";
import Footer from "../Footer";

export default function Elements() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const { data: elements } = useQuery({
    queryKey: ["elements"],
    queryFn: () => fetchElements(currentUser ? currentUser.token : ""),
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  const deleteMutation = useMutation({
    mutationFn: deleteElement,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["elements"],
      });
      notifications.show({
        title: "Element Deleted",
        color: "green",
      });
    },
  });

  return (
    <>
      <Header title="Elements" page="elements" />
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
                to="/elements_add"
                size="md"
                sx={{
                  color: "white",
                  border: "1px solid black",
                  background: "3" ? "black" : "none",
                  "&:hover": { backgroundColor: "#808080" },
                }}
              >
                Add New Element
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
                  <Text size={"20px"}>Archon</Text>
                </th>
                <th>
                  <Text size={"20px"}>Actions</Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {elements ? (
                elements.map((element) => {
                  return (
                    <tr key={element._id}>
                      <td>
                        {element.image && element.image !== "" ? (
                          <>
                            <Image
                              src={"10.1.104.2:5000/" + element.image}
                              width="100px"
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
                          {element.name}
                        </Text>
                      </td>
                      <td>
                        <Text weight={500} size={"20px"}>
                          {element.archon}
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
                                id: element._id,
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
                    No Element added yet .
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
