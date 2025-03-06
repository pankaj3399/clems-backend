import express from "express";
import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";
import cors from "cors";
import { MongoClient } from "mongodb";
import { sendEmail } from "./mail.js";
import { contactFormMailgenContent } from "./mail.js";

const categories = {
  "Healthcare Services": [
    "Care Services",
    "Care",
    "Carer",
    "Carers",
    "Healthcare",
    "Podiatry",
    "Paediatrics",
    "Nanny",
    "Child Minder",
    "Homecare",
  ],
  "Medical Services": [
    "Hospital",
    "Health Foundation Trust",
    "Nursing",
    "Dentistry",
    "Dentist",
    "Optometrist",
    "Optometry",
    "Therapy",
    "Physiotherapy",
    "Psychiatry",
    "Medical Practice",
    "Medical Clinic",
    "Medics",
  ],
  "Construction Services": [
    "Masonry",
    "Dryliners",
    "Drylining",
    "Roofers",
    "Integral Design",
    "Mason",
    "Construction",
    "Builders",
    "Building",
    "Architectural",
    "Architecture",
    "Contractors",
  ],
  "Educational Institutions": [
    "Schools",
    "Colleges",
    "Universities",
    "Tutors",
    "Teaching",
    "Education",
    "Training Centers",
    "Academies",
  ],
  "Charity and Non-Profit Services": [
    "Charity",
    "Non-Profit Organizations",
    "Voluntary Services",
    "Social Services",
    "Community Service",
  ],
  "Religious Services": [
    "Churches",
    "Temple",
    "Mosque",
    "Synagogues",
    "Religious Organizations",
    "Faith-Based Services",
    "Chapel",
    "Faith Centre",
  ],
  "IT and Technology Services": [
    "Software Development",
    "IT Support",
    "Cybersecurity",
    "Data Analysis",
    "Tech Services",
    "Information Technology",
    "Networking Services",
    "Software",
    "Technology",
  ],
  "Finance and Accounting Services": [
    "Accounting",
    "Bookkeeping",
    "Financial Services",
    "Auditing",
    "Taxation",
    "Payroll Services",
    "Investment Services",
    "Accountancy",
  ],
  "Legal Services": [
    "Solicitors",
    "Barristers",
    "Law Firms",
    "Legal Consultancy",
    "Legal Advice",
    "Paralegal Services",
    "Chambers",
    "Legal",
    "Law",
  ],
  "Retail Services": [
    "Retail",
    "Shops",
    "Supermarkets",
    "Stores",
    "E-commerce",
    "Boutique",
  ],
  "Hospitality Services": [
    "Hotel",
    "Restaurant",
    "Cafe",
    "Catering",
    "Hospitality Management",
    "Bed and Breakfast",
    "Hospitality",
  ],
  "Manufacturing Services": [
    "Manufacturing",
    "Production",
    "Assembly",
    "Fabrication",
    "Industrial Services",
    "Industry",
  ],
  "Transportation and Logistics Services": [
    "Transportation",
    "Logistics",
    "Delivery Services",
    "Freight",
    "Shipping",
    "Courier Services",
    "Freight",
    "Delivery",
    "Courier",
    "Removal",
  ],
  "Cleaning Services": [
    "Cleaning",
    "Janitorial",
    "Housekeeping",
    "Sanitation",
    "Commercial Cleaning",
    "Cleaner",
  ],
  "Real Estate Services": [
    "Real Estate",
    "Property Management",
    "Lettings",
    "Estate Agents",
    "Property Development",
    "Lets",
    "Estate",
  ],
  "Marketing and Advertising Services": [
    "Marketing",
    "Advertising",
    "Digital Marketing",
    "Public Relation",
    "Branding",
    "Market Research",
  ],
  "Human Resources Services": [
    "Recruitment",
    "Staffing",
    "HR Services",
    "Talent Acquisition",
    "Employment Agencies",
  ],
  "Consulting Services": [
    "Business Consulting",
    "Management Consulting",
    "Strategy Consulting",
    "Advisory Services",
    "Professional Services",
    "Consulting Services",
    "consultancy",
  ],
  "Agricultural Services": [
    "Farming",
    "Agriculture",
    "Horticulture",
    "Forestry",
    "Agribusiness",
    "Fish",
    "Meat",
    "Vessel",
  ],
  "Entertainment and Media Services": [
    "Entertainment",
    "Media",
    "Film Production",
    "Television",
    "Radio Broadcasting",
    "Music Production",
  ],
  "Sports and Recreation Services": [
    "Sports Club",
    "Fitness Centre",
    "Gyms",
    "Recreation",
    "Sports Coaching",
    "Sports",
  ],
  "Energy and Utilities Services": [
    "Energy",
    "Utilities",
    "Power Generation",
    "Renewable Energy",
    "Gas and Electric",
  ],
  "Telecommunication Services": [
    "Telecommunication",
    "Telecom",
    "Internet Providers",
    "Mobile Network",
    "Broadband Services",
    "Internet",
    "Network",
  ],
  "Engineering Services": [
    "Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Structural Engineering",
    "Civil",
    "Electrical",
    "Electrics",
    "Electronics",
  ],
  "Environmental Services": [
    "Environmental Consultancy",
    "Waste Management",
    "Recycling",
    "Environmental Conservation",
    "Sustainability Services",
  ],
  "Arts and Culture Services": [
    "Museums",
    "Galleries",
    "Cultural Institutions",
    "Art Studios",
    "Performing Arts",
  ],
  "Food and Beverage Services": [
    "Food Services",
    "Beverage",
    "Food Production",
    "Breweries",
    "Restaurant",
    "Joint",
    "Khebab",
    "Foods",
    "Bar",
  ],
  "Security Services": [
    "Security",
    "Surveillance",
    "Private Security",
    "Alarm Services",
    "Security Consulting",
  ],
  "Automotive Services": [
    "Car Dealerships",
    "Auto Repair",
    "Vehicle Maintenance",
    "Automotive Parts",
    "Mechanics",
    "Body work",
    "MOT",
    "Auto Services",
  ],
  "Travel and Tourism Services": [
    "Travel Agencies",
    "Tour Operators",
    "Tourism Services",
    "Airline",
    "Travel Consultancy",
    "Tour",
  ],
  "Pharmaceutical Services": [
    "Pharmaceutical",
    "Drug Manufacturing",
    "Pharmacy Services",
    "Biotech",
    "Clinical Trials",
  ],
  "Social Services": [
    "Social Work",
    "Community Services",
    "Non-Profit Organizations",
    "Charities",
    "Welfare Services",
  ],
  "Childcare Services": [
    "Nurseries",
    "Daycare",
    "Childminders",
    "After School Clubs",
    "Early Years Education",
    "Nanny",
    "Childminding",
    "Nursery",
  ],
  "Animal Care Services": [
    "Veterinary Services",
    "Animal Shelters",
    "Pet Grooming",
    "Animal Training",
    "Pet Boarding",
    "Groomers",
  ],
  "Event Management Services": [
    "Event Planning",
    "Conference Services",
    "Wedding Planning",
    "Event Planner",
    "Corporate Events",
    "Event",
  ],
  "Publishing Services": [
    "Book Publishing",
    "Magazine Publishing",
    "Digital Publishing",
    "Editorial Services",
    "Print Media",
  ],
  "Interior Design Services": [
    "Interior Design",
    "Home Staging",
    "Decorating Services",
    "Decorators",
    "Space Planning",
    "Residential Design",
  ],
  "Graphic Design Services": [
    "Graphic Design",
    "Branding",
    "Visual Communication",
    "Print Design",
    "Digital Design",
  ],
  "Research and Development Services": [
    "R&D",
    "Innovation Services",
    "Scientific Research",
    "Product Development",
    "Research Institutions",
  ],
  "Maintenance Services": [
    "Maintenance",
    "Facility",
    "Property Maintenance",
    "Handyman Service",
    "Building Maintenance",
  ],
  "Other Services": [],
};

