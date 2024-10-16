'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { Typography, TextField, Button, Checkbox, FormControlLabel, Box, FormControl, FormLabel } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import SelectKids from '@/components/SelectKids';
import { Kid, PlaceType } from '@/types/types';
import SelectAddress from '@/components/SelectAddress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Share from '@/components/Share';

const CreateRide: React.FC = () => {
  const { user } = useUser();
  const [wouldDrive, setWouldDrive] = useState(false);
  const [wantRide, setWantRide] = useState(false);
  const [seatsOffered, setSeatsOffered] = useState('');
  const [seatsNeeded, setSeatsNeeded] = useState('');
  const [selectedKids, setSelectedKids] = useState<Kid[]>([]);
  const [pickupAddress, setPickupAddress] = useState<PlaceType | null>(null);
  const [dropoffAddress, setDropoffAddress] = useState<PlaceType | null>(null);  
  const [pickupDateTime, setPickupDateTime] = useState<Dayjs | null>(dayjs());
  const [dropoffDateTime, setDropoffDateTime] = useState<Dayjs | null>(dayjs());
  const [rideType, setRideType] = useState<'to' | 'from'>('to');

  const handleRideTypeChange = (
    event: React.MouseEvent<HTMLElement, MouseEvent>, 
    newRideType: 'to' | 'from' | null
  ) => {
    if (newRideType !== null && newRideType !== rideType) { // Check if newRideType is different to avoid unnecessary actions
      setRideType(newRideType);
  
      // Swap the addresses unconditionally
      setPickupAddress(dropoffAddress);
      setDropoffAddress(pickupAddress);
    }
  };  

  // Automatically update seatsNeeded when wantRide is selected and kids are chosen
  useEffect(() => {
    if (wantRide) {
      setSeatsNeeded(selectedKids.length.toString());  // Automatically set seatsNeeded to the number of kids
    }
  }, [wantRide, selectedKids]);

  const handleSeatsChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setSeats: React.Dispatch<React.SetStateAction<string>>,
    setValid: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const value = event.target.value;
    const numValue = parseInt(value, 10);
    setSeats(value);
    setValid(!isNaN(numValue) && numValue >= 0 && numValue < 10); // Ensuring the seats are less than 10
  };  

  const isFormValid = (wouldDrive || wantRide) && pickupAddress && dropoffAddress &&
  (!wouldDrive || (seatsOffered !== '' && parseInt(seatsOffered, 10) < 10)) &&
  (!wantRide || (seatsNeeded !== '' && parseInt(seatsNeeded, 10) < 10)) && (pickupDateTime || dropoffDateTime);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const clerkUserId = user ? user.id : null;
    if (!clerkUserId) {
      console.error("No user id available from Clerk.");
      return;
    }

    const rideData = {
      rideType,
      pickupAddress: pickupAddress?.description,
      dropoffAddress: dropoffAddress?.description,
      kids: selectedKids.map(kid => kid.id),
      wouldDrive,
      seatsOffered: wouldDrive ? parseInt(seatsOffered, 10) : 0,
      wantRide,
      seatsNeeded: wantRide ? parseInt(seatsNeeded, 10) : 0,
      clerkUserId,
    };

    const response = await fetch('/api/ride/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rideData }),
    });

    if (response.ok) {
      alert(`One-way Ride created`);
    } else {
      const error = await response.text();
      console.error('Failed to create ride:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', margin: 'auto', maxWidth: 500 }}>
          <Share />
          <Typography variant="h6" >Create a Ride</Typography>
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
          <SelectAddress
            label="Pickup Address"
            onSelect={setPickupAddress}
            selectedAddress={pickupAddress}
          />
          <SelectAddress
            label="Dropoff Address"
            onSelect={setDropoffAddress}
            selectedAddress={dropoffAddress}
          />
          <Box sx={{ my: 2,width: '100%' }}>
            {rideType === 'to' && (
              <DateTimePicker
                label="Dropoff Time"
                value={dropoffDateTime}
                onChange={setDropoffDateTime}
                sx={{ width: '100%' }}
              />
            )}
            {rideType === 'from' && (
              <DateTimePicker
                label="Pickup Time"
                value={pickupDateTime}
                onChange={setPickupDateTime}
                sx={{ width: '100%' }}
              />
            )}
          </Box>
          <SelectKids selected={selectedKids} onChange={setSelectedKids} />
          <FormControl component="fieldset" sx={{ width: '100%', mt: 2, mb: 2 }}>
            <FormLabel component="legend">Ride Preferences</FormLabel>
            <FormControlLabel control={<Checkbox checked={wouldDrive} onChange={(e) => setWouldDrive(e.target.checked)} />} label="Would Drive" />
            {wouldDrive && (
              <TextField
                label="Seats Offered"
                type="number"
                name="seatsOffered"
                value={seatsOffered}
                onChange={(e) => handleSeatsChange(e, setSeatsOffered, () => {})}
                required
                fullWidth
                error={seatsOffered !== '' && parseInt(seatsOffered, 10) >= 10}
                helperText={seatsOffered !== '' && parseInt(seatsOffered, 10) >= 10 ? "Seats offered must be less than 10" : " "}
              />
            )}
            <FormControlLabel control={<Checkbox checked={wantRide} onChange={(e) => setWantRide(e.target.checked)} />} label="Want Ride" />
            {wantRide && (
              <TextField
                label="Seats Needed"
                type="number"
                name="seatsNeeded"
                value={seatsNeeded}
                onChange={(e) => handleSeatsChange(e, setSeatsNeeded, () => {})}
                required
                fullWidth
                error={seatsNeeded !== '' && parseInt(seatsNeeded, 10) >= 10}
                helperText={seatsNeeded !== '' && parseInt(seatsNeeded, 10) >= 10 ? "Seats needed must be less than 10" : " "}
              />
            )}
          </FormControl>
          <Button type="submit" variant="contained" color="primary" disabled={!isFormValid}>
            Submit
          </Button>
        </Box>
      </form>
    </LocalizationProvider>
  );
};

export default CreateRide;
