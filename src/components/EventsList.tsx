import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid } from '@mui/material';
import dayjs from 'dayjs';
import { Event } from '@/types/types';

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data: Event[] = await response.json();
        setEvents(data);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ margin: 4 }}>
      {events.map((event) => (
        <Box key={event.id} sx={{ marginBottom: 4, border: '1px solid grey', borderRadius: '5px', overflow: 'hidden' }}>
          <Typography variant="h5" sx={{ width: '100%', backgroundColor: 'secondary.main', color: 'white', padding: 2 }}>
            {`${event.title} on ${dayjs(event.startTime).format('MMMM DD')} at ${event.address.split(',')[0]} from ${dayjs(event.startTime).format('h:mm A')} to ${dayjs(event.endTime).format('h:mm A')}`}
          </Typography>
          <Grid container spacing={2} sx={{ padding: 2 }}>
            {event.rides.map(ride => (
              <Grid item xs={12} md={6} key={ride.id}>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                  {ride.rideType === 'to' ? 'To Ride:' : 'From Ride:'}
                </Typography>
                <Typography variant="subtitle1">{ride.rideType === 'to' ? `Pickup: ${ride.pickupAddress}` : `Dropoff: ${ride.dropoffAddress}`}</Typography>
                {ride.wouldDrive && (
                  <Typography variant="subtitle1">Would Drive - Seats Offered: {ride.seatsOffered}</Typography>
                )}
                {ride.wantRide && (
                  <Typography variant="subtitle1">Wants Ride - Seats Needed: {ride.seatsNeeded}</Typography>
                )}
                {ride.kids?.length > 0 && (
                  ride.kids.map(kid => (
                    <Typography variant="subtitle1" key={kid.id}>
                      Kids: {kid.firstName} {kid.lastName} {kid.phone ? `- Phone: ${kid.phone}` : ''}
                    </Typography>
                  ))
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default EventsList;
