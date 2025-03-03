import React, { useEffect, useState } from "react";
import { useCommentMutation, useGetCommentsMutation } from "../../../app/service/posts";

const MixComments = ({id}) => {
  const [getComments] = useGetCommentsMutation();
  const [doComment] = useCommentMutation();

  const [comments, setComments] = useState([]);

  const onGetComments = async () => {
    const data = await getComments(id).unwrap();

    setComments(data);
  };

  useEffect(() => {
    onGetComments();
  }, []);

  return (
    <div className="comments">
      <div className="comments__inner">

      </div>
    </div>
  );
};

export default MixComments;
