"use client";

import React from 'react';
import { Button, Box } from '@mui/material';

interface DeleteKidProps {
  kidId: number; // Accepting kidId as a prop
}

const DeleteKid: React.FC<DeleteKidProps> = ({ kidId }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch('/api/kid/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kidId }), // Use the passed kidId for deletion
      });

      if (!response.ok) {
        throw new Error(`Failed to delete kid: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Kid deleted successfully:', result);
      alert('Kid deleted successfully'); // Optionally show a message to the user
    } catch (error) {
      console.error('Error deleting kid:', error);
      alert('Error deleting kid'); // Optionally show an error message to the user
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button
        onClick={handleDelete}
        variant="contained"
        color="error"
      >
        Delete Kid
      </Button>
    </Box>
  );
};

export default DeleteKid;