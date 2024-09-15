"use client";

import React from 'react';
import { Button, Box } from '@mui/material';

interface DeleteRideProps {
  rideId: number; // Accepting rideId as a prop
}

const DeleteRide: React.FC<DeleteRideProps> = ({ rideId }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch('/api/ride/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rideId }), // Use the passed rideId for deletion
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ride: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Ride deleted successfully:', result);
      alert('Ride deleted successfully'); // Optionally show a message to the user
    } catch (error) {
      console.error('Error deleting ride:', error);
      alert('Error deleting ride'); // Optionally show an error message to the user
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
        Delete Ride
      </Button>
    </Box>
  );
};

export default DeleteRide;