"use client";

import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";

const CreateRide = () => {
  const { user } = useUser();
  const [eventTitle, setEventTitle] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const clerkUserId = user ? user.id : null;

    if (!clerkUserId) {
      console.error("No user id available from Clerk.");
      return;
    }
    
    try {
      const response = await fetch('/api/ride/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clerkUserId, eventTitle }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create ride: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Ride created successfully:', result);
    } catch (error) {
      console.error('Error creating ride:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="eventTitle">Ride Title:</label>
        <input
          type="text"
          id="eventTitle"
          name="eventTitle"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateRide;
