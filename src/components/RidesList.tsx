import React from 'react';
import { Typography, Paper, Box, Grid } from '@mui/material';

// Define the interface for a single ride
interface Ride {
  id: number;
  creatorId: number;
  title: string | null;
  description: string | null;
  pickupAddress: string;
  dropoffAddress: string;
  dropoffTime: Date; // Consider if you want to use Date or string for uniformity
  wouldDrive: boolean;
  seatsOffered: number;
  wantRide: boolean;
  seatsNeeded: number;
}

interface RidesListProps {
  rides: Ride[];
}

const RidesList: React.FC<RidesListProps> = ({ rides }) => {
  return (
    <Box sx={{ margin: 2 }}>
      {rides.map((ride) => (
        <Paper key={ride.id} elevation={3} sx={{ margin: 2, padding: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            Ride Title: {ride.title || 'No title'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1">Pickup:</Typography>
              <Typography variant="body1">{ride.pickupAddress}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1">Dropoff:</Typography>
              <Typography variant="body1">{ride.dropoffAddress}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle1">Dropoff Time:</Typography>
              <Typography variant="body1">{new Date(ride.dropoffTime).toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle1">Seats Offered:</Typography>
              <Typography variant="body1">{ride.seatsOffered}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle1">Seats Needed:</Typography>
              <Typography variant="body1">{ride.seatsNeeded}</Typography>
            </Grid>
            {ride.description && (
              <Grid item xs={12} md={12}>
                <Typography variant="subtitle1">Description:</Typography>
                <Typography variant="body1">{ride.description}</Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

export default RidesList;
