import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';
import {useGetThesesQuery} from "../services/thesesApi";
import Loader from "./Loader";
import TableRow from '@mui/material/TableRow';
import CardComponent from "./CardComponent";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';

function GraduationTheses() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const { data, error, isLoading } = useGetThesesQuery({fetchSize: rowsPerPage, fetchOffset: page * rowsPerPage})

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if(isLoading)
        return <Loader/>;

    return (
        <Paper sx={{paddingX: {xs: "5%", xl: "7%"}, paddingBottom: "2%", paddingTop: "2%"}}>
            <TableContainer >
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TablePagination
                                component="div"
                                count={data.total}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage={"Број редова по страници:"}
                            />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.content.map(item =>
                            <TableRow>
                                <CardComponent
                                    key={item.id}
                                    title={item.tema}
                                    description={item.obrazlozenje}
                                    status={item.trenutniStatus.statusZavrsnogRada.naziv}
                                    mentor={item.mentor.ime}
                                    headOfBoard={item.predsjednikKomisije.ime}
                                    boardMember={item.clanKomisije.ime}
                                    student={item.studentIme}
                                />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default GraduationTheses;
