import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {key} from "../key/key.js";

import UserSchema from "../models/User.js";
import JudgeSchema from "../models/Judge.js";
import ChampionshipSchema from "../models/Championship.js";
import BenefitSchema from "../models/Benefit.js";
import NominationSchema from "../models/Nomination.js";
import PriceDefaultSchema from "../models/PriceDefault.js";
import ParticipantSchema from "../models/Participant.js";
import WorkSchema from "../models/Work.js";
import TeamSchema from "../models/Team.js"
import JudgeSchoolSchema from "../models/JudgeSchool.js";

import mongoose from "mongoose";
import JudgeRequestSchema from "../models/JudgeRequest.js";

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const championship = await ChampionshipSchema.find().limit(1).sort({$natural: -1});

        const user = new UserSchema({
            userName: req.body.userName,
            passwordHash: hash,
            isAdmin: req.body.isAdmin,
        });

        const judge = new JudgeSchema({
            fullName: req.body.fullName,
            photoUrl: req.body.photoUrl,
            phoneNumber: req.body.phoneNumber,
            li_1: req.body.li_1,
            li_2: req.body.li_2,
            li_3: req.body.li_3,
            li_4: req.body.li_4,
            li_5: req.body.li_5,
            _id: user._id,
            championshipId: championship[0]._id,
        });

        await user.save();
        await judge.save();

        const {passwordHash, ...userData} = user._doc;

        const judgeData = judge._doc;

        return (res.json({
            message: "success"
        }))
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Не удалось зарегистрировать пользователя"
        });
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserSchema.findOne({userName: req.body.userName});

        if (!user) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign({
                _id: user._id,
            },
            key,
            {
                expiresIn: '30d'
            }
        );

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token
        })

    } catch (err) {
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        });
    }
}

export const check = async (req, res) => {
    try {
        const user = await UserSchema.findById(req.userId);

        if (!user) {
            return (res.status(404).json({
                message: "Пользователь не найден"
            }))
        }

        const {passwordHash, ...userData} = user._doc;

        return (res.json(userData))

    } catch (err) {
        return (
            res.status(403).json({
                message: "Нет доступа"
            })
        )
    }
}

export const member = async (req, res) => {
    try {
        const id = req.query.id
        const championship = await ChampionshipSchema.find().limit(1).sort({$natural: -1});
        const participants = await ParticipantSchema.aggregate([
            {
                $match: {championshipId: championship[0]._id, _id: mongoose.Types.ObjectId.createFromHexString(id)}
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
            {
                $lookup: {
                    from: BenefitSchema.collection.name,
                    localField: "benefitId",
                    foreignField: "_id",
                    as: "benefit"
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


export const championship = async (req, res) => {
    try {
        const championship = new ChampionshipSchema({
            title: req.body.title,
            results: false,
            startDate: req.body.startDate,
            endRegDate: req.body.endRegDate,
            startOfflineJudgeDate: req.body.startOfflineJudgeDate,
            endOfflineJudgeDate: req.body.endOfflineJudgeDate,
            startOnlineJudgeDate: req.body.startOnlineJudgeDate,
            endOnlineJudgeDate: req.body.endOnlineJudgeDate,
            endDate: req.body.endDate,
            description: req.body.description,
            logoImage: req.body.logoImage,
        })

        await championship.save();

        const championshipData = championship._doc;

        return (res.json({
            championshipData
        }))

    } catch (err) {
        res.status(500).json({
            message: "Возникла ошибка"
        })
    }
}


export const timeServer = async (req, res) => {
    try {
        const currentTime = new Date().toISOString();
        return res.json({
            time: currentTime
        });
    } catch (err) {
        res.status(500).json({
            message: "Возникла ошибка"
        });
    }
}

export const benefit = async (req, res) => {
    try {
        const Benefit = await new BenefitSchema({
            name: req.body.name,
            price: req.body.price,
        })

        await Benefit.save();


        const benefitData = Benefit._doc;

        return (res.json({
            benefitData
        }))


    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка"
        })
    }
}

export const updatePrice = async (req, res) => {
    try {
        const {_id, price} = req.body;

        // Поиск записи по идентификатору
        const benefit = await BenefitSchema.findById(_id);

        if (benefit) {
            // Обновление цены
            benefit.price = price;
            // Сохранение изменений
            await benefit.save();

            return res.json({
                success: true,
                message: "Цена успешно обновлена",
                benefitData: benefit
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Запись с указанным идентификатором не найдена"
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Возникла ошибка"
        });
    }
};

export const addNomination = async (req, res) => {

    try {
        const championship = await ChampionshipSchema.find().limit(1).sort({$natural: -1});

        const nomination = await new NominationSchema({
            name: req.body.name,
            number: req.body.number,
            online: req.body.online,
            championshipId: championship[0]._id,
            criteria: req.body.criteria,
        })

        await nomination.save();

        const nominationData = nomination._doc;

        return (res.json({
            ...nominationData
        }))
    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка"
        })
    }
};

export const addPriceDefault = async (req, res) => {

    try {

        const price = await new PriceDefaultSchema({
            price: req.body.price,
        })

        await price.save();

        return (res.json({
            ...price
        }))
    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка"
        })
    }
}

export const updateJudgeNominations = async (req, res) => {
    try {
        const JudgeId = req.body._id;
        const nominations = req.body.nominations;
        // Поиск записи по идентификатору
        const judge = await JudgeSchema.findById(JudgeId);
        // Поиск записи по идентификатору
        const transformedNominations = nominations.map(nominationId => {
            return {nominationId};
        });

        if (judge) {
            // Обновление цены
            judge.nominations = [...transformedNominations];
            // Сохранение изменений
            await judge.save();

            return res.json(judge);
        } else {
            return res.status(404).json({
                message: "Запись с указанным идентификатором не найдена"
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Возникла ошибка"
        });
    }
};

export const getLastJudges = async (req, res) => {
    try {
        const championship = await ChampionshipSchema.findOne().sort({$natural: -1});

        const judges = await JudgeSchema.find({championshipId: {$ne: championship._id}});

        const judgeData = judges.map(judge => {
            return {
                _id: judge._id,
                fullName: judge.fullName,
                phoneNumber: judge.phoneNumber,
                photoUrl: judge.photoUrl,
                championshipId: championship._id
            };
        });

        res.json(judgeData);
    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка"
        });
    }
}

export const deleteJudge = async (req, res) => {
    try {
        const judgeId = req.body._id;
        await JudgeSchema.findByIdAndDelete(judgeId)
        await UserSchema.findByIdAndDelete(judgeId)
        res.json({success: true});
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Возникла ошибка"
        });
    }
}

