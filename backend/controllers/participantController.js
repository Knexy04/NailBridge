import ParticipantSchema from "../models/Participant.js";
import BenefitSchema from "../models/Benefit.js";
import ChampionshipSchema from "../models/Championship.js";
import TeamSchema from "../models/Team.js";
import NominationSchema from "../models/Nomination.js";
import JudgeSchema from "../models/Judge.js";
import PriceDefaultSchema from "../models/PriceDefault.js"
import JudgeRequestSchema from "../models/JudgeRequest.js";
import JudgeSchoolSchema from "../models/JudgeSchool.js"
import mongoose from "mongoose";
import WorkSchema from "../models/Work.js";

export const participant = async (req, res) => {
    try {
        const nominations_online = req.body.nominationOnline;
        const nominations_offline = req.body.nominationOffline; // Use an empty object as default if it's not provided
        const link_work = req.body.linkWork;

        let combinedData = [];

        for (const [nominationId, value] of Object.entries(nominations_online)) {
            if (value === true) {
                combinedData.push({
                    nominationId,
                    online:true
                });
            }
        }

        for (const [nominationId, value] of Object.entries(nominations_offline)) {
            if (value === true) {
                combinedData.push({
                    nominationId,
                    online: false
                });
            }
        }

        let nominations = [];

        for (const combinedItem of combinedData) {
            const nominationId = combinedItem.nominationId;
            if (combinedItem.online){
                const workLinks = link_work[nominationId];

                if (workLinks && typeof workLinks === 'object' && Object.keys(workLinks).length > 0) {
                    for (const linkIndex in workLinks) {
                        nominations.push({
                            nominationId,
                            workLink: workLinks[linkIndex]
                        });
                    }
                }
            }
            else{
                nominations.push({
                    nominationId,
                    workLink: '',
                });
            }
        }


        const championship = await ChampionshipSchema.find().limit(1).sort({$natural: -1});

        const team_Name = req.body.teamName

        let teamId = null

        if (team_Name!==""){
            const team_Trainer = req.body.teamTrainer
            const team_Trainer2 = team_Trainer.split(',')
            const teamTrainer = team_Trainer2.map((fullName) => {
                if (fullName!==""){
                    return {
                        fullName: fullName,
                    };
                }
            });

            let team = await TeamSchema.findOne({"teamName": team_Name}).exec();
            if (!team) {
                team = await TeamSchema.create({
                    "teamName": team_Name,
                    "teamTrainer": teamTrainer,
                    "championshipId": championship[0]._id
                });
            }

            teamId = team._id;
        }


        const benefit_Name = req.body.benefitName

        let benefitId = null

        const benefit = await BenefitSchema.find({"name": benefit_Name}).exec();
        if (benefit.length > 0) {
            benefitId = benefit[0]._id
        }

        const teamMembers = req.body.members;

        let role_main = '';
        let flag_benefit = false;
        if (benefit_Name === 'Команда-постер') {
            role_main = 'Мастер'
            flag_benefit = true
        }

        let participantsId = [];

        const participant = new ParticipantSchema({
            linkBenefitPhoto: req.body.linkBenefitPhoto,
            fullName: req.body.fullName,
            category: req.body.category,
            team_id: teamId,
            email: req.body.email,
            company: req.body.company,
            role: role_main,
            country: req.body.country,
            city: req.body.city,
            address: req.body.address,
            experience: req.body.experience,
            phoneNumber: req.body.phoneNumber,
            profileLink: req.body.profileLink,
            payment: req.body.payment,
            benefitId: benefitId,
            championshipId: championship[0]._id,
        })

        await participant.save();
        participantsId.push({participantId: participant._doc._id})
        if (teamMembers.length !== 0) {
            for (let i = 0; i < teamMembers.length; i++) {
                const participant = new ParticipantSchema({
                    linkBenefitPhoto: req.body.linkBenefitPhoto,
                    fullName: teamMembers[i].fullName,
                    category: req.body.category,
                    team_id: teamId,
                    company: req.body.company,
                    role: teamMembers[i].role,
                    country: req.body.country,
                    city: req.body.city,
                    address: req.body.address,
                    experience: req.body.experience,
                    phoneNumber: teamMembers[i].phoneNumber,
                    profileLink: teamMembers[i].profileLink,
                    payment: req.body.payment,
                    benefitId: benefitId,
                    championshipId: championship[0]._id,
                    email: teamMembers[i].email,
                })

                await participant.save();
                participantsId.push({participantId: participant._doc._id})
            }
        }


        for (let i = 0; i < nominations.length; i++) {
            const work = new WorkSchema({
                nominationId: nominations[i].nominationId,
                linkWork: nominations[i].workLink,
                participants: participantsId,
                championshipId: championship[0]._id,
                judgeId: [],
                grades: [],
                comment: '',
                poster: flag_benefit,
            })
            await work.save();
        }

        return (res.status(200).json({
            register: true
        }))

    } catch (err) {
        return (
            res.status(500).json({
                message: "502 error"
            })
        )
    }
}

