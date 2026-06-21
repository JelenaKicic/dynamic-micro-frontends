import * as React from 'react';
import { useGetAnnouncementsQuery } from "../services/oglasiApi";
import Loader from "./Loader";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CampaignIcon from '@mui/icons-material/Campaign';
import EventIcon from '@mui/icons-material/Event';

const BOARDS = [
    { id: 1, name: 'Прва година' },
    { id: 2, name: 'Друга година' },
    { id: 3, name: 'Трећа година' },
    { id: 4, name: 'Четврта година' },
    { id: 21, name: 'Завршни радови' },
];

function formatDate(value) {
    if (!value) return '';
    return new Date(value).toLocaleDateString('sr-RS', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
}

function Announcements() {
    const [board, setBoard] = React.useState(1);
    const { data, error, isLoading, isFetching } = useGetAnnouncementsQuery(board);

    React.useEffect(() => {
        setBoard(parseInt(localStorage.getItem('year')) || 1);

        window.addEventListener("yearUpdated", e => {
            setBoard(e.detail.detail.year);
        });
    }, []);

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <CampaignIcon color="primary" fontSize="large" />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', flexGrow: 1 }}>
                    Обавјештења
                </Typography>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="board-label">Огласна плоча</InputLabel>
                    <Select
                        labelId="board-label"
                        value={board}
                        label="Огласна плоча"
                        onChange={(e) => setBoard(e.target.value)}
                    >
                        {BOARDS.map((b) => (
                            <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {(isLoading || isFetching) && <Loader />}

            {!isLoading && !isFetching && error && (
                <Typography color="error">Грешка при учитавању огласа.</Typography>
            )}

            {!isLoading && !isFetching && !error && data && data.length === 0 && (
                <Typography color="text.secondary">Нема активних огласа.</Typography>
            )}

            {!isLoading && !isFetching && !error && data && data.map((item) => (
                <Card
                    key={item.id}
                    elevation={2}
                    sx={{ mb: 2, borderTop: '3px solid', borderColor: 'primary.main' }}
                >
                    <CardHeader
                        title={item.naslov}
                        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                        subheader={
                            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                <Chip
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    label={item.oglasnaPloca?.naziv}
                                />
                                <Chip
                                    size="small"
                                    icon={<EventIcon />}
                                    label={formatDate(item.vrijemeKreiranja)}
                                />
                            </Box>
                        }
                    />
                    <Divider />
                    <CardContent>
                        {item.uvod && (
                            <Typography sx={{ fontStyle: 'italic', mb: 1 }} color="text.secondary">
                                {item.uvod}
                            </Typography>
                        )}
                        <Typography sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                            {item.sadrzaj}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {item.potpis}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                важи до {formatDate(item.vrijemeIsteka)}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}

export default Announcements;
