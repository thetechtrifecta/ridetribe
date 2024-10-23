import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid, Button, Dialog, DialogContent } from '@mui/material';
import dayjs from 'dayjs';
import CreateRide from '@/components/CreateRide'; // Ensure correct path
import { Event, Ride, Kid } from '@/types/types';

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [rideType, setRideType] = useState('');
  const [preselectedKids, setPreselectedKids] = useState<Kid[]>([])
  const [oppositeRideSettings, setOppositeRideSettings] = useState({
    wouldDrive: false,
    wantRide: false,
    seatsOffered: '0',
    seatsNeeded: '0'
  });
  const [mounted, setMounted] = useState(false); // Added to track if component has mounted

  useEffect(() => {
    // Mark component as mounted after hydration
    setMounted(true);

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

  const handleCreateRideClick = (event: Event, type: string) => {
    setCurrentEvent(event);
    setRideType(type);

    const oppositeRideType = type === 'to' ? 'from' : 'to';
    const oppositeRide = event.rides.find(ride => ride.rideType === oppositeRideType);

    // Ensure all settings are treated as the correct type
    const oppositeRideKids = oppositeRide ? oppositeRide.kids : [];
    const oppositeWouldDrive = oppositeRide ? oppositeRide.wouldDrive : false;
    const oppositeWantRide = oppositeRide ? oppositeRide.wantRide : false;
    // Convert numeric values to strings for consistent handling
    const oppositeSeatsOffered = oppositeRide ? oppositeRide.seatsOffered.toString() : '0';
    const oppositeSeatsNeeded = oppositeRide ? oppositeRide.seatsNeeded.toString() : '0';

    setCreateModalOpen(true);
    setPreselectedKids(oppositeRideKids);
    setOppositeRideSettings({
        wouldDrive: oppositeWouldDrive,
        wantRide: oppositeWantRide,
        seatsOffered: oppositeSeatsOffered,
        seatsNeeded: oppositeSeatsNeeded
    });
  };

  // Don't render until after client-side hydration
  if (!mounted) return null;

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const rideDetails = (ride: Ride) => {
    return (
      <>
        {ride.wouldDrive && (
          <Typography variant="subtitle1">
            <Typography component="span" sx={{ fontWeight: 'bold' }}>Would Drive:</Typography> {ride.seatsOffered} Seat(s) Offered
          </Typography>
        )}
        {ride.wantRide && (
          <Typography variant="subtitle1">
            <Typography component="span" sx={{ fontWeight: 'bold' }}>Wants Ride:</Typography> {ride.seatsNeeded} Seat(s) Needed
          </Typography>
        )}
        {ride.kids?.length > 0 && (
          <Typography variant="subtitle1">
            <Typography component="span" sx={{ fontWeight: 'bold' }}>Kids:</Typography> {ride.kids.map(kid => (
              `${kid.firstName} ${kid.lastName}${kid.phone ? ` (${kid.phone})` : ''}`
            )).join(', ')}
          </Typography>
        )}
      </>
    );
  };  

  return (
    <Box sx={{ margin: 4 }}>
      {events.map((event) => {
        const toRides = event.rides.filter(ride => ride.rideType === 'to');
        const fromRides = event.rides.filter(ride => ride.rideType === 'from');
  
        return (
          <Box key={event.id} sx={{ marginBottom: 4, border: '1px solid grey', borderRadius: '5px', overflow: 'hidden' }}>
            <Typography
              variant="h5"
              sx={{
                width: '100%',
                backgroundColor: (toRides.length > 0 && fromRides.length > 0) ? 'secondary.main' : 'error.main',
                color: 'white',
                padding: 2
              }}
            >
              {`${event.title} on ${dayjs(event.startTime).format('MMMM DD')} at ${event.address.split(',')[0]} from ${dayjs(event.startTime).format('h:mm A')} to ${dayjs(event.endTime).format('h:mm A')}`}
            </Typography>
            <Grid container spacing={2} sx={{ padding: 2 }}>
              <Grid item xs={12} md={6}>
                {toRides.map(ride => (
                  <Box key={ride.id}>
                    <Typography variant="h6" color="primary" sx={{ marginBottom: 2 }}>
                      To Ride:
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Pickup:</strong> {ride.pickupAddress}
                    </Typography>
                    {rideDetails(ride)}
                  </Box>
                ))}
                {!toRides.length && (
                  <Button variant="outlined" color="primary" onClick={() => handleCreateRideClick(event, 'to')}>
                    Create To Ride
                  </Button>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {fromRides.map(ride => (
                  <Box key={ride.id}>
                    <Typography variant="h6" color="primary" sx={{ marginBottom: 2 }}>
                      From Ride:
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Dropoff:</strong> {ride.dropoffAddress}
                    </Typography>
                    {rideDetails(ride)}
                  </Box>
                ))}
                {!fromRides.length && (
                  <Button variant="outlined" color="primary" onClick={() => handleCreateRideClick(event, 'from')}>
                    Create From Ride
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
        );
      })}
      {currentEvent && (
        <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} fullWidth maxWidth="sm">
          <DialogContent>
          <CreateRide
              event={currentEvent}
              rideType={rideType}
              preselectedKids={preselectedKids}
              oppositeRideSettings={oppositeRideSettings}
              onClose={() => setCreateModalOpen(false)}
          />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
  
};

export default EventsList;
