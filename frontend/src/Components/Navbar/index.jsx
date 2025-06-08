import React from 'react'
import styles from "./styles.module.css"
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer'; 

export default function NavBarComponent() {

    const router = useRouter();
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();

  return (
   <div className={styles.container}>
    <nav className={styles.navBar}>
     <h1 style={{cursor:"pointer"}} onClick={() => {
        router.push("/")
     }}>Pro connect</h1>
     <div className={styles.navOptionContainer}>

     {authState.profileFetched && <div>
       <div style = {{display : "flex" , gap: "1.2rem"}}>
          <p onClick={() => {
            router.push("/profile")
          }} style={{fontWeight : "bold", cursor: "pointer"}}>Profile</p>

          <p onClick={() => {
            localStorage.removeItem("token")
            router.push("/login")
            dispatch(reset())
          }}
           style={{fontWeight : "bold", cursor: "pointer"}}>Logout</p>
       </div>
      </div>}

     {!authState.profileFetched && <div onClick={ () => {
           router.push("/login")
          }} className={styles.buttonJoin}>
          <p>Be a part  </p>
      </div>}

     </div>
    </nav>
   </div>
  )
}