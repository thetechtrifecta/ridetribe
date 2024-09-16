import * as React from 'react';
import Image from 'next/image';
import logo from '../../public/images/carpooling.png';
import { Box, Typography, Container, Paper } from '@mui/material';

export default function Splash() {
    return (
        <Container component="main" maxWidth="lg">
            <Paper elevation={3} sx={{ my: 4, p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                Welcome to Ride Tribe!
                </Typography>
                <Typography variant="body1" gutterBottom>
                We know that the management of driving or carpooling your kids is a problem. With RideTribe, we fix that by allowing you to create Rides for your kids with Tribes of parents you trust.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Image src={logo} alt="Logo" width={200} height={200} />
                </Box>
            </Paper>
        </Container>
    )
}