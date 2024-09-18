"use client"

import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { TextField, Button, Box, Typography } from '@mui/material';

const CreateKid = () => {
  const { user } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');

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
        body: JSON.stringify({
          clerkUserId,
          firstName,
          lastName,
          age,
          phone
        }),
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
      <Typography variant="h6">Create a Kid</Typography>
      <TextField
        label="First Name"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        variant="outlined"
        margin="normal"
      />
      <TextField
        label="Last Name"
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        variant="outlined"
        margin="normal"
      />
      <TextField
        label="Age"
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
        variant="outlined"
        margin="normal"
      />
      <TextField
        label="Phone (optional)"
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
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
