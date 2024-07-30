import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true
  },
  redirectURL: {
    type: String,
    required: true
  },
  visitHistory: [{
    timestamp: {
      type: Number,
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  qrCodeURL: {
    type: String,
  },
  resetCode: {
    type: String,
  }
}, { timestamps: true });

const URL = mongoose.model("URL", urlSchema);

export { URL };
