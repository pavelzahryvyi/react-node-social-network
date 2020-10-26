import React from "react";
import style from "./Post.module.css";

const Post = ({post, deletePostThunk, isOwner}) => {
    console.log('---post props', post);

    const deletePost = (id, text) => {
        if (window.confirm(`Do you want to delete the post ${text}?`)) {
            deletePostThunk(id)
        }

    }

    return (
        <div className={style.item}>
            <div className={style.postInfo}>
                <img
                    // src="https://static.turbosquid.com/Preview/2019/02/12__04_46_30/cirlce_43.jpgF75B8343-6B7D-4C48-9F15-26C555FCB2DDZoom.jpg"
                    src={post.avatar}
                    alt=""/>
                <div className={style.postLikes}>
                    <span>132</span>
                </div>
            </div>
            <div className={style.message}>
                {post.text}
            </div>
            {isOwner && (
                <div className={style.deleteBtn} onClick={() => deletePost(post._id, post.text)}>
                    [X]
                </div>)
            }
        </div>
    );
};

export default Post;