dotenv.config();

const MONGODB_DB = process.env.MONGODB_DB;
const COLLECTION_NAME = "files-storage";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(cors());

let cachedClient = null;

async function getMongoClient() {
  if (cachedClient) {
    return cachedClient;
  }

  if (!process.env.MONGO_CONNECTION) {
    throw new Error("MONGO_CONNECTION is not defined");
  }

  const client = new MongoClient(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  cachedClient = client;
  return cachedClient;
}

const fileLogSchema = new Schema({
  id: Schema.ObjectId,
  name: {
    type: String,
    unique: true,
  },
  date: Date,
  url: String,
});

const FileLog = mongoose.model("filelogs", fileLogSchema);

// creating a mongo schema for today's csv data
const additionSchema = new Schema({
  id: Schema.ObjectId,
  name: String,
  townCity: String,
  county: String,
  type: String,
  route: String,
  date: String,
});

const fileScehma = new Schema({
  id: Schema.ObjectId,
  name: {
    type: String,
    unique: true,
  },
  data: String,
  date: Date,
});

const File = mongoose.model("files", fileScehma);

// assigning a model to mongodb user userSchema
const Addition = mongoose.model("addition", additionSchema);

// creating a mongo schema for today's csv data
const updateSchema = new Schema({
  id: Schema.ObjectId,
  name: String,
  townCity: String,
  county: String,
  type: String,
  route: String,
  date: String,
});

// assigning a model to mongodb user userSchema
const Updates = mongoose.model("updates", updateSchema);

// creating a mongo schema for today's csv data
const removalSchema = new Schema({
  id: Schema.ObjectId,
  name: String,
  townCity: String,
  county: String,
  type: String,
  route: String,
  date: String,
});

// assigning a model to mongodb user userSchema
const Removal = mongoose.model("removals", removalSchema);

const follwedEmailsSchema = new Schema({
  id: Schema.ObjectId,
  email: String,
  companyName: String,
  date: Date,
});

const FollowedEmails = mongoose.model("followedEmails", follwedEmailsSchema);

app.get("/", async (req, res) => {
  res.json({ message: "Up & Running!" });
});

/**
 * API endpoint to return current
 * additions, removals, updates
 * and the date/key for the last day's data
 */
app.get("/today", async (req, res) => {
  try {
    const fileName = await FileLog.find().sort({ date: -1 }).limit(1).exec();
    console.log(fileName[0]);
    if (fileName[0]) {
      console.log(fileName[0].name);
      const thisDaysDate = fileName[0].name;
      console.log(thisDaysDate);
      const additions = await Addition.find({ date: thisDaysDate }).exec();
      const removals = await Removal.find({ date: thisDaysDate }).exec();
      const updates = await Updates.find({ date: thisDaysDate }).exec();

      console.log({
        additions: additions.length,
        removals: removals.length,
        updates: updates.length,
      });
      return res.json({
        additions,
        removals,
        updates,
        updateDate: fileName[0].name,
      });
    }
  } catch (e) {
    console.log(e);
    return res.json({
      error: e,
    });
  }
});

app.get("/page/:pageNum", async (req, res) => {
  const { pageNum } = req.params;
  console.log(pageNum);

  try {
    const fileLogs = await FileLog.find()
      .select("name")
      .sort({ date: -1 })
      .skip(pageNum)
      .limit(1)
      .exec();
    console.log(fileLogs);

    if (fileLogs.length > 0) {
      const currDate = fileLogs[0].name;
      console.log(currDate);
      const additions = await Addition.find({ date: currDate }).exec();
      const removals = await Removal.find({ date: currDate }).exec();
      const updates = await Updates.find({ date: currDate }).exec();

      console.log({
        additions: additions.length,
        removals: removals.length,
        updates: updates.length,
      });
      return res.json({
        additions,
        removals,
        updates,
        updateDate: currDate,
      });
    } else {
      return res.status(404).json({
        additions: [],
        removals: [],
        updates: [],
      });
    }
  } catch (e) {
    console.log(e);
    return res.json({
      error: e,
    });
  }
});

app.get("/unique-town-city", async (req, res) => {
  try {
    const client = await getMongoClient();
    const db = client.db(MONGODB_DB);
    const collection = db.collection(COLLECTION_NAME);

    const distinctTownCity = await collection.distinct("Town/City");

    // loop through the distinct town/city and remove trailing spaces, capitalize first letter of each word
    distinctTownCity.forEach((townCity, index) => {
      distinctTownCity[index] = townCity
        .trim()
        .replace(/\b\w/g, (l) => l.toUpperCase());

      // convert to lowercase
      distinctTownCity[index] = distinctTownCity[index].toLowerCase();

      // capitalize first letter of each word
      distinctTownCity[index] = distinctTownCity[index].replace(/\b\w/g, (l) =>
        l.toUpperCase(),
      );

      // remove "," at beginning or end of string
      distinctTownCity[index] = distinctTownCity[index].replace(
        /(^,)|(,$)/g,
        "",
      );
    });

    // use set to remove duplicates
    const uniqueTownCity = [...new Set(distinctTownCity)];

    uniqueTownCity.sort();

    return res.json({ uniqueTownCity });
  } catch (e) {
    console.log(e);
    return res.json({
      error: e,
    });
  }
});

app.get("/sponsors", async (req, res) => {
  const { search, city, category, limit = 20 } = req.query;
  try {
    const client = await getMongoClient();
    const db = client.db(MONGODB_DB);
    const collection = db.collection(COLLECTION_NAME);
    const fileName = await FileLog.find().sort({ date: -1 }).limit(1).exec();
    const updateDate = fileName[0].name;

    let query = {
      date: updateDate, // Assuming the field name is 'date' and is a string in 'YYYY-MM-DD' format
    };
    if (search) {
      query["Organisation Name"] = { $regex: search, $options: "i" };
    }
    if (city) {
      query["Town/City"] = { $regex: city, $options: "i" };
    }
    if (category) {
      const categoriesArray = categories[category];
      query["Organisation Name"] = {
        $in: [new RegExp(categoriesArray.join("|"), "i")],
      };
    }
    const countTotal = await collection.countDocuments({ date: updateDate });
    let count = 0;
    if (search || city || category) {
      count = await collection.countDocuments(query);
    } else {
      count = limit;
    }
    let sponsors = [];
    if (search || city || category) {
      sponsors = await collection.find(query).toArray();
    } else {
      sponsors = await collection.find(query).limit(parseInt(count)).toArray();
    }

    return res.json({ count, countTotal, sponsors });
  } catch (e) {
    console.log(e);
    return res.json({
      error: e,
    });
  }
});

app.post("/contact-form", async (req, res) => {
  try {
    const { name, email, contactInfo, shortInfo } = req.body;
    if (!name || !email || !contactInfo || !shortInfo) {
      return res.status(400).json({ message: "All fields required" });
    }
    await sendEmail({
      email: email,
      subject: "Submitted Contact Form",
      mailgenContent: contactFormMailgenContent({
        name,
        email,
        contactInfo,
        shortInfo,
      }),
    });
    return res.json({ message: "Email Sent!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/follow-company", async (req, res) => {
  try {
    const { email, companyName } = req.body;
    if (!email || !companyName) {
      return res.status(400).json({ message: "All fields required" });
    }
    const followedEmail = new FollowedEmails({
      email,
      companyName,
      date: new Date(),
    });
    await followedEmail.save();
    return res.json({ message: "Email Subscribed!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

await mongoose.connect(process.env.MONGO_CONNECTION);
console.log("Connection Success:", mongoose.connection.name);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Up & Running on PORT:3000`);
});

export default app;
