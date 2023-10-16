import { BackgroundImage, Image } from "@mantine/core";
import Header from "../Header";
import Footer from "../Footer";

function Home() {
  return (
    <>
      <div>
        <Header title="Genshin Wiki" page="home" />

        <Image src="/image/Aether.mondstadt.jpg" />
        <Image src="/image/GenshinBackground.jpg" />
      </div>
      <Footer />
    </>
  );
}

export default Home;