export const members = async (req, res) => {
    try {
        const championship = await ChampionshipSchema.find().limit(1).sort({$natural: -1});
        const participants = await WorkSchema.aggregate([
            {
                $match: {championshipId: championship[0]._id}
            },
            {
                $lookup: {
                    from: ParticipantSchema.collection.name,
                    localField: "participants.participantId",
                    foreignField: "_id",
                    as: "Participant"
                }
            },
            {
                $lookup: {
                    from: TeamSchema.collection.name,
                    localField: "Participant.team_id",
                    foreignField: "_id",
                    as: "team"
                }
            },
            {
                $lookup: {
                    from: NominationSchema.collection.name,
                    localField: "nominationId",
                    foreignField: "_id",
                    as: "Nomination"
                }
            },
            {
                $lookup: {
                    from: JudgeSchema.collection.name,
                    localField: "judgeId.id",
                    foreignField: "_id",
                    as: "Judges"
                }
            },
        ]);

        res.json(participants);
    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка",
        });
    }
};
export const participants = async (req, res) => {
    try {
        const championship = await ChampionshipSchema.find().limit(1).sort({$natural: -1});
        const participants = await ParticipantSchema.aggregate([
            {
                $match: {championshipId: championship[0]._id, payment: true}
            },
            {
                $lookup: {
                    from: TeamSchema.collection.name,
                    localField: "team_id",
                    foreignField: "_id",
                    as: "team"
                }
            },
            {
                $lookup: {
                    from: NominationSchema.collection.name,
                    localField: "nominations.nominationId",
                    foreignField: "_id",
                    as: "nomination"
                }
            },
        ]);

        res.json(participants);
    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка",
        });
    }
};

export const participantsPoster = async (req, res) => {

    try {
        const benefit = await BenefitSchema.findOne({"name": 'Команда-постер'});
        const championship = await ChampionshipSchema.find().limit(1).sort({$natural: -1});
        const participants_command = await TeamSchema.aggregate([
            {
                $match: {championshipId: championship[0]._id}
            },
            {
                $lookup: {
                    from: ParticipantSchema.collection.name,
                    localField: "_id",
                    foreignField: "team_id",
                    as: "part"
                }
            },
            {
                $lookup: {
                    from: NominationSchema.collection.name,
                    localField: "part.nominations.nominationId",
                    foreignField: "_id",
                    as: "nomination"
                }
            },
            {
                $lookup: {
                    from: BenefitSchema.collection.name,
                    localField: "part.benefitId",
                    foreignField: "_id",
                    as: "benefit"
                }
            },
        ]);

        let filteredTeams = []
        for (const team of participants_command) {
            try {
                if (team.benefit.length > 0 && team.benefit[0].name === 'Команда-постер') {
                    filteredTeams.push(team);
                }
            } catch (e) {
                res.status(500)
            }
        }

        res.json(filteredTeams)
    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка",
        });
    }
};


export const getChampionship = async (req, res) => {
    try {
        const championship = await ChampionshipSchema.find().limit(1).sort({$natural: -1});
        res.json(championship);
    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка"
        })
    }
}


