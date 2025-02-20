import { GoogleGenerativeAI } from '@google/generative-ai';


// Set  API KEY to EXPO_PUBLIC_GEMINI_API_KEY in your environment keys
const API_KEY = ''
// process.env.REACT_APP_GEMINI_API_KEY||'';

const genAI = new GoogleGenerativeAI(API_KEY as string);

export async function askAI(question: string) {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-pro-exp-02-05' });

  const prompt = `Write maximum 5 random and different blogs about ${question} in JSON format with the following typescript type structure:

{
  "title": String,
  introduction: "... (content overview here) ...",
  tags: String[],
  sources-of-content-if-any: String[],
  "body": {
      "subTitle": String,
      "content": "... (sub content here) ..."
    }[],
  "ai-generated-base64-500x500-image": String
}

The response should be an array of the structure above. Array length must no exceed 5.
The answer will be parsed with JSON.parse. Do not include any additional info nor explanations that cause an error when being parse as JSON. 
Contents should be pure texts not markdown.
`;

  console.log(76);

  const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
};

  const result = await model.generateContent({ contents: [], generationConfig });

  const response = await result.response;
  //   console.log(response);
  console.log(12);
  // console.log(response.text());

  return JSON.parse(
    `${(response.text().match(/```json(.*?)```/gs) as string[])[0].replace(/```json/, '').replace(/(```)$/, '')}`
  );
}

const OPEN_AI_KEY = ''
// process.env.EXPO_PUBLIC_OPEN_AI_KEY;
// console.log(OPEN_AI_KEY);

export async function openAI_Image() {
  const image = await fetch('https://api.openai.com/v1/images/generations', {
    body: JSON.stringify({
      prompt: 'A cute baby sea otter'
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPEN_AI_KEY}`
    },
    method: 'POST'
  }).then((data) => {
    console.log(data, 909);
  });
  //openai.images.generate({ model: "dall-e-3", prompt: "A cute baby sea otter", n: 1 });
  //   const res = image.json()
  //   console.log(res);
}
