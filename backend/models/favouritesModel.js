import mongoose from "mongoose"

const favouriteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
  },
  { collection: "favourites" }
);

const favouritesModel = mongoose.model("Favourite", favouriteSchema);
export default favouritesModel;
