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
            {event.title} - {dayjs(event.startTime).format('MMM DD, YYYY')}
          </Typography>
          <Grid container spacing={2} sx={{ padding: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'left' }}>From:</Typography>
              {event.rides.filter(ride => ride.rideType === 'from').map(ride => (
                <Box key={ride.id} sx={{ marginBottom: 1 }}>
                  <Typography variant="subtitle1">Pickup: {ride.pickupAddress}</Typography>
                  <Typography variant="subtitle1">Dropoff: {ride.dropoffAddress}</Typography>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'left' }}>To:</Typography>
              {event.rides.filter(ride => ride.rideType === 'to').map(ride => (
                <Box key={ride.id} sx={{ marginBottom: 1 }}>
                  <Typography variant="subtitle1">Pickup: {ride.pickupAddress}</Typography>
                  <Typography variant="subtitle1">Dropoff: {ride.dropoffAddress}</Typography>
                </Box>
              ))}
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default EventsList;
