const { Pet } = require('../models/PetModel');

const getListOfPetInfo = (fromDoc) => {
  return {
    _id: fromDoc._id,
    animal: fromDoc.animal,
    nickname: fromDoc.nickname,
    intelligence: fromDoc.intelligence,
    loyalty: fromDoc.loyalty,
    createdAt: fromDoc.createdAt,
    updatedAt: fromDoc.updatedAt,
  }
}

exports.AddPet = (req, res, next) => {
  const pet = new Pet(req.body);
  Pet.findOne({ animal: req.body.animal }, (err, existedPet) => {
    if (!existedPet) {
      pet.save((err, thisPet) => {
        if (err) {
          res.status(422).json({ error: err });
        } else {
          res.status(200).json({
            success: true,
            message: 'Add pet successfully.',
            pet: getListOfPetInfo(thisPet),
          });
        }
        next();
      });
    } else {
      return res.status(409).json({
        success: false,
        message: 'Pet is already added before, you can edit the info.',
      });
    }
  });
};

// { edit: [{_id: String, amount: Number}, {}], remove: [id, id] }
exports.ManagePet = (req, res, next) => {};

exports.GetAllPet = (req, res, next) => {
  Pet.find().exec((err, pets) => {
    if (err) return res.json({ err });
    return res.status(400).json({
      success: true,
      pets,
    });
  });
};
