import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const yuconv = require('yuconv');

function MetaItem({ label, value }) {
    if (!value) return null;
    return (
        <Box sx={{ minWidth: 180 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11 }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {value}
            </Typography>
        </Box>
    );
}

function CardComponent({title, description, status, mentor, boardMember, headOfBoard, student}) {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
            disableGutters
            elevation={0}
            sx={{
                mb: 2,
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                borderLeft: '4px solid',
                borderLeftColor: 'primary.main',
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                overflow: 'hidden',
                '&:before': { display: 'none' },
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ px: 3, py: 1.5, '& .MuiAccordionSummary-content': { my: 1 } }}
            >
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 1.5,
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>
                        {yuconv(title, 'cirilica')}
                    </Typography>
                    <Chip
                        size="small"
                        color="primary"
                        variant="outlined"
                        label={`Статус: ${yuconv(status, 'cirilica')}`}
                        sx={{ flexShrink: 0 }}
                    />
                </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mb: 2 }}>
                    <MetaItem label="Предсједник комисије" value={yuconv(headOfBoard, 'cirilica')} />
                    <MetaItem label="Члан комисије" value={yuconv(boardMember, 'cirilica')} />
                    <MetaItem label="Ментор" value={yuconv(mentor, 'cirilica')} />
                    {student && <MetaItem label="Студент" value={yuconv(student, 'cirilica')} />}
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography sx={{ lineHeight: 1.6, color: '#334155', whiteSpace: 'pre-line' }}>
                    {yuconv(description, 'cirilica')}
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
}

export default CardComponent;
