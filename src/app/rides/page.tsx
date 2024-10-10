"use client"

import React, { useState } from 'react';
import RidesList from '@/components/RidesList';
import CreateRide from '@/components/CreateRide';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Typography, Box } from '@mui/material';
import Share from '@/components/Share';

const Rides: React.FC = () => {
  const [eventTitle, setEventTitle] = useState<string>(''); 
  const [isEventTitleValid, setEventTitleValid] = useState(true);
  const [rideType, setRideType] = useState<'to' | 'from'>('to');

  const handleEventTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEventTitle(value);
    setEventTitleValid(value.length <= 20);
  };

  const handleRideTypeChange = (
    event: React.MouseEvent<HTMLElement, MouseEvent>, 
    newRideType: 'to' | 'from' | null
  ) => {
    if (newRideType !== null) { // Prevent unselecting all toggles
      setRideType(newRideType);
    }
  };

  return (
    <>
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Share />
        <Typography variant="h6" >Create a Ride</Typography>
        <Box sx={{ width: '100%', maxWidth: 500, margin: 'auto', my: 2 }}>
          <ToggleButtonGroup
            color="primary"
            value={rideType}
            exclusive
            onChange={handleRideTypeChange}
            aria-label="Ride Direction"
            fullWidth
            sx={{my: 2 }}
          >
            <ToggleButton value="to">To</ToggleButton>
            <ToggleButton value="from">From</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ width: '100%', maxWidth: 500, mt: 2 }}>
          <TextField 
            fullWidth
            label="Event Title" 
            type="text" 
            name="eventTitle" 
            value={eventTitle} 
            onChange={handleEventTitleChange} 
            required
            error={!isEventTitleValid} 
            helperText={!isEventTitleValid ? "Title must be under 20 characters" : " "} 
          />
        </Box>
        <CreateRide eventTitle={eventTitle} isEventTitleValid={isEventTitleValid} rideType={rideType} />
        <RidesList />
      </Box>
    </>
  );
};

export default Rides;
