import React from 'react';
import './App.css';
import { useDispatch} from "react-redux";

import Header from './components/header/header'
import Content from './components/main/content'
import Championships from "./components/championships/championships";
import Members from "./components/members/members";
import JudgePage from './components/judge/judge_page';
import Registration from "./components/registration/registration";
import AdminPanel from "./components/admin/AdminPanel";
import Login from "./components/header/auth";
import JudgeSchool from "./components/registration/registerschool"
import RegistrationJudge from "./components/registration/registerjudge"


import { Routes, Route} from "react-router-dom";
import {fetchAuth} from "./redux/slices/auth";
import NotFound from "./components/errors/notFound";
import ParticipantInfo from "./components/admin/ParticipantInfo";
import TeamInfo from "./components/admin/team";
import TrainerInfo from "./components/admin/trainer"
import Judges from "./components/judges/judges";



function App() {
    const dispatch = useDispatch();

    React.useEffect(()=>{
        dispatch(fetchAuth())
    },[dispatch]);

    return (
            <div className="App">
                <Header/>
                    <Routes>
                        <Route exact path="/" element={<Content/>} />
                        <Route exact path="/judge/*" element={<JudgePage/>} />
                        <Route exact path="/members" element={<Members/>} />
                        <Route exact path="/championships" element={<Championships/>} />
                        <Route exact path="/registration" element={<Registration/>} />
                        <Route exact path="/adminpanel" element={<AdminPanel/>} />
                        <Route exact path='/login' element={<Login/>} />
                        <Route exact path='/judgeschool' element={<JudgeSchool/>} />
                        <Route exact path='/judgereg' element={<RegistrationJudge/>} />
                        <Route exact path='/participant/:id' element={<ParticipantInfo/>} />
                        <Route exact path='/team/:id' element={<TeamInfo/>} />
                        <Route exact path='/trainer/:id' element={<TrainerInfo/>} />
                        <Route exact path='/judges' element={<Judges/>} />
                        <Route exact path='/*' element={<NotFound/>} />
                    </Routes>
            </div>
    );
}

export default App;
