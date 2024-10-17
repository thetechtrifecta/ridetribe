import React, { useState } from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
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
    dayjs().add(1, 'hour') // Default to one hour later for end
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
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', margin: 'auto', maxWidth: 500 }}>
        <Typography variant="h6">Create an Event</Typography>
        <TextField
          label="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
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
          />
        </LocalizationProvider>
        <Button type="submit" variant="contained" color="primary" disabled={!isFormValid}>
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default CreateEvent;
