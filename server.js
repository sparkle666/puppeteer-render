import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { runBot } from "./runBot.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware for parsing form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for the UI)
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 4000;

// Serve the homepage with a simple form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/csv", (req, res) => {
  res.sendFile(path.join(__dirname, "ivory_output.csv"));
});

app.get("/download", (req, res) => {
    const companyLocation = "ivory"

    const outputFilePath = path.join(__dirname, `${companyLocation}_output.csv`);

    console.log(outputFilePath)
  
    res.download(outputFilePath, (err) => {
      if (err) {
        console.error("Error downloading the file:", err);
        res.status(500).send("Error generating or downloading the file.");
      }
    });  

});

// Handle scraping logic
app.post("/scrape", async (req, res) => {
  const { companyNames, companyLocation } = req.body;

  if (!companyNames || !companyLocation) {
    return res.status(400).send("Company names and location are required.");
  }

  const companies = companyNames.split(",").map(name => name.trim());
  const outputFilePath = path.join(__dirname, `${companyLocation}_output.csv`);

  console.log("Company list: ", companies);
  
  try {
    // await runBot(companies, false, companyLocation); // Run the scraping logic

    console.log("Inside try block");

    res.sendFile(path.join(__dirname, "ivory_output.csv"));


    // return res.status(200).send("Done with scraping file.")


  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).send("An error occurred while scraping.");
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
