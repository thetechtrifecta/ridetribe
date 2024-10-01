import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Dialog, DialogContent } from '@mui/material';
import { Kid } from '@/types/types'; 

type Props = {
  kid: Kid;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
};

const UpdateKid = ({ kid, open, onClose, onSave }: Props) => {
  const [firstName, setFirstName] = useState(kid.firstName);
  const [lastName, setLastName] = useState(kid.lastName);
  const [age, setAge] = useState(kid.age.toString());
  const [phone, setPhone] = useState(kid.phone || '');

  useEffect(() => {
    if (open) {
      setFirstName(kid.firstName);
      setLastName(kid.lastName);
      setAge(kid.age.toString());
      setPhone(kid.phone || '');
    }
  }, [kid, open]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/kid/update/${kid.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          age,
          phone
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update kid: ${response.statusText}`);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating kid:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          noValidate
          autoComplete="off"
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        >
          <Typography variant="h6">Update Kid</Typography>
          <TextField
            label="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Phone (optional)"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <Button type="submit" variant="contained">
            Update
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateKid;
