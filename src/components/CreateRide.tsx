'use client';

import React, { useState    } from 'react';
import { useUser } from "@clerk/nextjs";
import { TextField, Button, Typography, Checkbox, FormControlLabel, Box, Container } from '@mui/material';
import Share from '@/components/Share';

const CreateRide = () => {
  const { user } = useUser();
  const [wouldDrive, setWouldDrive] = useState(false);
  const [wantRide, setWantRide] = useState(false);
  const [seatsOffered, setSeatsOffered] = useState('');
  const [seatsNeeded, setSeatsNeeded] = useState('');
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Ensure at least one option is selected
    if (!wouldDrive && !wantRide) {
        alert('Please select at least one option: Would Drive or Want Ride.');
        return; 
    }

    const clerkUserId = user ? user.id : null;

    if (!clerkUserId) {
      console.error("No user id available from Clerk.");
      return;
    }
    const formData = new FormData(event.currentTarget);

    const rideData = {
      eventTitle: formData.get('eventTitle'),
      description: formData.get('description') as string,
      pickupAddress: formData.get('pickupAddress'),
      dropoffAddress: formData.get('dropoffAddress'),
      dropoffTime: formData.get('dropoffTime'),
      wouldDrive,
      seatsOffered: wouldDrive && formData.get('seatsOffered') ? parseInt(formData.get('seatsOffered') as string) : 0,
      wantRide,
      seatsNeeded: wantRide && formData.get('seatsNeeded') ? parseInt(formData.get('seatsNeeded') as string) : 0,
      clerkUserId
    };

    const response = await fetch('/api/ride/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({rideData}),
    });

    if (response.ok) {
      alert('ride created')
    } else {
      const error = await response.text();
      console.error('Failed to create ride:', error);
    }
  };

  return (
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Create a Ride</Typography>
        <Share />
        <form onSubmit={handleSubmit} >
          <TextField label="Ride Title" type="text" name="eventTitle" required fullWidth margin="normal" />
          <TextField label="Description" type="text" name="description" required fullWidth margin="normal" />
          <TextField label="Pickup Address" type="text" name="pickupAddress" required fullWidth margin="normal" />
          <TextField label="Dropoff Address" type="text" name="dropoffAddress" required fullWidth margin="normal" />
          <TextField label="Dropoff Time" type="datetime-local" name="dropoffTime" required fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          <Box mt={2}>
            <FormControlLabel 
              control={<Checkbox checked={wouldDrive} onChange={(e) => setWouldDrive(e.target.checked)} />}
              label="Would Drive"
            />
            {wouldDrive && (
              <TextField 
                label="Seats Offered" 
                type="number" 
                name="seatsOffered" 
                value={seatsOffered}
                onChange={(e) => setSeatsOffered(e.target.value)}
                required 
                fullWidth 
                margin="normal"
              />
            )}
          </Box>
          <Box mt={2}>
            <FormControlLabel 
              control={<Checkbox checked={wantRide} onChange={(e) => setWantRide(e.target.checked)} />}
              label="Want Ride"
            />
            {wantRide && (
              <TextField 
                label="Seats Needed" 
                type="number" 
                name="seatsNeeded" 
                value={seatsNeeded}
                onChange={(e) => setSeatsNeeded(e.target.value)}
                required 
                fullWidth 
                margin="normal"
              />
            )}
          </Box>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">Submit</Button>
          </Box>
        </form>
      </Box>
  );
};

export default CreateRide;