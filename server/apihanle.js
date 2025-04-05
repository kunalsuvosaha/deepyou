// this does nothing, remove if you want

// async function getPersonalityAnalysis(answers) {
//     const apiKey = "YOUR_SECRET_OPENAI_API_KEY"; // Store safely, NOT in frontend!
    
//     const prompt = `Analyze the following personality test answers and provide a personality summary.

//     The test consists of 10 questions, each with five possible responses: Strongly Agree, Agree, Neutral, Disagree, Strongly Disagree.

//     Here are the responses:
//     ${answers.map((ans, i) => `${i + 1}. ${ans}`).join("\n")}

//     Based on these responses, summarize the personality traits of the user in a structured way.`;

//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${apiKey}`,
//         },
//         body: JSON.stringify({
//             model: "gpt-3.5-turbo",
//             messages: [{ role: "system", content: prompt }],
//             temperature: 0.7,
//             max_tokens: 200,
//         }),
//     });

//     const data = await response.json();
//     return data.choices[0].message.content;
// }

// // Example usage
// const userAnswers = ["Agree", "Strongly Agree", "Neutral", "Disagree", "Strongly Disagree", "Agree", "Neutral", "Strongly Agree", "Disagree", "Agree"];

// getPersonalityAnalysis(userAnswers).then(result => {
//     console.log("Personality Summary:", result);
// });
