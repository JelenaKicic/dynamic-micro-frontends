import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {useEffect} from "react";
import {useGetModulesQuery} from "../services/settingsApi";

export default function SettingsForm() {
    const [year, setYear] = React.useState(1);
    const [studyProgram, setStudyProgram] = React.useState(1);
    const [module, setModule] = React.useState("");

    const { data } = useGetModulesQuery({studyProgram, year});
    const updateYear = async (event) => {
        setYear(event.target.value);
        await localStorage.setItem('year', "" + event.target.value);

        dispatchCustomEvent("yearUpdated", {detail: {year: event.target.value}});

        if(event.target.value === 1) {
            await localStorage.setItem('studyProgram', "" + 1);
            await localStorage.setItem('module', "" + 1);
            dispatchCustomEvent("studyProgramsSettingsUpdated", {detail: {studyProgram: 1, module: 1}});
        } else {
            setStudyProgram(2);
            await localStorage.setItem('studyProgram', "" + 2);
        }
    };

    const updateStudyProgramEvent = async (event) => {
        setStudyProgram(event.target.value);
        await localStorage.setItem('studyProgram', "" + event.target.value);
    };

    const updateModuleEvent = async (event) => {
        setModule(event.target.value);
        await localStorage.setItem('module', "" + event.target.value);

        dispatchCustomEvent("studyProgramsSettingsUpdated", {detail: {studyProgram: studyProgram, module: event.target.value}});
    };


    const dispatchCustomEvent = (name, props) => {
        const event = new CustomEvent(name, {detail: props});
        window.dispatchEvent(event)
    }

    const semesterMatchesYear = (semester) => {
        return (year === 2 && (semester === "3" || semester === "4")) || (year === 3 && (semester === "5" || semester === "6")) || (year === 4 && (semester === "7" || semester === "8"));
    }


    useEffect(() => {
        setYear(parseInt(localStorage.getItem('year') || 1));
        setStudyProgram(parseInt(localStorage.getItem('studyProgram')));
        setModule(parseInt(localStorage.getItem('module')));

        data?.forEach(item => {
            let firstFound = false;
            if(semesterMatchesYear(item.semester)) {
                if(!firstFound) {
                    firstFound = true;
                    setModule(item.epId);
                    localStorage.setItem('module', "" + item.epId);
                    dispatchCustomEvent("studyProgramsSettingsUpdated", {detail: {studyProgram: studyProgram, module: item.epId}});
                }
            }
        });
    }, [data, semesterMatchesYear, studyProgram]);



    return (
        <div className={"settingsForm"}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Година студија</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={year}
                    onChange={updateYear}
                    label="Година студија"
                >
                    <MenuItem value={1}>Прва Година</MenuItem>
                    <MenuItem value={2}>Друга Година</MenuItem>
                    <MenuItem value={3}>Трећа Година</MenuItem>
                    <MenuItem value={4}>Четврта Година</MenuItem>
                </Select>
            </FormControl>
            {year > 1 &&
                <>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-filled-label">Студијски програм</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={studyProgram}
                            onChange={updateStudyProgramEvent}
                            label="Студијски програм"
                        >
                            <MenuItem value={2}>Рачунарство и информатика</MenuItem>
                            <MenuItem value={3}>Електроника и Телекомуникације</MenuItem>
                            <MenuItem value={4}>Електроенергетика и Аутоматика</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-filled-label">Смјер</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={module}
                            onChange={updateModuleEvent}
                            label="Смјер"
                        >
                            {data && data.map(item => {
                                if(semesterMatchesYear(item.semester)) {
                                    return <MenuItem value={item.epId} key={item.code}>{item.name?.split(" - ")[1]}</MenuItem>
                                }
                            })}
                        </Select>
                    </FormControl>
                </>
            }
        </div>
    );
}
