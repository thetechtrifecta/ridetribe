import React, { useState } from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import { SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { useUser } from "@clerk/nextjs"; 
import SelectAddress from '@/components/SelectAddress';
import { PlaceType } from '@/types/types';

const CreateEvent: React.FC = () => {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState<PlaceType | null>(null);
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([
    dayjs(), // Default to current time for start
    dayjs().add(2, 'hour') // Default to two hours later for end
  ]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!dateRange[0] || !dateRange[1]) {
      console.error("Start and end times are required.");
      return;
    }

    const eventData = {
      clerkUserId: user?.id,
      title,
      address: address?.description,
      startTime: dateRange[0].toISOString(),
      endTime: dateRange[1].toISOString(),
    };

    const response = await fetch('/api/event/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventData }),
    });

    if (response.ok) {
      alert('Event created successfully');
    } else {
      const error = await response.text();
      console.error('Failed to create event:', error);
    }
  };

  const isFormValid = title && address && dateRange[0] && dateRange[1] && user;

  return (
    <Box
      component="form"
      sx={{
        my: 4,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 500,
      }}
      onSubmit={handleSubmit}
    >
      <Typography variant="h6">Create an Event for Rides</Typography>
      <TextField
        label="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        variant="outlined"
        margin="normal"
        fullWidth
      />
      <SelectAddress
        label="Event Address"
        onSelect={setAddress}
        selectedAddress={address}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimeRangePicker
          value={dateRange}
          onChange={setDateRange}
          // slots={{ field: SingleInputDateTimeRangeField }}
          sx={{ 
            width: '100%',
            mt: 2.5
            // '& .MuiInputBase-input': {
            //   textAlign: 'center',
            // }
          }}
        />
      </LocalizationProvider>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!isFormValid}
        sx={{ mt: 2 }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default CreateEvent;
