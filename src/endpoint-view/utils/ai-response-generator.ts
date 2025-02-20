import { GoogleGenerativeAI } from '@google/generative-ai';

// Set  API KEY to EXPO_PUBLIC_GEMINI_API_KEY in your environment keys
const API_KEY = '';
// process.env.REACT_APP_GEMINI_API_KEY||'';

const genAI = new GoogleGenerativeAI(API_KEY as string);


const generationConfig = {
  temperature: 0.9, // Adjust as needed.  Lower for more predictable, higher for more creative.
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192, //  Make sure this is large enough for your expected response size
  responseMimeType: 'application/json' // Not necessary, we control the format via the prompt
};


const getPrompt = (userPrompt: string) => {
// Crucial:  Build the prompt to include the JSON formatting instructions.
const prompt = `
You are a helpful assistant that always responds in JSON format with answers.  
Respond to the following user prompt and format your answer as JSON object structure with the following structure:

{
    "response": "<The actual response to the user prompt>",
    "type": "text"
}
    
User Prompt: ${userPrompt}
`;
return prompt;
}


export async function generateContentAsJSON(userPrompt: string) {
  const request = {
    contents: [{ role: 'user', parts: [{ text: getPrompt(userPrompt) }] }],
    generationConfig
  };

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-pro-exp-02-05' }); // gemini-1.5-flash

  try {
    const result = await model.generateContent(request);
    const response = result.response;
    const text = response.text();

    // Attempt to parse the JSON.  This is important for error handling.
    try {
      const jsonResponse = JSON.parse(text);
      // alert(jsonResponse.response);
      // alert(typeof jsonResponse.response);
      if (typeof jsonResponse.response !== 'string') {
        jsonResponse.response = JSON.stringify(jsonResponse.response, null, 2);
      }
      return jsonResponse; // Return the parsed JSON object
    } catch (parseError) {
      // alert(parseError);
      //   console.log('Raw response text:', text); // Invalid JSON response from the model
      throw parseError; // Or throw an error
    }
  } catch (error) {
    // console.error('Error during content generation:', error);
    return { errored: true }; // Return error information
  }
}
