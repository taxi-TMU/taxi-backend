require('dotenv').config();
const fs = require('fs');
const docxParser = require('docx-parser');
const { v4: uuidv4 } = require('uuid');
const Question = require('../../models/questionModel');

try {
  docxParser.parseDocx('Personenbeforderungsgesetz_PBefG.docx', (extractedData) => {
    const questionsAndAnswers = [];
    const lines = extractedData.split('\n');
    lines.forEach((line, index) => {
      if (line.trim().endsWith('?')) {
        const question = lines[index];
        const answers = [];
        let cursor = index;
        let keepParsing = true;

        do {
          const currentLine = lines[cursor + 1];
          if (/\d/.test(currentLine[0]) || currentLine[0] === '-') {
            let formattedLine = currentLine.replace(/- /g, '');
            formattedLine = formattedLine.replace(/-/g, '');
            formattedLine = formattedLine.replace(/\d/g, '');
            answers.push({
              _id: uuidv4(),
              text: formattedLine,
              checked: true,
            });
          } else {
            keepParsing = false;
          }
          cursor += 1;
        } while (keepParsing);

        const newQuestion = new Question({
          language: 'DE', question_text: question, answers,
        });

        const insertQuestion = async () => {
          try {
            const questionCreated = await Question.create({
              language: 'DE', question_text: question, answers, sub_category: '60632780fb8a6a0004ee860e',
            });

            console.log(questionCreated);
          } catch (e) {
            console.log(`jooooo: ${e.message}`);
          }
        };

        insertQuestion();

        questionsAndAnswers.push({
          question,
          answers,
        });
      }
    });
    // write into file
    fs.writeFile('data/result1.json', JSON.stringify(questionsAndAnswers, null, 2), (error) => {
      if (error) throw new Error(error);
      console.log('Data extracted successfully from the word Document 🎉 Check the result.json file 😄');
    });
  });
} catch (e) {
  console.log({
    message: e.message,
    stack: e.stack,
  });
}
