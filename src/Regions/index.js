import { Link } from "react-router-dom";
import { Group, Space, Button, Image, Table, Container } from "@mantine/core";
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
      <Container>
        <Space h="20px" />{" "}
        <Group position="right">
          {isAdmin && (
            <Button
              component={Link}
              to="/regions_add"
              variant="gradient"
              gradient={{ from: "yellow", to: "purple", deg: 105 }}
            >
              Add New Region
            </Button>
          )}
        </Group>
        <Space h="20px" />
        <Table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          {regions ? (
            regions.map((region) => {
              return (
                <tbody>
                  <tr key={region._id}>
                    <td>
                      {region.image && region.image !== "" ? (
                        <>
                          <Image
                            src={"http://localhost:5000/" + region.image}
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
                    <td>{region.name}</td>
                    <td>
                      {isAdmin && (
                        <Button
                          variant="outline"
                          color="red"
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
                </tbody>
              );
            })
          ) : (
            <Group position="center">
              <Space h="120px" />
              <h1 className="text-center text-muted">No Region yet .</h1>
            </Group>
          )}
        </Table>
      </Container>
      <Space h="50px" />
      <Footer />
    </>
  );
}
