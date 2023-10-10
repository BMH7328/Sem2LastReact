import { Link } from "react-router-dom";
import { Group, Space, Button, Image, Table, Container } from "@mantine/core";
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
      <Container>
        <Space h="20px" />{" "}
        <Group position="right">
          {isAdmin && (
            <Button
              component={Link}
              to="/elements_add"
              variant="gradient"
              gradient={{ from: "yellow", to: "purple", deg: 105 }}
            >
              Add New Element
            </Button>
          )}
        </Group>
        <Space h="20px" />
        <Table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Archon</th>
              <th>Actions</th>
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
                            src={"http://localhost:5000/" + element.image}
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
                    <td>{element.name}</td>
                    <td>{element.archon}</td>
                    <td>
                      {isAdmin && (
                        <Button
                          variant="outline"
                          color="red"
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
                <h1 className="text-center text-muted">No Element yet .</h1>
              </Group>
            )}
          </tbody>
        </Table>
      </Container>
      <Space h="50px" />
      <Footer />
    </>
  );
}
