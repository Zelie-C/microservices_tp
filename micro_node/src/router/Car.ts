import { Router } from "express";
import { Car } from "..";

export const carRouter = Router()

carRouter.get('/', async(req, res) => {
    const cars = await Car.findAll()
    res.json(cars)
})

carRouter.get('/:id', async(req, res) => {
    const car = await Car.findOne({ where: {id: req.params.id} })
    if (car) {
        res.json(car)
    } else {
        res.status(404).send('Car not found')
    }
})

carRouter.post('/', async(req, res) => {
    const { marque, modele, year, color } = req.body
    if(!marque || !modele || !year || !color) {
        res.status(400).send('Missing informations')
    } else {
        const newCar = await Car.create({ marque, modele, year, color })
        res.json(newCar)
    }
})

carRouter.put('/:id', async(req, res) => {
    const { marque, modele, year, color } = req.body
    const actualCar = await Car.findOne({ where: {id: req.params.id} })
    if(actualCar) {
        const UpdatedCar = await actualCar.update({ marque, modele, year, color })
        res.json(actualCar)
    } else {
        res.status(404).send('Car not found')
    }
})

carRouter.delete('/:id', async(req, res) => {
    const carToDelete = await Car.findOne({ where: {id: req.params.id} })
    if(carToDelete) {
        await carToDelete.destroy()
        res.send(carToDelete)
    } else {
        res.status(404).send('Car not found')
    }
})