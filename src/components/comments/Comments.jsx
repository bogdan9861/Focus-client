import { useEffect, useRef, useState } from "react";
import {
  useCommentMutation,
  useGetCommentsMutation,
} from "../../app/service/posts";

const Comments = ({ id, setCommentsCount, oppenComment, setOppenComment }) => {
  const [sendID] = useGetCommentsMutation();
  const [doComment] = useCommentMutation();

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const input = useRef(null);

  useEffect(() => {
    getComments();
  }, []);

  useEffect(() => {
    setCommentsCount(comments.length);
  }, [comments]);

  const writeComment = async () => {
    try {
      const data = await doComment({ id, message: commentText }).unwrap();
      setComments([...comments, data]);
      setOppenComment(false);
    } catch (error) {
      console.log(error);
    }

    setCommentText("");
  };

  const getComments = async () => {
    try {
      const data = await sendID(id).unwrap();

      setComments(data);
      setCommentsCount(data.length);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="feed__comments">
      {oppenComment && (
        <ul className="feed__comments-list">
          {comments.map((comment) => {
            return (
              <li className="feed__comments-item" key={comment?.id}>
                <div className="feed__comments-inner">
                  <span className="feed__comments-name">
                    @{comment?.nickname || comment?.name}
                  </span>
                  <p className="feed__comments-message">{comment?.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="feed__comments-input-wrapper">
        <input
          ref={input}
          value={commentText}
          onKeyDown={(e) => (e.key === "Enter" ? writeComment() : null)}
          className="feed__comments-input"
          placeholder="Добавьте комментарий..."
          onChange={(e) => setCommentText(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Comments;
