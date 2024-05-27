import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const yuconv = require('yuconv');

function CardComponent({title, description, status, mentor, boardMember, headOfBoard, student}) {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{ padding: "20px", borderRadius: "1%", marginTop: "20px"}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ fontSize: "30px", margin: "20px"}} />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    sx={{ width: '100%'}}
                >
                    <Typography variant={"body"} sx={{width: "100%"}}>
                        <Typography variant={"body"} sx={{width: '100%', display: "flex", flexDirection: {xs: "column", md: "row"}, justifyContent: "center", alignItems: "center", gap: {xs: "10px", md: "30px"}}}>
                            <Typography sx={{ width: '100%'}} align={"left"} variant={"h6"}>
                                {yuconv(title, 'cirilica')}
                            </Typography>
                            <Typography variant={"body"} sx={{ width: '100%', color: 'text.secondary', textAlign: {xs: "left", md: "right"}, fontStyle: "oblique"}}>Статус рада: {yuconv(status, 'cirilica')}</Typography>
                        </Typography>
                        <Typography variant={"body"} sx={{marginTop: "30px", display: "flex", flexDirection: {xs: "column", sm: "row"}, gap: {xs: "10px", sm: "30px"}}}>
                            <Typography align={"left"}>
                                Предсједник комисије: {yuconv(headOfBoard, 'cirilica')}
                            </Typography>
                            <Typography align={"left"}>
                                Члан комисије: {yuconv(boardMember, 'cirilica')}
                            </Typography>
                            <Typography align={"left"}>
                                Ментор: {yuconv(mentor, 'cirilica')}
                            </Typography>
                            {student && <Typography align={"left"}>
                                Студент: {yuconv(student, 'cirilica')}
                            </Typography>}
                        </Typography>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography align={"left"} sx={{marginTop: "10px"}}>
                        {yuconv(description, 'cirilica')}
                    </Typography>
                </AccordionDetails>
            </Accordion>
    </>
    );
}

export default CardComponent;
