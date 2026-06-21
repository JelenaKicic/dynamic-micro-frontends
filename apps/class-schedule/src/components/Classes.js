import * as React from 'react';
import {useGetClassesQuery} from "../services/classesApi";
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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {useEffect} from "react";

const DAYS = ['Вријеме', 'Понедјељак', 'Уторак', 'Сриједа', 'Четвртак', 'Петак', 'Субота', 'Недјеља'];

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

function Classes() {
    const [studyProgram, setStudyProgram] = React.useState(1);
    const [module, setModule] = React.useState(1);

    const { data, error, isLoading } = useGetClassesQuery({studyProgram: studyProgram, module: module})

    useEffect(() => {
        setStudyProgram(parseInt(localStorage.getItem('studyProgram')) || 1);
        setModule(parseInt(localStorage.getItem('module')) || 1);

        window.addEventListener("studyProgramsSettingsUpdated", e => {
            setStudyProgram(e.detail.detail.studyProgram);
            setModule(e.detail.detail.module);
        });
    }, []);


    if(isLoading)
        return <Loader/>;

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <CalendarMonthIcon color="primary" fontSize="large" />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Распоред часова
                </Typography>
            </Box>

            {error && (
                <Typography color="error">Грешка при учитавању распореда.</Typography>
            )}

            {!error && (
                <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="распоред часова">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.main' }}>
                                {DAYS.map((day) => (
                                    <TableCell key={day} sx={headCellSx}>{day}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.map((row, rowIndex) => (
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
            )}
        </Box>
    );
}

export default Classes;
