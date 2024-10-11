import React from 'react';
import { Grid, Typography, Button, Paper } from '@mui/material';
import DeleteRide from './DeleteRide';
import { Ride } from '@/types/types';

interface RenderRideDetailsProps {
    ride: Ride;
    onOpenUpdateDialog: (ride: Ride) => void;
}

const RenderRideDetails: React.FC<RenderRideDetailsProps> = ({ ride, onOpenUpdateDialog }) => (
    <Paper elevation={3} sx={{ margin: 2, padding: 2, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
            {ride.eventTitle ? `Event Title: ${ride.eventTitle}` : ''}
        </Typography>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Ride Type:</Typography>
                <Typography variant="body1">{ride.rideType}</Typography>
            </Grid>
            {ride.rideType === 'from' && ride.pickupTime && (
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">Pickup Time:</Typography>
                    <Typography variant="body1">{new Date(ride.pickupTime).toLocaleString()}</Typography>
                </Grid>
            )}
            {ride.rideType === 'to' && ride.dropoffTime && (
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">Dropoff Time:</Typography>
                    <Typography variant="body1">{new Date(ride.dropoffTime).toLocaleString()}</Typography>
                </Grid>
            )}
            {ride.pickupAddress && (
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">Pickup Address:</Typography>
                    <Typography variant="body1">{ride.pickupAddress}</Typography>
                </Grid>
            )}
            {ride.dropoffAddress && (
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">Dropoff Address:</Typography>
                    <Typography variant="body1">{ride.dropoffAddress}</Typography>
                </Grid>
            )}
            {ride.wouldDrive && (
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">Would Drive:</Typography>
                    <Typography variant="body1">Yes, offering {ride.seatsOffered || '0'} seats</Typography>
                </Grid>
            )}
            {ride.wantRide && (
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">Want Ride:</Typography>
                    <Typography variant="body1">Needs {ride.seatsNeeded || '0'} seats</Typography>
                </Grid>
            )}
            {ride.kids && ride.kids.length > 0 && (
                <Grid item xs={12}>
                    <Typography variant="subtitle1">Kids:</Typography>
                    <Typography variant="body1">
                        {ride.kids.map(kid => kid.firstName + ' ' + kid.lastName).join(', ')}
                    </Typography>
                </Grid>
            )}
            <Grid item xs={12}>
                <Button onClick={() => onOpenUpdateDialog(ride)} variant="contained" color="primary">
                    Update
                </Button>
                <DeleteRide rideId={ride.id} />
            </Grid>
        </Grid>
    </Paper>
);

export default RenderRideDetails;
