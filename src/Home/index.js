import { BackgroundImage, Image } from "@mantine/core";
import Header from "../Header";
import Footer from "../Footer";

function Home() {
  return (
    <>
      <div>
        <Header title="Genshin Wiki Replica" page="home" />

        <Image src="/image/Aether.mondstadt.jpg" />
      </div>
      <Footer />
    </>
  );
}

export default Home;
