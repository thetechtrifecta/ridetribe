'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { TextField, Button, Typography, Checkbox, FormControlLabel, Box, RadioGroup, Radio, FormControl, FormLabel } from '@mui/material';
import Share from '@/components/Share';
import SelectKids from '@/components/SelectKids';
import { Kid, PlaceType } from '@/types/types';
import SelectAddress from '@/components/SelectAddress';

const CreateRide = () => {
  const { user } = useUser();
  const [wouldDrive, setWouldDrive] = useState(false);
  const [wantRide, setWantRide] = useState(false);
  const [rideType, setRideType] = useState('');
  const [seatsOffered, setSeatsOffered] = useState('');
  const [seatsNeeded, setSeatsNeeded] = useState('');
  const [selectedKids, setSelectedKids] = useState<Kid[]>([]);
  const [pickupAddress, setPickupAddress] = useState<PlaceType | null>(null);
  const [dropoffAddress, setDropoffAddress] = useState<PlaceType | null>(null);  
  const [description, setDescription] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [isEventTitleValid, setEventTitleValid] = useState(true);
  const [isDescriptionValid, setDescriptionValid] = useState(true);
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');

  // Automatically update seatsNeeded when wantRide is selected and kids are chosen
  useEffect(() => {
    if (wantRide) {
      setSeatsNeeded(selectedKids.length.toString());  // Automatically set seatsNeeded to the number of kids
    }
  }, [wantRide, selectedKids]);

  const handleEventTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEventTitle(value);
    setEventTitleValid(value.length <= 20);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = event.target.value;
    setDescription(newDescription);
    setDescriptionValid(newDescription.length <= 100);
  };

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

  const isFormValid = description.length <= 100 && isDescriptionValid && isEventTitleValid &&
  eventTitle.length > 0 && (wouldDrive || wantRide) && pickupAddress && dropoffAddress &&
  (!wouldDrive || (seatsOffered !== '' && parseInt(seatsOffered, 10) < 10)) &&
  (!wantRide || (seatsNeeded !== '' && parseInt(seatsNeeded, 10) < 10)) &&
  rideType !== '' && (pickupTime || dropoffTime);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const clerkUserId = user ? user.id : null;
    if (!clerkUserId) {
      console.error("No user id available from Clerk.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const rideData = {
      eventTitle,
      description,
      pickupAddress: pickupAddress?.description,
      dropoffAddress: dropoffAddress?.description,
      pickupTime: formData.get('pickupTime'),
      dropoffTime: formData.get('dropoffTime'),
      wouldDrive,
      seatsOffered: wouldDrive ? parseInt(seatsOffered, 10) : 0,
      wantRide,
      seatsNeeded: wantRide ? parseInt(seatsNeeded, 10) : 0,
      kids: selectedKids.map(kid => kid.id),
      clerkUserId,
      rideType
    };

    const response = await fetch('/api/ride/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rideData }),
    });

    if (response.ok) {
      alert('Ride created successfully.');
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
        <TextField label="Ride Title" type="text" name="eventTitle" value={eventTitle} onChange={handleEventTitleChange} required fullWidth margin="normal"
          error={!isEventTitleValid} helperText={!isEventTitleValid ? "Title must be under 20 characters" : " "} />
        <TextField label="Description" type="text" name="description" value={description} onChange={handleDescriptionChange} required fullWidth margin="normal"
          error={!isDescriptionValid} helperText={!isDescriptionValid ? "Description must be under 100 characters" : " "} />
        <SelectAddress label="Pickup Address" onSelect={setPickupAddress} />
        <SelectAddress label="Dropoff Address" onSelect={setDropoffAddress} />
        <FormControl component="fieldset">
          <FormLabel component="legend">Ride Direction *</FormLabel>
          <RadioGroup row name="rideType" value={rideType} onChange={(e) => setRideType(e.target.value)}>
            <FormControlLabel value="to" control={<Radio />} label="To Event" />
            <FormControlLabel value="from" control={<Radio />} label="From Event" />
          </RadioGroup>
        </FormControl>
        {rideType === 'to' && (
          <TextField label="Dropoff Time" type="datetime-local" name="dropoffTime" value={dropoffTime} onChange={(e) => setDropoffTime(e.target.value)} required fullWidth margin="normal" InputLabelProps={{ shrink: true }} sx={{ mt: 2, mb: 2 }} />
        )}
        {rideType === 'from' && (
          <TextField label="Pickup Time" type="datetime-local" name="pickupTime" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} required fullWidth margin="normal" InputLabelProps={{ shrink: true }} sx={{ mt: 2, mb: 2 }} />
        )}
        <SelectKids onChange={setSelectedKids} />
        <Box mt={2}>
          <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }} fullWidth margin="normal">
            <FormLabel component="legend">Preferences *</FormLabel>
            <FormControlLabel control={<Checkbox checked={wouldDrive} onChange={(e) => setWouldDrive(e.target.checked)} />} label="Would Drive" />
            {wouldDrive && (
              <TextField label="Seats Offered" type="number" name="seatsOffered" value={seatsOffered} onChange={(e) => handleSeatsChange(e, setSeatsOffered, (valid) => {})} required
                error={seatsOffered !== '' && parseInt(seatsOffered, 10) >= 10} helperText={seatsOffered !== '' && parseInt(seatsOffered, 10) >= 10 ? "Seats offered must be less than 10" : " "} />
            )}
            <FormControlLabel control={<Checkbox checked={wantRide} onChange={(e) => setWantRide(e.target.checked)} />} label="Want Ride" />
            {wantRide && (
              <TextField label="Seats Needed" type="number" name="seatsNeeded" value={seatsNeeded} onChange={(e) => handleSeatsChange(e, setSeatsNeeded, (valid) => {})} required
                error={seatsNeeded !== '' && parseInt(seatsNeeded, 10) >= 10} helperText={seatsNeeded !== '' && parseInt(seatsNeeded, 10) >= 10 ? "Seats needed must be less than 10" : " "} />
            )}
          </FormControl>
        </Box>
        {/* <Box mt={2}>
          <FormControlLabel control={<Checkbox checked={wouldDrive} onChange={(e) => setWouldDrive(e.target.checked)} />} label="Would Drive" />
          {wouldDrive && (
            <TextField label="Seats Offered" type="number" name="seatsOffered" value={seatsOffered} onChange={(e) => handleSeatsChange(e, setSeatsOffered, (valid) => {})} required fullWidth margin="normal"
              error={seatsOffered !== '' && parseInt(seatsOffered, 10) >= 10} helperText={seatsOffered !== '' && parseInt(seatsOffered, 10) >= 10 ? "Seats offered must be less than 10" : " "} />
          )}
        </Box>
        <Box mt={2}>
          <FormControlLabel control={<Checkbox checked={wantRide} onChange={(e) => setWantRide(e.target.checked)} />} label="Want Ride" />
          {wantRide && (
            <TextField label="Seats Needed" type="number" name="seatsNeeded" value={seatsNeeded} onChange={(e) => handleSeatsChange(e, setSeatsNeeded, (valid) => {})} required fullWidth margin="normal"
              error={seatsNeeded !== '' && parseInt(seatsNeeded, 10) >= 10} helperText={seatsNeeded !== '' && parseInt(seatsNeeded, 10) >= 10 ? "Seats needed must be less than 10" : " "} />
          )}
        </Box> */}
        <Button type="submit" variant="contained" color="primary" disabled={!isFormValid}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CreateRide;