export const getChampionships = async (req, res) => {
    try {
        const championships = await ChampionshipSchema.find();
        res.json({...championships})
    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка"
        })
    }
}

export const getNominations = async (req, res) => {
    try {
        const championship = await ChampionshipSchema.findOne().sort({createdAt: -1});
        const nominations = await NominationSchema.find({championshipId: championship._id});
        res.json(nominations)
    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка"
        })
    }
}

export const getJudges = async (req, res) => {
    try {
        const judges = await JudgeSchema.find();
        res.json(judges)
    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка"
        })
    }
}

export const getJudgesNow = async (req, res) => {
    try {
        const championship = await ChampionshipSchema.findOne().sort({createdAt: -1});
        const judges = await JudgeSchema.find({championshipId: championship._id});
        res.json(judges)
    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка"
        })
    }
}

export const getBenefit = async (req, res) => {
    try {
        const benefit = await BenefitSchema.find();
        const price = await PriceDefaultSchema.find();
        const data = {benefit, price}
        res.json(data)
    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка"
        })
    }
}

// export const gradesId = async (req, res) => {
//     try {
//         const participantId = req.body.participantId;
//         const judgeId = req.body.judgeId;
//         const nominationId = req.body.nominationId;
//         const data = await GradeSchema.find({
//             "participantId": participantId,
//             "judgeId": judgeId,
//             "nominationId": nominationId
//         })
//         return res.json(data)
//
//     } catch (err) {
//         res.status(500).json({
//             error: "Возникла ошибка"
//         })
//     }
// }

export const getPriceDefault = async (req, res) => {
    try {
        const price = await PriceDefaultSchema.find();
        res.json(price)
    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка"
        })
    }
}

export const getTeams = async (req, res) => {
    try {
        const championship = await ChampionshipSchema.findOne().sort({createdAt: -1});
        const teams = await TeamSchema.find({championshipId: championship});
        res.json(teams)
    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка"
        })
    }
}

export const addRequestJudge = async (req, res) => {
    try {

        const judgeRequest = await new JudgeRequestSchema({
            fullName: req.body.fullName,
            photoUrl: req.body.photoUrl,
            phoneNumber: req.body.phoneNumber,
            socialUrl: req.body.socialUrl,
            email: req.body.email,
            li_1: req.body.li_1,
            li_2: req.body.li_2,
            li_3: req.body.li_3,
            li_4: req.body.li_4,
            li_5: req.body.li_5,
        });

        await judgeRequest.save();

        return (res.json(judgeRequest))
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Возникла ошибка"
        });
    }
}

export const addJudgeSchool = async (req, res) => {
    try {

        const judgeSchool = await new JudgeSchoolSchema({
            fullName: req.body.fullName,
            phoneNumber: req.body.phoneNumber,
            socialUrl: req.body.socialUrl,
            email: req.body.email,
            experience: req.body.experience,
            li_1: req.body.li_1,
            li_2: req.body.li_2,
            li_3: req.body.li_3,
            li_4: req.body.li_4,
            li_5: req.body.li_5,
        });

        await judgeSchool.save();

        return (res.json(judgeSchool))
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Возникла ошибка"
        });
    }
}

// export const getUsersGrades = async (req, res) => {
//     try {
//         const championship = await ChampionshipSchema.find().limit(1).sort({$natural: -1});
//         const works = await WorkSchema.aggregate([
//             {
//                 $match: {championshipId: championship[0]._id}
//             },
//             {
//                 $lookup: {
//                     from: ParticipantSchema.collection.name,
//                     localField: "participants.participantId",
//                     foreignField: "_id",
//                     as: "Participant"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: TeamSchema.collection.name,
//                     localField: "Participant.team_id",
//                     foreignField: "_id",
//                     as: "team"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: NominationSchema.collection.name,
//                     localField: "nominationId",
//                     foreignField: "_id",
//                     as: "Nomination"
//                 }
//             },
//         ]);
//
//         res.json(works);
//     } catch (err) {
//         res.status(500).json({
//             message: "Возникла ошибка"
//         });
//     }
// }