export const judgeChamp = async (req, res) => {

    try {
        const championship = await ChampionshipSchema.find().limit(1).sort({$natural: -1});
        const JudgeId = req.body._id;

        const judge = await JudgeSchema.findById(JudgeId)

        if (judge) {
            // Обновление цены
            judge.championshipId = championship[0]._id;
            judge.nominations = [];
            // Сохранение изменений
            await judge.save();

            return res.json(judge);
        } else {
            return res.status(404).json({
                message: "Запись с указанным идентификатором не найдена"
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Возникла ошибка"
        });
    }
};

export const getWorksJudge = async (req, res) => {
    try {
        const championship = await ChampionshipSchema.find().limit(1).sort({$natural: -1});
        const judgeId = req.query.judgeId;
        const works = await WorkSchema.aggregate([
            {
                $match: {
                    "judgeId.id": mongoose.Types.ObjectId.createFromHexString(judgeId),
                    "championshipId": championship[0]._id,
                }
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
        ]);
        res.json(works);
    } catch (error) {
        res.status(500).json({error: 'Ошибка при получении номинаций судьи'});
    }
}

export const getWorksParticipant = async (req, res) => {
    try {
        const championship = await ChampionshipSchema.find().limit(1).sort({$natural: -1});
        const id = req.query.id;
        const works = await WorkSchema.aggregate([
            {
                $match: {
                    "participants.participantId": mongoose.Types.ObjectId.createFromHexString(id),
                    "championshipId": championship[0]._id,
                }
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
        ]);
        res.json(works);
    } catch (error) {
        res.status(500).json({error: 'Ошибка при получении номинаций судьи'});
    }
}

export const addWorkJudge = async (req, res) => {
    try {
        const workId = req.body.workId;
        const judgeId = req.body.judgeId;

        // Найти объект работы по ID
        const work = await WorkSchema.findById(workId);

        if (!work) {
            return res.status(404).json({success: false, error: "Работа не найдена"});
        }

        // Добавить новые судьи в массив judgeId
        work.judgeId.push({id: judgeId,});

        // Сохранить обновленную работу
        const updatedWork = await work.save();

        res.json({success: true, updatedWork});
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Возникла ошибка",
        });
    }
};
export const deleteNomination = async (req, res) => {
    try {
        const nominationId = req.body._id;
        await NominationSchema.findByIdAndDelete(nominationId)
        res.json({success: true});
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Возникла ошибка"
        });
    }
}


export const getCriteria = async (req, res) => {
    try {
        const championship = await ChampionshipSchema.find().limit(1).sort({$natural: -1});
        const nominationIds = req.body.judgeNominations;
        const criteria = await Promise.all(
            nominationIds.map(async (item) => {
                const criteriaId = item.nominationId;
                const criteriaData = await NominationSchema.findById(criteriaId);
                return criteriaData;
            })
        );
        res.json(criteria);
    } catch (error) {
        res.status(500).json({error: 'Ошибка при получении номинаций судьи'});
    }
};


