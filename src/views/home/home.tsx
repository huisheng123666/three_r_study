import { FC, useEffect, useRef } from "react";
import styles from "./home.module.scss";
import { Word } from "../../utils/three_basic";

const Home: FC = () => {
  const word = useRef<Word>();

  useEffect(() => {
    word.current = new Word(document.querySelector("#home") as HTMLElement);
    word.current.resize();
    word.current.render();

    const resize = () => {
      word.current?.resize();
    };

    word.current.addHelper();

    loadModel();

    window.addEventListener("resize", resize);

    return () => {
      word.current?.destroy();
      window.removeEventListener("resize", resize);
    };
  }, []);

  function loadModel() {
    word.current?.loaderModel("/园区.glb", (data) => {
      console.log(data);
      word.current?.scene?.add(data.scene);
    });
  }

  return <div className={styles.home} id="home"></div>;
};

export default Home;
