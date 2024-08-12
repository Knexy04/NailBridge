import ReglamentSchema from "../models/Reglament.js";
import ChampionshipSchema from "../models/Championship.js";

export const getReglament = async (req, res) => {
    try {
        const reglament = await ReglamentSchema.find();
        res.json(reglament);
    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка"
        });
    }
}

export const addReglament = async (req, res) => {
    try {
        const reglament = await new ReglamentSchema({
            name: req.body.name,
            link: req.body.link,
        })

        await reglament.save();

        return (res.json({
            ...reglament
        }))
    } catch (err) {
        res.status(500).json({
            error: "Возникла ошибка"
        })
    }
}

