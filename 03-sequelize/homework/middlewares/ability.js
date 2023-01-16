const { Router } = require('express');
const { Ability } = require('../db');
const router = Router();

router.post("/", async (req, res) => {
    const { name, description, mana_cost } = req.body
    try {
        if (!name || !mana_cost) throw Error("Falta enviar datos obligatorios")
        const newAbility = await Ability.create({ name, description, mana_cost })
        return res.status(201).json(newAbility)        
    }   catch (error) {
        res.status(404).send(error.message)
    }
})

router.put("/setCharacter", async (req, res) => {
    const { idAbility, codeCharacter } = req.body
    const ability = await Ability.findByPk(idAbility) // Busco la habilidad por su PK
    await ability.setCharacter(codeCharacter) // Le asigno al PK de la habilidad, el PK del character al que se la quiero asignar
    // set({PK}) agrega UN solo PK || add({PK}) agrega VARIOS PKs
    res.status(200).json(ability)
})


module.exports = router;