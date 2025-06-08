import { getAboutUser, } from "@/config/redux/action/authAction";
import { getAllPosts , createPost , deletePost ,  incrementPostLike , getAllComments, postComment} from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserLayout from "@/layout/UserLayout"; 
import DashboardLayout from "@/layout/DashboardLayout"; 
import { getAllUsers } from '@/config/redux/action/authAction';
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { resetPostId } from "@/config/redux/reducer/postReducer";

export default function Dashboard() {

    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [postContent, setPostContent] = useState('');
    const [fileContent, setFileContent] = useState();
    const postState = useSelector((state) => state.postReducer);
    const[commentText, setCommentText] = useState("");

    const handleUpload = async () => {
      await dispatch(createPost({file: fileContent, body: postContent}));
      setPostContent("");
      setFileContent(null);
      dispatch(getAllPosts())
    }

    useEffect(() => {
        const fetchData = async () => {
            if (authState.isTokenThere) {
               
                    dispatch(getAllPosts()),
                    dispatch(getAboutUser({ token: localStorage.getItem('token') }))
               
            }

            if (!authState.all_profiles_fetched) {
              
                 dispatch(getAllUsers());
            }
            
            setLoading(false);
        };

        fetchData();
 
  }, [authState.isTokenThere]);

    if (loading) {
        return (
            <UserLayout>
                <DashboardLayout>
                    <div>Loading profile...</div>
                </DashboardLayout>
            </UserLayout>
        );
    }

    if(authState.user) {

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.scrollComponent}>
                  <div className={styles.wrapper}>
                    <div className={styles.createPostContainer}>
                            <img className={styles.userProfile} src={authState.user?.userId?.profilePicture
                                        ? `${BASE_URL}/${authState.user.userId.profilePicture}`
                                        : '/default-profile.jpg'} 
                                alt="Profile" 
                                onError={(e) => {
                                    e.target.src = '/default-profile.jpg';
                                }}
                            />
                            <textarea onChange={(e) => setPostContent(e.target.value)} value={postContent} placeholder={"What's in your mind ?"} className={styles.textAreaOfContent} name="" id=""></textarea>
                           <label htmlFor="fileUpload" >
                            <div className={styles.Fab}>
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                             </svg>
                            </div>
                           </label>
                           <input onChange={(e) => setFileContent(e.target.files[0])} type="file" hidden id="fileUpload" />
                           {postContent.length > 0 && 
                           <div onClick={handleUpload} className={styles.uploadButton}>Post</div>
                           }

                        </div> 

                        <div className={styles.postsContainer}>
                  
                     {postState.posts.map((post) => {
                      return (
                        <div key={post._id} className={styles.singleCard}>
                      
                        <div className={styles.singleCard_profileContainer}>
                        <img className={styles.userProfile} src={`${BASE_URL}/${authState.user.userId.profilePicture}`} />
                        <div>
                          <div style={{display: "flex" , gap: "1.2rem", justifyContent: "space-between"}}>
                           <p style={{fontWeight: "bold"}}>{post.userId.name}</p>
                            {
                              post.userId._id === authState.user.userId._id && 
                              <div onClick={ async() => {
                                await dispatch(deletePost({post_id: post._id}))
                                await dispatch(getAllPosts())
                              }} style={{cursor: "pointer"}}>
                              <svg style={{height: "1.4rem", color: "red"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                               <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                           </div>
                            }
                          </div>
                        <p style={{color: "grey"}}>@{post.userId.username}</p>
                        <p style={{paddingTop: "1.3rem"}}>{post.body}</p>
                        <div className={styles.singleCard_image}>
                          {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} /> :<></>}
                        </div>
                          
                        <div className={styles.optionsContainer}>
                           
                          <div onClick= { async () => {
                            await dispatch(incrementPostLike({ post_id: post._id}))
                            dispatch(getAllPosts())
                          }}
                           className={styles.singleOption__optionsContainer}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg> 
                            <p>{post.likes}</p>
                            {/* <p>Post</p> */}
                          </div>

                          <div  onClick={() => {
                            dispatch(getAllComments({post_id: post._id}))
                          }}
                           className={styles.singleOption__optionsContainer}>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                           </svg>
                          </div>

                          <div onClick={() => {
                            const text = encodeURIComponent(post.body)
                            const url = encodeURIComponent("apnacollege.in");
                            const twitterURL = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                            window.open(twitterURL, "_blank")
                          }}
                           className={styles.singleOption__optionsContainer}>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                           </svg>
                          </div>

                        </div>

                        </div>
                        </div>
                        </div>
                       );
                      })}
                     </div>
                     </div>
                    </div>

                  {
                    postState.postId !== "" &&
                    <div 
                    
                    onClick={() => {
                      dispatch(resetPostId())
                    }}

                    className={styles.commentsContainer}>
                        <div onClick={(e) => {
                          e.stopPropagation()
                        }}
                        className={styles.allCommentsContainer}>
                         {postState.comments.length === 0 && <h2>No comments</h2>}

                         { postState.comments.lenght !== 0 &&

                     

                           <div>
                           {postState.comments.map((postComment, index) => {
                            return( 
                             <div className={styles.singleComment} key = {postComment._id}>
                              <div className={styles.singleComment_profileContainer}>
                               <img src={`${BASE_URL}/${postComment.userId.profilePicture}`} alt="" />
                              <div>
                               <p style={{fontWeight: "bold", fontSize:"1.2rem"}}>{postComment.userId.name}</p>
                               <p>@{postComment.userId.username}</p>
                              </div>
                              </div>
                              <p>{postComment.body}</p>
                             </div>

                             )
                           })}
                           
                          </div>

                         }

                        <div className={styles.postCommentContainer}>
                          <input type="" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder ='Comment' />
                          <div onClick={async () => {
                            await dispatch(postComment ({post_id: postState.postId, body: commentText}))
                            await dispatch(getAllComments({post_id: postState.postId}))
                          }} className={styles.postCommentContainer__commentBtn}>
                            <p>Comment</p>
                          </div>
                        </div>

                        </div>
                    </div>
                  }
                
            </DashboardLayout>
        </UserLayout>
    );
  } else {
    <UserLayout>
      <DashboardLayout>
       <h2>Loading</h2>
      </DashboardLayout>
    </UserLayout>
  }
}