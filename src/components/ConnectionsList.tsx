import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import { UserConnection } from '@/types/types';  // Ensure the path is correct

const ConnectionsList = () => {
  const [connections, setConnections] = useState<UserConnection[]>([]);

  useEffect(() => {
    fetch('/api/user/connections')
      .then(res => res.json())
      .then(setConnections)
      .catch(err => console.error('Error fetching connections:', err));
  }, []);

  const removeConnection = async (connectionId: number) => {
    const response = await fetch('/api/user/connections/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectionId })
    });

    if (response.ok) {
      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    } else {
      alert('Failed to delete connection');
    }
  };

  return (
    <Box sx={{ margin: 2 }}>
      {connections.map((connection) => (
        <Paper key={connection.id} elevation={3} sx={{ margin: 2, padding: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6">
            Parent: {connection.firstName} {connection.lastName}
          </Typography>
          <Grid container spacing={2} justifyContent="center">  {/* Center alignment added here */}
            <Grid item>
              <Button variant="contained" color="error" onClick={() => removeConnection(connection.id)}>
                Remove Parent
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

export default ConnectionsList;