import express from 'express';
import mongoose from "mongoose";
import multer from "multer";
import cors from 'cors';
import checkAuth from "./utils/checkAuth.js";

import {
    register,
    login,
    check,
    championship,
    benefit,
    addNomination,
    addPriceDefault,
    judgeChamp,
    getLastJudges,
    updateJudgeNominations,
    deleteJudge,
    getWorksJudge,
    deleteNomination,
    getCriteria,
    participantJudge,
    addWorkJudge,
    addGrade,
    getWorks,
    updateJudgeWorks,
    removeJudgeFromWork,
    member,
    getWorksParticipant,
    getTeamInfo,
    getTrainerInfo,
    judgeSchool,
    timeServer,
    judgeReq,
    sendResults
} from "./controllers/userController.js";
import {
    getNominations,
    getChampionship,
    getChampionships,
    participant,
    participants,
    getJudges,
    getBenefit,
    getPriceDefault,
    addRequestJudge,
    addJudgeSchool,
    getJudgesNow,
    getTeams,
    participantsPoster,
    members,
} from "./controllers/participantController.js";
import {
    getReglament, addReglament
} from "./controllers/mainpageController.js"


import TeamSchema from "./models/Team.js";


const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    }, filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static('uploads'))
mongoose.connect('mongodb+srv://admin:31ONhpY3sv1WlzRp@cluster0.wykfvfh.mongodb.net/nailbridge?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB error', err));

app.listen(4444, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Server is running on port 4444');
});

app.get('/timeServer', timeServer)

app.get('/auth/me', checkAuth, check);

app.get('/participants', participants);

app.get('/members', members)

app.get('/championship', getChampionship);
app.get('/championships', getChampionships)

app.get('/nominations', getNominations)

app.get('/reglament', getReglament)

app.get('/judges', getJudges)

app.get('/benefit', getBenefit)

app.get('/pricedefault', getPriceDefault)

app.get('/judgesnow', getJudgesNow)

app.get('/teams', getTeams)

app.get('/lastjudges', getLastJudges)

app.get('/judgework', getWorksJudge)

app.get('/member', member)

app.get('/getWorksParticipant', getWorksParticipant)

// app.get('/usersgrades', getUsersGrades)

app.get('/participantsPoster', participantsPoster)

app.get('/works', getWorks)

app.get('/getTeamInfo', getTeamInfo)

app.get('/getTrainerInfo', getTrainerInfo)

app.get('/judgereq', judgeReq)

app.get('/judgeschool', judgeSchool)


app.post('/getcriteria', getCriteria)

app.post('/participantjudge', participantJudge)

//app.post('/gradesid', gradesId)

app.post('/team', async (req, res) => {
    const team = new TeamSchema({
        teamName: req.body.teamName
    })

    await team.save()

    return (res.status(200).json({
        message: 'OK'
    }))
})

app.post('/auth/login', login);

app.post('/auth/register', checkAuth, register);

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.post('/addWorkJudge', checkAuth, addWorkJudge)

app.post('/championship', checkAuth, championship);

app.post('/participant', participant)

app.post('/benefit', checkAuth, benefit)

app.post('/nominations', checkAuth, addNomination)

app.post('/reglament', checkAuth, addReglament)

app.post('/pricedefault', checkAuth, addPriceDefault)

app.post('/requestjudge', addRequestJudge)

app.post('/judgeschool', addJudgeSchool)

app.post('/judgenominations', checkAuth, updateJudgeNominations)

app.post('/judgechamp', checkAuth, judgeChamp)

app.post('/judgework', checkAuth, updateJudgeWorks)

app.post('/removeJudgeFromWork', checkAuth, removeJudgeFromWork)


app.delete('/judges', checkAuth, deleteJudge)

app.delete('/nominations', checkAuth, deleteNomination)

app.post('/grade', checkAuth, addGrade)

app.post('/results', checkAuth, sendResults)
