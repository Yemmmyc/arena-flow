import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.argv[2];

if (!apiKey) {
  console.error("Please provide your API key as an argument: node diagnose.js YOUR_API_KEY");
  process.exit(1);
}

async function run() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // In @google/generative-ai, listModels might not be directly exposed in all versions, 
    // but we can query the API using standard fetch or checking model metadata.
    console.log("Testing connection...");
    
    // Let's fetch models using the REST endpoint directly to see what the server responds with
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      console.error("API Error Response:", JSON.stringify(data.error, null, 2));
      return;
    }
    
    console.log("\nAvailable Models for your key:");
    if (data.models) {
      data.models.forEach(m => {
        console.log(`- ${m.name.replace('models/', '')} (Supported methods: ${m.supportedGenerationMethods.join(', ')})`);
      });
    } else {
      console.log("No models returned. Response payload:", data);
    }
  } catch (e) {
    console.error("Unexpected error:", e);
  }
}

run();
