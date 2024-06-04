import useAuthStore, { TicketStatus } from "@/store";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ViewTicket: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentTicket, fetchTicketById } = useAuthStore();

  useEffect(() => {
    if (id) {
      fetchTicketById(`${id}`);
    }
  }, [id, fetchTicketById]);

  if (!currentTicket) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-background p-8 shadow-md border rounded">
      <h2 className="text-2xl font-bold mb-4">{currentTicket.title}</h2>
      <p className="mb-4">{currentTicket.description}</p>
      <p className="mb-4">
        <strong>Status:</strong>{" "}
        {currentTicket.status === TicketStatus.OPEN ? "Open" : "Closed"}
      </p>
      <p className="mb-4">
        <strong>Created Date:</strong>{" "}
        {new Date(currentTicket.create_date).toLocaleString()}
      </p>
      {currentTicket.closed_date && (
        <p className="mb-4">
          <strong>Closed Date:</strong>{" "}
          {new Date(currentTicket.closed_date).toLocaleString()}
        </p>
      )}
      {currentTicket.comments && (
        <>
          <h3 className="text-xl font-bold mb-2">Comments</h3>
          <div className="overflow-y-auto h-64 border border-gray-300 p-4 mb-4">
            <ul>
              {[...currentTicket.comments]
                .sort(
                  (a, b) =>
                    new Date(a.comment_date).getTime() -
                    new Date(b.comment_date).getTime()
                )
                .map((comment) => (
                  <li
                    key={comment.xata_id}
                    className="mb-4 border-b border-gray-300 pb-2"
                  >
                    <p>
                      <strong>{comment.username}:</strong> {comment.comment}
                    </p>
                    <p>
                      <small>
                        {new Date(comment.comment_date).toLocaleString()}
                      </small>
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}
      <CommentOnTicket ticketId={id!} />
    </div>
  );
};

export const CommentOnTicket: React.FC<{ ticketId: string }> = ({
  ticketId,
}) => {
  const [comment, setComment] = useState("");
  const commentOnTicket = useAuthStore((state) => state.commentOnTicket);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await commentOnTicket(ticketId, { comment });
    setComment(""); // Clear the comment input after submitting
  };

  return (
    <div className="max-w-md mx-auto bg-background p-8 shadow-md border rounded">
      <h2 className="text-xl font-bold mb-4">Comment on Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border border-input bg-background rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
