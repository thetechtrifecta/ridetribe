"use client";

import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";

const CreateKid = () => {
  const { user } = useUser();
  const [kidAge, setKidAge] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const clerkUserId = user ? user.id : null;

    if (!clerkUserId) {
      console.error("No user id available from Clerk.");
      return;
    }
    
    try {
      const response = await fetch('/api/kid/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clerkUserId, kidAge }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create kid: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Kid created successfully:', result);
    } catch (error) {
      console.error('Error creating kid:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="kidAge">Kid Age:</label>
        <input
          type="number"
          id="kidAge"
          name="kidAge"
          value={kidAge}
          onChange={(e) => setKidAge(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateKid;
