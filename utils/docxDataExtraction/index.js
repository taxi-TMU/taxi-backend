require("dotenv").config();
require("../../db/client");
const fs = require("fs");
const path = require("path");
const docxParser = require("docx-parser");
const { v4: uuidv4 } = require("uuid");
const Question = require("../../models/questionModel");

const hastaLaVista = () => process.kill(process.pid, "SIGTERM");

const { sub } = require("minimist")(process.argv.slice(2));

if (!sub) {
  console.log("You must provide a subcategory id using the -sub argument");
  // hint: npm run extract --sub=60632780fb8a6a0004ee860e
  return hastaLaVista();
}

const sourcePath = path.join(__dirname, "source");

fs.readdir(sourcePath, (err, files) => {
  if (err || !files.length)
    return console.log("Unable to scan directory or directory empty");
  const sourceFile = files[1];
  const fileName = path.basename(sourceFile, path.extname(sourceFile))

  try {
    docxParser.parseDocx(path.join(sourcePath, sourceFile), (extractedData) => {
      const questionsAndAnswers = [];
      const lines = extractedData.split("\n");
      lines.forEach((line, index) => {
        if (line.trim().endsWith("?")) {
          const question = lines[index];
          const answers = [];
          let cursor = index;
          let keepParsing = true;

          do {
            const currentLine = lines[cursor + 1];
            // correct answer : minus
            if (/\d/.test(currentLine[0]) || currentLine[0] === "-") {
              let formattedLine = currentLine.replace(/- /g, "");
              formattedLine = formattedLine.replace(/-/g, "");
              formattedLine = formattedLine.replace(/\d/g, "");
              answers.push({
                _id: uuidv4(),
                text: formattedLine,
                checked: true,
              });
            } else if (/\d/.test(currentLine[0]) || currentLine[0] === "x") {
              let formattedLine = currentLine.replace(/x /g, "");
              formattedLine = formattedLine.replace(/x/g, "");
              formattedLine = formattedLine.replace(/\d/g, "");
              answers.push({
                _id: uuidv4(),
                text: formattedLine,
                checked: false,
              });
            } else {
              keepParsing = false;
            }
            cursor += 1;
          } while (keepParsing);

          questionsAndAnswers.push({
            question,
            answers,
          });
        }
      });

      const qas = questionsAndAnswers.map(async (qa) => {
        const newQuestion = new Question({
          language: "DE",
          question_text: qa.question,
          answers: qa.answers,
          sub_category: sub,
        });

        try {
          return await newQuestion.save();
        } catch (e) {
          console.log(`Error while inserting a QA: ${e.message}`);
        }
      });

      Promise.all(qas)
        .then((all) => {
          console.log(all);

          fs.writeFile(
            path.join(__dirname + `/output/${fileName}.json`),
            JSON.stringify(questionsAndAnswers, null, 2),
            (error) => {
              if (error) throw new Error(error);
              console.log(
                `Data extracted successfully from the word Document 🎉 Check the ${fileName}.json file 😄`
              );
            }
          );

          hastaLaVista();
        })
        .catch((e) => {
          console.log(e.message);
          hastaLaVista();
        });
    });
  } catch (e) {
    console.log({
      message: e.message,
      stack: e.stack,
    });
    hastaLaVista();
  }
});
