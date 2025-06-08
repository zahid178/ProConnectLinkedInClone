import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

const inter = Inter({ subsets: ["latin"]});


export default function Home() {
  const router = useRouter();
  return (
    <UserLayout> 
     <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.mainContainer_left}>
        <p >Connect with friends without exaggration</p>
        <p>A ture social media platfrom, with stories no bulfs!</p>
        <div onClick={ () => {
           router.push("/login")
          }} className={styles.buttonJoin}>
          <p>Join Now </p>
        </div>
        </div>
        <div className={styles.mainContainer_right}>
          <img src="images/homemain_connection.jpg" alt="" />
        </div>
      </div>
     </div>
     </UserLayout>
  );
}