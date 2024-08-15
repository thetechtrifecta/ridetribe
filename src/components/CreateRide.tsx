"use client";

import React, { useState } from 'react';

const CreateRide = () => {
  const [eventTitle, setEventTitle] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const response = await fetch('/api/rides/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventTitle }),
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
        <label htmlFor="eventTitle">Event Title:</label>
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
