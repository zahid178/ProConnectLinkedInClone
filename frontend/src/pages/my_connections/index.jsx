import UserLayout from "@/layout/UserLayout"; 
import DashboardLayout from "@/layout/DashboardLayout";
import { useSearchParams } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getAllPosts} from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import axios from 'axios';
import { BASE_URL, clientServer } from "@/config";
import { AcceptConnection, getMyConnectionRequests} from "@/config/redux/action/authAction";
import styles from "./index.module.css"

export default function MyConnetionsPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const Router = useRouter();

  useEffect(() => {
    dispatch(getMyConnectionRequests({token: localStorage.getItem("token")}));
  }, [])

  useEffect(() => {
     if(authState.connectionRequest && authState.connectionRequest.length != 0) {
      console.log(authState.connectionRequest)
     }
  }, [authState.connectionRequest])

  return (
    // <div>
        <UserLayout>
         <DashboardLayout>
          <div style={{display: "flex", flexDirection: "column", gap: "1.7rem"}}>
            <h4>My Connection</h4>
            {authState.connectionRequest.length === 0 && <h1>No Connection Request Pending</h1> }
              {authState.connectionRequest && authState.connectionRequest.length !=0 && authState.connectionRequest.filter((connection) => connection.status_accepted === null).map((user , index) => {
                return(
                 <div onClick= {() => {
                  Router.push(`/view_profile/${user.userId.username}`)
                 }}
                  className={styles.userCard} key={index}>
                  <div style={{display: "flex", alignItems: "center", gap: "1.2rem" }}> 
                    <div className={styles.profilePicture}>
                         <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p>{user.userId.username}</p>
                    </div>
                    <button onClick={(e) => {
                      e.stopPropagation();
                      dispatch(AcceptConnection({
                        connectionId: user._id,
                        token: localStorage.getItem("token"),
                        action: "accept"
                      }))
                    }} className={styles.connectedButton}>Accept</button>
                  </div>
                 </div>
                )
              })}

            <h4>My Network</h4>
           
              {authState.connectionRequest.filter((connection) => connection.status_accepted !== null).map((user, index) => {
              return(
                  <div onClick= {() => {
                  Router.push(`/view_profile/${user.userId.username}`)
                 }}
                  className={styles.userCard} key={index}>
                  <div style={{display: "flex", alignItems: "center", gap: "1.2rem" }}> 
                    <div className={styles.profilePicture}>
                         <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p>{user.userId.username}</p>
                    </div>
                  </div>
                </div>
              )
              })}
          </div>
         </DashboardLayout>
        </UserLayout>
    // </div>
  )
}