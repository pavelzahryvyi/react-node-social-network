import React from "react";
import {Field, reduxForm} from "redux-form";
import {Input} from "../../../../../common/FormsControls/FormsControls";
import {requiredField} from "../../../../../../utils/validators/validators";

const newCommentForm = props => {
    return <form onSubmit={props.handleSubmit}>
        <div>
            <Field component={Input} name={"text"} type={"text"} placeholder={"Your comment"}/>
        </div>
        <div>
            <button>Comment!</button>
        </div>
    </form>
}

const NewCommentReduxForm = reduxForm({form: "comment"})(newCommentForm);

export const NewComment = props => {

    function onSubmit(formData){
        props.getCommentText(formData);
    }

    return <div>
        ADD COMMENT TO THE POST:
        <NewCommentReduxForm onSubmit={onSubmit} />
    </div>
}