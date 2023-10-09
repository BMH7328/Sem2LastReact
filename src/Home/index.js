import { Container, Space, Group } from "@mantine/core";
import Header from "../Header";

import Elements from "../Elements";
import Characters from "../Characters";

function Home() {
  return (
    <>
      <Header title="Genshin Wiki Replica" page="home" />
      <Container size="100%">
        <Space h="50px" />

        <Space h="30px" />
      </Container>
    </>
  );
}

export default Home;
