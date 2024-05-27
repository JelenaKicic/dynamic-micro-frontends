import * as React from 'react';
import {useGetClassesQuery, useGetRoomsQuery} from "../services/classroomsApi";
import Loader from "./Loader";
import Box from '@mui/material/Box';
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
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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

    const isNotMonday = (date: Dayjs) => {
        const day = date.day();

        return day === 0 || day === 2 || day === 3 || day === 4 || day === 5 || day === 6;

    };



    if(isLoading)
        return <Loader/>;

    return (
        <Box sx={{paddingX: {xs: "5%", xl: "10%"}, paddingBottom: "2%", paddingTop: "2%"}}>
            <Box sx={{width: "100%", display: "flex", flexDirection: "row"}}>
                <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-filled-label">Sala</InputLabel>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={room}
                        onChange={updateRoomEvent}
                        label={"Sala"}
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
                        variant="filled"
                        format="DD/MM/YYYY"
                    />
                </LocalizationProvider>
            </Box>
            <Box sx={{marginTop: "40px"}}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650, border: "1px solid #bababa" }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{border: "1px solid #bababa"}} align="center">Vrijeme</TableCell>
                                <TableCell sx={{border: "1px solid #bababa"}} align="center">Ponedjeljak</TableCell>
                                <TableCell sx={{border: "1px solid #bababa"}} align="center">Utorak</TableCell>
                                <TableCell sx={{border: "1px solid #bababa"}} align="center">Srijeda</TableCell>
                                <TableCell sx={{border: "1px solid #bababa"}} align="center">Četvrtak</TableCell>
                                <TableCell sx={{border: "1px solid #bababa"}} align="center">Petak</TableCell>
                                <TableCell sx={{border: "1px solid #bababa"}} align="center">Subota</TableCell>
                                <TableCell sx={{border: "1px solid #bababa"}} align="center">Nedjelja</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {classesQuery && classesQuery.data && classesQuery.data.map((row) => (
                                <TableRow
                                    key={row[0]}
                                >
                                    {row[0] != null && (row.map(cell =>
                                        <TableCell sx={{border: "1px solid #bababa"}} align="center"><Box dangerouslySetInnerHTML={{__html: cell}}/></TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default Classrooms;
