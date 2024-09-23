'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { TextField, Button, Typography, Checkbox, FormControlLabel, Box } from '@mui/material';
import Share from '@/components/Share';
import SelectKids from '@/components/SelectKids';
import { Kid, PlaceType } from '@/types/types';
import SelectAddress from '@/components/SelectAddress';

const CreateRide = () => {
  const { user } = useUser();
  const [wouldDrive, setWouldDrive] = useState(false);
  const [wantRide, setWantRide] = useState(false);
  const [seatsOffered, setSeatsOffered] = useState('');
  const [seatsNeeded, setSeatsNeeded] = useState('');
  const [selectedKids, setSelectedKids] = useState<Kid[]>([]);
  const [pickupAddress, setPickupAddress] = useState<PlaceType | null>(null);
  const [dropoffAddress, setDropoffAddress] = useState<PlaceType | null>(null);  

  // Automatically update seatsNeeded when wantRide is selected and kids are chosen
  useEffect(() => {
    if (wantRide) {
      setSeatsNeeded(selectedKids.length.toString());  // Automatically set seatsNeeded to the number of kids
    }
  }, [wantRide, selectedKids]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!wouldDrive && !wantRide) {
        alert('Please select at least one option: Would Drive or Want Ride.');
        return; 
    }

      // Validate addresses
    if (!pickupAddress || !dropoffAddress) {
      alert('Both pickup and dropoff addresses must be selected.');
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
      pickupAddress: pickupAddress.description,
      dropoffAddress: dropoffAddress.description,
      dropoffTime: formData.get('dropoffTime'),
      wouldDrive,
      seatsOffered: wouldDrive ? parseInt(formData.get('seatsOffered') as string) : 0,
      wantRide,
      seatsNeeded: wantRide ? parseInt(seatsNeeded) : 0,  // Automatically set seatsNeeded to selectedKids.length
      kids: selectedKids.map(kid => kid.id),  // Assuming kid objects have an 'id' property
      clerkUserId
    };

    const response = await fetch('/api/ride/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rideData }),
    });

    if (response.ok) {
      alert('Ride created');
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
      <form onSubmit={handleSubmit}>
        <TextField label="Ride Title" type="text" name="eventTitle" required fullWidth margin="normal" />
        <TextField label="Description" type="text" name="description" required fullWidth margin="normal" />
        <SelectAddress label="Pickup Address" onSelect={setPickupAddress} />
        <SelectAddress label="Dropoff Address" onSelect={setDropoffAddress} />
        <TextField label="Dropoff Time" type="datetime-local" name="dropoffTime" required fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        <SelectKids onChange={setSelectedKids} />
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
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </form>
    </Box>
  );
};

export default CreateRide;
