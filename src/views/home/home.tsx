import { FC, useEffect } from "react";
import styles from "./home.module.scss";
import { Word } from "../../utils/three_basic";

const Home: FC = () => {
  useEffect(() => {
    const word = new Word(document.querySelector("#home") as HTMLElement);
    word.resize();
    word.render();

    const resize = () => {
      word.resize();
    };

    window.addEventListener("resize", resize);

    return () => {
      word.destroy();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <div className={styles.home} id="home"></div>;
};

export default Home;
