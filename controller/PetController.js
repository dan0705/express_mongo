const { Pet } = require('../models/PetModel');

exports.AddPet = (req, res, next) => {
  const pet = new Pet(req.body);
  Pet.findOne({ animal: req.body.animal }, (err, existedPet) => {
    if (!existedPet) {
      pet.save((err, doc) => {
        if (err) {
          res.status(422).json({ error: err });
        } else {
          const { owner, ...petData } = doc;
          res.status(200).json({
            success: true,
            message: 'Add pet successfully.',
            pet: petData,
          });
        }
        next();
      });
    } else {
      return res.status(409).json({
        success: false,
        message: 'Pet is already added before, you can change the info.',
      });
    }
  });
};
