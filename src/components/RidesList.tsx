import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote'; // Icon for event note
import RenderRideDetails from './RenderRideDetails';
import UpdateRide from './UpdateRide';
// import { Ride, GroupedRides } from '@/types/types';

const RidesList: React.FC = () => {
    // const [rides, setRides] = useState<GroupedRides[]>([]);
    // const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const theme = useTheme(); // Access the theme for consistent styling

    // const fetchRides = async () => {
    //     const response = await fetch('/api/rides');
    //     if (response.ok) {
    //         const data: Ride[] = await response.json();
    //         const groupedRides = data.reduce<{ [key: string]: GroupedRides }>((acc, ride) => {
    //             const date = ride.pickupTime ? new Date(ride.pickupTime).toDateString() : 
    //                         ride.dropoffTime ? new Date(ride.dropoffTime).toDateString() : 'undated';
    //             const key = `${ride.eventTitle}-${date}`;
    //             if (!acc[key]) {
    //                 acc[key] = { to: null, from: null, eventTitle: ride.eventTitle, date };
    //             }
    //             if (ride.rideType === 'to') acc[key].to = ride;
    //             if (ride.rideType === 'from') acc[key].from = ride;
    //             return acc;
    //         }, {});
    //         setRides(Object.values(groupedRides));
    //     }
    // };

    // useEffect(() => {
    //     fetchRides();
    // }, []);

    const handleOpenUpdateDialog = (ride: Ride) => {
        setSelectedRide(ride);
        setOpenUpdateDialog(true);
    };

    const handleCloseUpdateDialog = () => {
        setOpenUpdateDialog(false);
        setSelectedRide(null);
    };

    const handleSaveUpdate = () => {
        handleCloseUpdateDialog();
        // fetchRides();
    };

    return (
        <Box sx={{ margin: 2 }}>
            {rides.map((group, index) => (
                <Box key={index} sx={{ marginBottom: 4 }}>
                    <Paper elevation={2} sx={{
                        padding: 2,
                        backgroundColor: theme.palette.background.default,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center', // This centers the children horizontally
                        gap: theme.spacing(1)
                    }}>
                        <EventNoteIcon sx={{ color: theme.palette.primary.main }} />
                        <Typography variant="h6">
                            {group.eventTitle} - {new Date(group.date).toLocaleDateString()}
                        </Typography>
                    </Paper>
                    <Grid container spacing={2} justifyContent="space-around">
                        <Grid item xs={12} sm={6}>
                            {group.to && <RenderRideDetails ride={group.to} onOpenUpdateDialog={handleOpenUpdateDialog} />}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {group.from && <RenderRideDetails ride={group.from} onOpenUpdateDialog={handleOpenUpdateDialog} />}
                        </Grid>
                    </Grid>
                </Box>
            ))}
            {selectedRide && (
                <UpdateRide
                    ride={selectedRide}
                    open={openUpdateDialog}
                    onClose={handleCloseUpdateDialog}
                    onSave={handleSaveUpdate}
                />
            )}
        </Box>
    );
};

export default RidesList;
