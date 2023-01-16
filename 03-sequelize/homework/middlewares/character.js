const { Router } = require('express');
const { Op, Character, Role, Ability } = require('../db');
const router = Router();

// --------------------------------- CONTROLLERS ---------------------------------
// const createCharacter = async (code, name, age, race, hp, mana, date_added) => {
//     if (!code || !name || !hp || !mana) throw Error("Falta enviar datos obligatorios")
//     if (typeof code != "string" || typeof name != "string" || typeof hp != "number" || typeof mana != "number") throw Error("Error en alguno de los datos provistos")
//     const newCharacter = await Character.create({ code, name, age, race, hp, mana })
//     return newCharacter
// }

// const getCharacters = async () => {
//     const character = await Character.findAll()
//     return character
// }

// const findCharacters = async (race) => {
//     const results = await Character.findAll({ where: { race: race } })
//     if (!results.length) throw Error(`No characters found with race: ${race}`)
//     return results
// }

// const findCharacterByCode = async (code) => {
//     const character = await Character.findByPk(code)
//     if (!character) throw Error(`El código ${code} no corresponde a un personaje existente`)
//     return character
// }

// --------------------------------- ROUTES ---------------------------------
router.post("/", async (req, res) => {
    // VERSIÓN TODO EN UNO
    const { code, name, age, race, hp, mana } = req.body
    if (![code, name, hp, mana].every(Boolean) /* Si todos los parámetros dentro de [] no están bien = true para que entre al if y devuelva el error */) {
        return res.status(404).send("Falta enviar datos obligatorios")
    }
    try {
        const newCharacter = await Character.create({ code, name, age, race, hp, mana })
        res.status(201).json(newCharacter)
    }   catch (error) {
        res.status(404).send("Error en alguno de los datos provistos")
    }

    // VERSIÓN CON CONTROLLERS
    // try {
    //     const { code, name, age, race, hp, mana } = req.body
    //     const newCharacter = await createCharacter(code, name, age, race, hp, mana)
    //     res.status(201).json(newCharacter)
    // }   catch (error) {
    //     res.status(404).json({ error: error.message })
    // }
})

router.get("/", async (req, res) => {
    // VERSIÓN TODO EN UNO
    const { race, age } = req.query
    // const attributes = Object.keys(req.query) // EXTRA => Si el array attributes tiene algo, muestra sólo lo que tiene
    
    // EXTRA
    const statement = {} // Guardo en statement un objeto vacío que va a reemplazar el "where" en el findAll()
    if (req.query.race || req.query.age){ // Si tengo "race" o "age"...
        if (req.query.race) statement["where"] = { race } // Si lo que recibe por query es "race", el statement pasa a ser { where: { race } }
        if (req.query.age) statement["where"] = { ...age } // Si lo que recibe por query es "age", devuelve lo que ya tiene y le agrega "age"
    }
    else if (Object.keys(req.query).length) statement["attributes"] = Object.keys(req.query) // Si el query está vacío, es decir, no recibe nada, el statement de findAll pasa a ser { attributes: { req.query } }

    try {
        // Versión corta sin repetir código
        const results = await Character.findAll(statement) 
        return res.status(200).json(results)

        // Versión larga repitiendo código (sin EXTRA)
        // if (race) {
        //     // Si tengo raza...
        //     const results = await Character.findAll({ where: { race } })
        //     return res.status(200).json(results)
        // }   else {
        //     // Si no tengo raza...
        //     const results = await Character.findAll()
        //     return res.status(200).json(results)
        // }

    }   catch (error) {
        res.status(404).send(error.message)
    }

    // VERSIÓN CON CONTROLLERS
    // const { race } = req.query
    // let characters 
    // try {
    //     if (race) characters = await findCharacters(race)
    //     else characters = await getCharacters()
    //     res.status(200).json(characters)
    // }   catch (error) {
    //     res.status(404).json({ error: error.message })
    // }
})

router.get("/young", async (req, res) => {
    try {
        const results = await Character.findAll({ where: { age: { [Op.lt]: 25 } } }) // [Op.lt] => lt = "less than"
        res.status(200).json(results)
    }   catch (error) {
        res.status(404).send(error.message)
    }
})

router.get("/:code", async (req, res) => {
    // VERSIÓN TODO EN UNO
    const { code } = req.params
    try {
        const character = await Character.findByPk(code)
        if (!character) throw Error(`El código ${code} no corresponde a un personaje existente`)
        return res.status(200).json(character)
    }   catch (error) {
        res.status(404).send(error.message)
    }

    // VERSIÓN CON CONTROLLERS
    // const { code } = req.params
    // try {
    //     const character = await findCharacterByCode(code)
    //     res.status(200).json(character)
    // }   catch (error) {
    //     res.status(404).json({ error: error.message })
    // }
})

router.put("/:attribute", async (req, res) => {
    // Guardo el atributo y el valor
    const { attribute } = req.params 
    const { value } = req.query
    await Character.update( // .update() modifica el modelo, por lo tanto modifica el atributo pedido de todos los elementos de la tabla
        { [attribute]: value }, 
        { where: { [attribute]: null } }
    )
    res.status(200).send("Personajes actualizados")
})

router.put("/addAbilities", async (req, res) => {
    const { codeCharacter, abilities } = req.body
    const characterAbilities = await Character.findByPk(codeCharacter)
    const newAbilities = await Ability.bulkCreate(abilities) // bulkCreate() es un create() en masa, devuelve un array de lo que haya en lo que se le pasa por parámetro
    await characterAbilities.addAbilities(newAbilities)
    res.status(200).send("Habilidades creadas")
})

router.get("/roles/:code", async (req, res) => {
    const { code } = req.params
    try {
        const character = await Character.findByPk(code, { // Le paso el PK y le incluyo la info de los roles
            include: {
                Model: Role
            }
        })
        res.status(200).json(character)
    }   catch (error) {
        res.status(404).send(error.message)
    }
})


module.exports = router;