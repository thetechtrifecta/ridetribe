"use client"

import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, Grid, Button } from '@mui/material';
import { useUser } from "@clerk/nextjs";
import UpdateKid from './UpdateKid';
import DeleteKid from './DeleteKid'; 
import { Kid } from '@/types/types'; 

const KidsList = () => {
  const { user } = useUser();
  const [kids, setKids] = useState<Kid[]>([]);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const fetchKids = async () => {
    if (user) {
      const res = await fetch(`/api/kids`);
      const data = await res.json();
      setKids(data);
    }
  };

  useEffect(() => {
    fetchKids();
  }, [user]);

  const handleOpenUpdateDialog = (kid: Kid) => {
    setSelectedKid(kid);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setSelectedKid(null);
  };

  const handleSaveUpdate = () => {
    handleCloseUpdateDialog();
    fetchKids();
  };

  return (
    <Box sx={{ margin: 2 }}>
      {kids.map((kid) => (
        <Paper key={kid.id} elevation={3} sx={{ margin: 2, padding: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            Kid: {kid.firstName} {kid.lastName}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Age:</Typography>
              <Typography variant="body1">{kid.age}</Typography>
            </Grid>
            {kid.phone && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Phone:</Typography>
                <Typography variant="body1">{kid.phone}</Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button onClick={() => handleOpenUpdateDialog(kid)} variant="contained" color="primary">
                Update
              </Button>
              <DeleteKid kidId={kid.id} /> 
            </Grid>
          </Grid>
        </Paper>
      ))}
      {selectedKid && (
        <UpdateKid
          kid={selectedKid}
          open={openUpdateDialog}
          onClose={handleCloseUpdateDialog}
          onSave={handleSaveUpdate}
        />
      )}
    </Box>
  );
};

export default KidsList;
