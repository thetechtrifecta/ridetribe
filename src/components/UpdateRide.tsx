import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, Box, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Checkbox } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { Ride, PlaceType, Kid } from '@/types/types';
import SelectAddress from '@/components/SelectAddress';
import SelectKids from '@/components/SelectKids';

type Props = {
    ride: Ride;
    open: boolean;
    onClose: () => void;
    onSave: () => void;
};

const UpdateRide = ({ ride, open, onClose, onSave }: Props) => {
    const [eventTitle, setEventTitle] = useState(ride.eventTitle);
    const [rideType, setRideType] = useState(ride.rideType);
    const [pickupAddress, setPickupAddress] = useState<PlaceType | null>({
        description: ride.pickupAddress,
        structured_formatting: { main_text: ride.pickupAddress, secondary_text: "" }
    });
    const [dropoffAddress, setDropoffAddress] = useState<PlaceType | null>({
        description: ride.dropoffAddress,
        structured_formatting: { main_text: ride.dropoffAddress, secondary_text: "" }
    });
    const [pickupDateTime, setPickupDateTime] = useState<Dayjs | null>(ride.pickupTime ? dayjs(ride.pickupTime) : null);
    const [dropoffDateTime, setDropoffDateTime] = useState<Dayjs | null>(ride.dropoffTime ? dayjs(ride.dropoffTime) : null);
    const [wouldDrive, setWouldDrive] = useState(ride.wouldDrive);
    const [wantRide, setWantRide] = useState(ride.wantRide);
    const [seatsOffered, setSeatsOffered] = useState(ride.seatsOffered ? ride.seatsOffered.toString() : '');
    const [seatsNeeded, setSeatsNeeded] = useState(ride.seatsNeeded ? ride.seatsNeeded.toString() : '');
    const [selectedKids, setSelectedKids] = useState<Kid[]>(ride.kids || []);

    // Effect to reset seatsOffered when wouldDrive is unchecked
    useEffect(() => {
        if (!wouldDrive) {
            setSeatsOffered(''); // Reset to an empty string
        }
    }, [wouldDrive]);

    // Reset seatsNeeded when wantRide is unchecked
    useEffect(() => {
        if (!wantRide) {
            setSeatsNeeded(''); // Reset to an empty string
        } else {
            // Update seatsNeeded based on the number of selected kids when wantRide is checked
            setSeatsNeeded(selectedKids.length.toString());
        }
    }, [wantRide, selectedKids]);

    // Automatically update seatsNeeded when wantRide is selected and kids are chosen
    useEffect(() => {
        if (wantRide) {
            setSeatsNeeded(selectedKids.length.toString()); // Automatically set seatsNeeded to the number of kids
        }
    }, [wantRide, selectedKids]); // Depend on both wantRide and selectedKids changes

    const handleWouldDriveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setWouldDrive(checked);
        if (!checked) {
            setSeatsOffered(''); // Immediately reset when unchecked
        }
    };
    
    const handleWantRideChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setWantRide(checked);
        if (!checked) {
            setSeatsNeeded(''); // Immediately reset when unchecked
        } else {
            setSeatsNeeded(selectedKids.length.toString()); // Recalculate when checked
        }
    };    

    const handleSubmit = async () => {
        if (!selectedKids) {
            alert("No kids selected.");
            return;
        }
    
        const payload = {
            eventTitle,
            pickupAddress: pickupAddress?.description,
            dropoffAddress: dropoffAddress?.description,
            pickupTime: pickupDateTime?.isValid() ? pickupDateTime.toISOString() : null,
            dropoffTime: dropoffDateTime?.isValid() ? dropoffDateTime.toISOString() : null,
            wouldDrive,
            seatsOffered: wouldDrive ? parseInt(seatsOffered) : 0, // Ensure we handle integer conversion properly
            wantRide,
            seatsNeeded: wantRide ? parseInt(seatsNeeded) : 0, // Set to 0 if wantRide is false
            rideType,
            kids: selectedKids?.map(kid => kid.id) || [],
        };
    
        const response = await fetch(`/api/ride/update/${ride.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
    
        if (response.ok) {
            onSave();
            onClose();
        } else {
            alert(`Failed to update ride: ${await response.text()}`);
        }
    };    

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent>
                <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <Typography variant="h6" gutterBottom>Update Ride</Typography>
                    <TextField margin="dense" label="Event Title" type="text" fullWidth variant="outlined" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
                    <SelectAddress label="Pickup Address" selectedAddress={pickupAddress || null} onSelect={setPickupAddress} />
                    <SelectAddress label="Dropoff Address" selectedAddress={dropoffAddress || null} onSelect={setDropoffAddress} />
                    <FormControl component="fieldset" fullWidth margin="normal">
                        <FormLabel component="legend">Ride Direction</FormLabel>
                        <RadioGroup row name="rideType" value={rideType} onChange={(e) => setRideType(e.target.value)}>
                            <FormControlLabel value="to" control={<Radio />} label="To Event" />
                            <FormControlLabel value="from" control={<Radio />} label="From Event" />
                        </RadioGroup>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        {rideType === 'to' ? (
                            <DateTimePicker label="Dropoff Time" value={dropoffDateTime} onChange={setDropoffDateTime} />
                        ) : (
                            <DateTimePicker label="Pickup Time" value={pickupDateTime} onChange={setPickupDateTime} />
                        )}
                    </LocalizationProvider>
                    <SelectKids selected={selectedKids} onChange={setSelectedKids} />
                    <FormControl component="fieldset" fullWidth margin="normal">
                    <FormLabel component="legend">Ride Preferences</FormLabel>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <FormControlLabel
                            control={<Checkbox checked={wouldDrive} onChange={handleWouldDriveChange} />}
                            label="Would Drive"
                        />
                        {wouldDrive && (
                            <TextField 
                                label="Seats Offered" 
                                type="number" 
                                fullWidth 
                                value={seatsOffered} 
                                onChange={(e) => setSeatsOffered(e.target.value)} 
                                margin="normal" 
                                InputProps={{ inputProps: { min: 0, max: 10 } }}
                            />
                        )}
                        <FormControlLabel
                            control={<Checkbox checked={wantRide} onChange={handleWantRideChange} />}
                            label="Want Ride"
                        />
                        {wantRide && (
                            <TextField 
                                label="Seats Needed" 
                                type="number" 
                                fullWidth 
                                value={seatsNeeded} 
                                onChange={(e) => setSeatsNeeded(e.target.value)} 
                                margin="normal" 
                                InputProps={{ inputProps: { min: 0, max: 10 } }}
                            />
                        )}
                        </Box>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button type="submit" color="primary" variant="contained">Update</Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateRide;