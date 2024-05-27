import * as React from 'react';
import {useGetClassesQuery} from "../services/classesApi";
import Loader from "./Loader";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect} from "react";

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
        <Box sx={{paddingX: {xs: "5%", xl: "7%"}, paddingBottom: "2%", paddingTop: "2%"}}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, border: "1px solid #bababa" }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{border: "1px solid #bababa"}} align="center">Вријеме</TableCell>
                            <TableCell sx={{border: "1px solid #bababa"}} align="center">Понедјељак</TableCell>
                            <TableCell sx={{border: "1px solid #bababa"}} align="center">Уторак</TableCell>
                            <TableCell sx={{border: "1px solid #bababa"}} align="center">Сриједа</TableCell>
                            <TableCell sx={{border: "1px solid #bababa"}} align="center">Четвртак</TableCell>
                            <TableCell sx={{border: "1px solid #bababa"}} align="center">Петак</TableCell>
                            <TableCell sx={{border: "1px solid #bababa"}} align="center">Субота</TableCell>
                            <TableCell sx={{border: "1px solid #bababa"}} align="center">Недјеља</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ }}
                            >
                                {row[0] != null && (
                                    row.map(cell =>
                                        <TableCell sx={{border: "1px solid #bababa"}} align="center"><Box dangerouslySetInnerHTML={{__html: cell}}/></TableCell>
                                    )
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Classes;
