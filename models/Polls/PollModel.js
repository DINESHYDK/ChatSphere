const { default: mongoose } = require("mongoose");

const pollSchema = new mongoose.Schema({
    userId: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        type: String,
        required: true,
      },
    pollHeading: {
        type: String,
        required: true,
    },


    

    });
