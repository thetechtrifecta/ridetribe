"use client";

import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { TextField, Button, Box } from '@mui/material';

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
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1 }, // margin for all child elements
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%' // Optional: adjust width as needed
      }}
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField
        label="Kid Age"
        type="number"
        id="kidAge"
        name="kidAge"
        value={kidAge}
        onChange={(e) => setKidAge(e.target.value)}
        required
        variant="outlined"
        margin="normal"
      />
      <Button type="submit" variant="contained">
        Submit
      </Button>
    </Box>
  );
};

export default CreateKid;
