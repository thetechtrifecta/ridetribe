import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { Typography, TextField, Button, Checkbox, FormControlLabel, Box, Dialog, DialogContent } from '@mui/material';
import SelectKids from '@/components/SelectKids';
import SelectAddress from '@/components/SelectAddress';
import { Kid } from '@/types/types';
import { Event, PlaceType } from '@/types/types';

const CreateRide = ({
    event,
    onClose,
    rideType,
    preselectedKids,
    oppositeRideSettings
  }: {
    event: Event,
    onClose: () => void,
    rideType: string,
    preselectedKids: Kid[],
    oppositeRideSettings: {
        wouldDrive: boolean,
        wantRide: boolean,
        seatsOffered: string,
        seatsNeeded: string
    }
  }) => {
  const { user } = useUser();
  const [wouldDrive, setWouldDrive] = useState(oppositeRideSettings.wouldDrive);
  const [wantRide, setWantRide] = useState(oppositeRideSettings.wantRide);
  const [seatsOffered, setSeatsOffered] = useState(oppositeRideSettings.seatsOffered);
  const [seatsNeeded, setSeatsNeeded] = useState(oppositeRideSettings.seatsNeeded);
  const [selectedKids, setSelectedKids] = useState<Kid[]>([]);
  const [address, setAddress] = useState<PlaceType | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setSelectedKids(preselectedKids);
  }, [preselectedKids]);

  useEffect(() => {
    if (wantRide) {
      setSeatsNeeded(selectedKids.length.toString());
    }
  }, [wantRide, selectedKids.length]);

  useEffect(() => {
    const hasAddress = address && address.description ? true : false; 
    const hasSeatsOffered = wouldDrive && seatsOffered.trim() !== ''; 
    const canSubmit = hasAddress && (wouldDrive ? hasSeatsOffered : wantRide);
    setIsFormValid(!!canSubmit);
  }, [address, wouldDrive, wantRide, seatsOffered]);  

  const handleSubmit = async (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();

    const clerkUserId = user ? user.id : null;
    if (!clerkUserId) {
      console.error("No user id available from Clerk.");
      return;
    }

    // Correctly set addresses based on the ride type
    const pickupAddress = rideType === 'from' ? event.address : (typeof address === 'object' ? (address as { description: string }).description : address);
    const dropoffAddress = rideType === 'to' ? event.address : (typeof address === 'object' ? (address as { description: string }).description : address);

    const rideData = {
      eventId: event.id,
      rideType,
      pickupAddress,
      dropoffAddress,
      kids: selectedKids.map(kid => kid.id),
      wouldDrive,
      seatsOffered: wouldDrive ? parseInt(seatsOffered, 10) : 0,
      wantRide,
      seatsNeeded: wantRide ? parseInt(seatsNeeded, 10) : 0,
      clerkUserId,
    };

    const response = await fetch('/api/ride/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ rideData }),
    });

    if (response.ok) {
      alert("Ride created successfully!");
      onClose();
    } else {
      alert("Failed to create ride: " + await response.text());
    }
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Typography variant="h6">Create Ride for {event.title}</Typography>
          {rideType === 'to' && (
            <SelectAddress label="Pickup Address" selectedAddress={address} onSelect={setAddress} />
          )}
          {rideType === 'from' && (
            <SelectAddress label="Dropoff Address" selectedAddress={address} onSelect={setAddress} />
          )}
          <SelectKids selected={selectedKids} onChange={setSelectedKids} />
          <FormControlLabel control={<Checkbox checked={wouldDrive} onChange={(e) => setWouldDrive(e.target.checked)} />} label="Would Drive" />
          {wouldDrive && (
            <TextField
              label="Seats Offered"
              type="number"
              value={seatsOffered}
              onChange={(e) => setSeatsOffered(e.target.value)}
              required
            />
          )}
          <FormControlLabel control={<Checkbox checked={wantRide} onChange={(e) => setWantRide(e.target.checked)} />} label="Want Ride" />
          {wantRide && (
            <TextField
              label="Seats Needed"
              type="number"
              value={seatsNeeded}
              disabled
              helperText="Automatically calculated based on selected Kids"
            />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button type="submit" color="primary" variant="contained" disabled={!isFormValid}>
              Create Ride
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRide;
