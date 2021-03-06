import React from "react";
import NewComment from "./NewComment/NewComment";
import styles from "./Comments.module.css"
import {Comment} from "./Comment/Comment";

export const Comments = ({comments, getCommentText, getCommentId, isOwner}) => {
    const commentText = (text)=>{
        getCommentText(text);
    }
    return <div className={styles.commentsBlock}>
        <NewComment getCommentText={commentText}/>
        {
            comments.map(comment => (
                <Comment
                    isOwner={isOwner}
                    getCommentId={getCommentId}
                    key={comment._id}
                    commentId={comment._id}
                    comment={comment.text}
                    avatar={comment.avatar}
                    userId={comment.user}
                />
            ))
        }
    </div>
}