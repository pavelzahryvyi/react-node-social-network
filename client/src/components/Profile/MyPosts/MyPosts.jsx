import React from "react";
import style from "./MyPosts.module.css";
import Post from "./Post/Post";
import NewPost from "./NewPost/NewPostForm";
import {logout} from "../../../redux/authReducer";
import {addCommentThunk, deletePostThunk} from "../../../redux/profileReducer";

const MyPosts = (props) => {

    // console.log('---user id', props.userId)

    return (
        <div className={style.postsBlock}>

            { props.isOwner && (
                <NewPost
                    addPostThunk={props.addPostThunk}
                    addPost={props.addPost}
                    newPostText={props.newPostText}

                />)
            }


            <div>
                <h3>My posts</h3>
                {
                    props.posts
                        .reverse().map(post =>
                        <Post
                            addCommentThunk={props.addCommentThunk}
                            deleteCommentThunk={props.deleteCommentThunk}
                            isOwner={props.isOwner}
                            deletePostThunk={props.deletePostThunk}
                            userId={props.userId}
                            key={post._id}
                            post={post}
                        />)
                }
            </div>
        </div>
    )
};

export default MyPosts;