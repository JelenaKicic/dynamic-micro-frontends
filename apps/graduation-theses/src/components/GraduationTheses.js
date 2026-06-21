import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';
import {useGetThesesQuery} from "../services/thesesApi";
import Loader from "./Loader";
import CardComponent from "./CardComponent";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import SchoolIcon from '@mui/icons-material/School';

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
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <SchoolIcon color="primary" fontSize="large" />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Завршни радови
                </Typography>
            </Box>

            {error && (
                <Typography color="error">Грешка при учитавању завршних радова.</Typography>
            )}

            {!error && data && (
                <>
                    <Paper elevation={1} sx={{ borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <TablePagination
                            component="div"
                            count={data.total}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage={"Број редова по страници:"}
                        />
                    </Paper>

                    {data.content.map(item =>
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
                    )}
                </>
            )}
        </Box>
    );
}

export default GraduationTheses;
