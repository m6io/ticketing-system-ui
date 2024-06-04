import useAuthStore from "@/store";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const EditTicket: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentTicket, fetchTicketById, updateTicket } = useAuthStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchTicketById(id);
    }
  }, [id, fetchTicketById]);

  useEffect(() => {
    if (currentTicket) {
      setTitle(currentTicket.title);
      setDescription(currentTicket.description || "");
    }
  }, [currentTicket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await updateTicket(id, { title, description }, navigate);
    }
  };

  if (!currentTicket) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-background p-8 shadow-md border rounded">
      <h2 className="text-xl font-bold mb-4">Edit Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-input bg-background rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-input bg-background rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
};
