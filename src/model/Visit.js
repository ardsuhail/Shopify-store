// // model/Visit.js

// import mongoose from "mongoose";

// const VisitSchema = new mongoose.Schema({
//   sessionId: { type: String, index: true },
//   url: String,
//   title: String,
//   referrer: String,
//   ip: String,
//   ua: String,
//   utm: Object,
//   fbclid: String,
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.models.Visit || mongoose.model("Visit", VisitSchema);

import mongoose from "mongoose";

const VisitSchema = new mongoose.Schema({
  sessionId: { type: String, index: true },
  url: String,
  title: String,
  referrer: String,
  ip: String,
  ua: String,
  country: String,
  city: String,
  region: String,
  utm: Object,
  fbclid: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Visit || mongoose.model("Visit", VisitSchema);