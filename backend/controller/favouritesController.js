import express from "express";
import favouritesModel from "../models/favouritesModel.js";

const favourites = async (req, res) => {
  const { userId } = req.params;
  favouritesModel
    .find({ userId })
    .then((favourites) => {
      res.json(favourites);
    })
    .catch((error) => {
      console.error("Error fetching favourites:", error);
      return res.status(500).json({ error: error.message });
    });
};

const addFavourite = async (req, res) => {
  const { userId, name } = req.body;
  const newFavourite = new favouritesModel({ userId, name });
  newFavourite
    .save()
    .then((favourite) => {
      res.json(favourite);
    })
    .catch((error) => {
      console.error("Error adding favourite:", error);
      return res.status(500).json({ error: error.message });
    });
};

const deleteFavourite = async (req, res) => {
  const id = req.params.id;
  favouritesModel
    .findByIdAndDelete({ _id: id })
    .then((favourites) => {
      res.json(favourites);
    })
    .catch((error) => {
      console.error("Error deleting favourite:", error);
      return res.status(500).json({ error: error.message });
    });
};

export { favourites, addFavourite, deleteFavourite };
