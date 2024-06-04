import useAuthStore from "@/store";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateTicket: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createTicket = useAuthStore((state) => state.createTicket);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTicket({ title, description }, navigate);
  };

  return (
    <div className="max-w-md mx-auto bg-background p-8 shadow-md border rounded">
      <h2 className="text-xl font-bold mb-4">Create Ticket</h2>
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
          Create
        </button>
      </form>
    </div>
  );
};
