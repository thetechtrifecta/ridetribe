import * as React from 'react';
import Box from '@mui/material/Box';
import Image from 'next/image';
import logo from '../../public/images/carpooling.png';  

export default function Splash() {
    return (
        <Box
            sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            }}
        >
            <Image src={logo} alt="Logo" width={200} height={200} />
        </Box>
    )
}