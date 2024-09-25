import React from 'react';
import { Typography, Paper, Box, Grid } from '@mui/material';
import DeleteRide from './DeleteRide';
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function RidesList() {
  const clerkUser = await currentUser()
  if (!clerkUser) return

  const pgUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id}
  })

  const rides = await prisma.ride.findMany({
    where: { creatorId: pgUser?.id },
  })
  return (
    <Box sx={{ margin: 2 }}>
      {rides.map((ride) => (
        <Paper key={ride.id} elevation={3} sx={{ margin: 2, padding: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            Ride Title: {ride.title || 'No title'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle1">Ride Type:</Typography>
              <Typography variant="body1">{ride.rideType.charAt(0).toUpperCase() + ride.rideType.slice(1)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1">Pickup:</Typography>
              <Typography variant="body1">{ride.pickupAddress}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle1">Pickup Time:</Typography>
              <Typography variant="body1">
                {ride.pickupTime ? new Date(ride.pickupTime).toLocaleString() : ''}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1">Dropoff:</Typography>
              <Typography variant="body1">{ride.dropoffAddress}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle1">Dropoff Time:</Typography>
              <Typography variant="body1">
                {ride.dropoffTime ? new Date(ride.dropoffTime).toLocaleString() : ''}
              </Typography>
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
          <DeleteRide rideId={ride.id} />
        </Paper>
      ))}
    </Box>
  );
};