export const participantJudge = async (req, res) => {
    try {
        const nominationIds = req.body.nominations;
        const criteria = await Promise.all(
            nominationIds.map(async (item) => {
                const criteriaId = item._id;
                const participants = await ParticipantSchema.find({"nominations.nominationId": {$in: [criteriaId]}});
                if (participants) {
                    const Partnomination = await NominationSchema.findById(criteriaId);
                    return {participants, Partnomination};
                }
            })
        );
        res.json(criteria);
    } catch (error) {
        res.status(500).json({error: 'Ошибка при получении номинаций судьи'});
    }
};

export const addGrade = async (req, res) => {
    try {
        const work = req.body.work;
        const judgeId = req.body.judgeId;
        const values = req.body.values;
        const grades = Object.entries(values).map(([title, grade]) => ({
            title,
            grade
        }));
        const comment = req.body.comment;

        const updatedWork = await WorkSchema.findOneAndUpdate(
            {'_id': work._id, "judgeId.id": judgeId}, // Условие для поиска работы по айди судьи
            {
                $push: {
                    'judgeId.$.grades': {$each: grades}
                },
                $set: {
                    'judgeId.$.comment': comment
                }
            },
        );

        if (!updatedWork) {
            return res.status(404).json({error: 'Work not found'});
        }

        return res.json(updatedWork);
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
};


export const getWorks = async (req, res) => {
    try {
        const championship = await ChampionshipSchema.findOne().sort({$natural: -1});
        const championshipId = championship._id;

        const works = await WorkSchema.find({"championshipId": championshipId})
            .populate({
                path: "participants.participantId",
                model: "Participant",
                select: "category",
            }).populate({
                path: "nominationId",
                model: "Nomination",
                select: "number",
            })

        res.status(200).json(works);
    } catch (err) {
        res.status(500).json(err);
    }
}

export const updateJudgeWorks = async (req, res) => {
    try {
        const JudgeId = req.body._id;
        const works = req.body.works;

        const updatedWorks = await WorkSchema.updateMany(
            {_id: {$in: works}, "judgeId.id": {$ne: JudgeId}}, // Only update if JudgeId is not present
            {$addToSet: {judgeId: {id: JudgeId}}}
        );
        res.json(updatedWorks);
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Возникла ошибка"
        });
    }
};

export const removeJudgeFromWork = async (req, res) => {
    try {
        const {workId, judgeId} = req.body;

        const updatedWork = await WorkSchema.findByIdAndUpdate(
            workId,
            {$pull: {judgeId: {id: judgeId}}},
            {new: true}
        );

        res.json(updatedWork);
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "An error occurred",
        });
    }
};

export const getTeamInfo = async (req, res) => {
    try {
        const championship = await ChampionshipSchema.find().limit(1).sort({$natural: -1});
        const id = req.query.id;
        const works = await WorkSchema.aggregate([
            {
                $match: {
                    "championshipId": championship[0]._id,
                }
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
                $match: {
                    "team._id": mongoose.Types.ObjectId.createFromHexString(id)
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
        ]);
        res.json(works)
    } catch (error) {
        res.status(500).json({error: 'Ошибка при получении номинаций судьи'});
    }
}

export const getTrainerInfo = async (req, res) => {
    try {
        const championship = await ChampionshipSchema.find().limit(1).sort({$natural: -1});
        const id = req.query.id;
        const works = await WorkSchema.aggregate([
            {
                $match: {
                    "championshipId": championship[0]._id,
                }
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
                $match: {
                    "team.teamTrainer._id": mongoose.Types.ObjectId.createFromHexString(id)
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
        ]);
        res.json(works)
    } catch (error) {
        res.status(500).json({error: 'Ошибка при получении номинаций судьи'});
    }
}

export const judgeSchool = async (req, res) => {

    try {
        const judges = await JudgeSchoolSchema.find()
        return res.json(judges)
    } catch (err) {
        res.status(500).json({error: 'Ошибка'});
    }
}

export const judgeReq = async (req, res) => {

    try {
        const judges = await JudgeRequestSchema.find()
        return res.json(judges)
    } catch (err) {
        res.status(500).json({error: 'Ошибка'});
    }
}

export const sendResults = async (req, res) => {
    try {
        const championship = await ChampionshipSchema.findOneAndUpdate(
            {},
            { results: true },
            { new: true, sort: { createdAt: -1 } }
        );

        if (!championship) {
            return res.status(404).json({ message: 'Чемпионат не найден' });
        }

        return res.json(championship);
    } catch (error) {
        return res.status(500).json({ message: 'Произошла ошибка сервера' });
    }
}