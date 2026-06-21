import * as React from 'react';
import {useGetClassesQuery, useGetRoomsQuery} from "../services/classroomsApi";
import Loader from "./Loader";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const DAYS = ['Vrijeme', 'Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];

const headCellSx = {
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    textAlign: 'center',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    whiteSpace: 'nowrap',
};

const bodyCellSx = {
    borderColor: '#e2e8f0',
    textAlign: 'center',
    verticalAlign: 'middle',
    fontSize: 13,
    color: '#334155',
};

function Classrooms() {
    const lastMonday = dayjs().startOf('week').add(1, 'day');

    const [room, setRoom] = React.useState(1);
    const [date, setDate] = React.useState(lastMonday);

    const { data, isLoading } = useGetRoomsQuery();

    const classesQuery = useGetClassesQuery({room, date: date?.format("YYYY-MM-DD")});


    const updateRoomEvent = async (event) => {
        setRoom(event.target.value);
    };

    const updateDateEvent = async (newValue) => {
        setDate(newValue);
    };

    const isNotMonday = (date) => {
        const day = date.day();

        return day === 0 || day === 2 || day === 3 || day === 4 || day === 5 || day === 6;

    };



    if(isLoading)
        return <Loader/>;

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <MeetingRoomIcon color="primary" fontSize="large" />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Raspored učionica
                </Typography>
            </Box>

            <Paper
                elevation={1}
                sx={{
                    p: { xs: 2, md: 3 },
                    mb: 3,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                }}
            >
                <FormControl sx={{ flex: 1, minWidth: 200 }}>
                    <InputLabel id="room-select-label">Sala</InputLabel>
                    <Select
                        labelId="room-select-label"
                        id="room-select"
                        value={room}
                        onChange={updateRoomEvent}
                        label="Sala"
                    >
                        {data && data.map(room => (
                            <MenuItem value={room.id} key={room.id}>{room.naziv}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={"Sedmica"}
                        value={date}
                        onChange={updateDateEvent}
                        shouldDisableDate={isNotMonday}
                        views={['year', 'month', 'day']}
                        format="DD/MM/YYYY"
                        sx={{ flex: 1, minWidth: 200 }}
                    />
                </LocalizationProvider>
            </Paper>

            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }} aria-label="raspored učionica">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                            {DAYS.map((day) => (
                                <TableCell key={day} sx={headCellSx}>{day}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {classesQuery && classesQuery.data && classesQuery.data.map((row, rowIndex) => (
                            row[0] != null && (
                                <TableRow
                                    key={rowIndex}
                                    sx={{
                                        '&:nth-of-type(odd)': { bgcolor: '#f8fafc' },
                                        '&:hover': { bgcolor: '#f0fdfa' },
                                    }}
                                >
                                    {row.map((cell, cellIndex) => (
                                        <TableCell
                                            key={cellIndex}
                                            sx={{
                                                ...bodyCellSx,
                                                ...(cellIndex === 0 && { fontWeight: 600, color: 'primary.main', whiteSpace: 'nowrap' }),
                                            }}
                                        >
                                            <Box dangerouslySetInnerHTML={{__html: cell}}/>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Classrooms;
