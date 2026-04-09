

import TwinProtocol from "twin-protocol-dev";

// Setup the TwinProtocol instance
 const twin = new TwinProtocol({
    TP_ACCESS_KEY:import.meta.env.VITE_TP_ACCESS_KEY,
    TP_SECRET_KEY: import.meta.env.VITE_TP_SECRET_KEY,
    TP_CLIENT_API_KEY: import.meta.env.VITE_TP_CLIENT_API_KEY,
    TP_BASE_URL: import.meta.env.VITE_TP_BASE_URL,
    TP_WS_URL: import.meta.env.VITE_TP_WS_URL,
  });

// Create user with memory
export const createUserWithMemory = async () => {
  try {
    const response = await twin.userWithMemory();
    console.log("User with memory created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating user with memory:", error);
    throw error;
  }
};
// Create a new personality
export const createPersonality = async (name: string, url: string) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("url", url);

    const response = await twin.createPersonality(formData);
    // console.log("Personality created:", response);
    return response;
  } catch (error) {
    console.error("Error creating personality:", error);
    throw error;
  }
};

// Get all personalities
export const getAllPersonalities = async () => {
  try {
    const response = await twin.getAllPersonalities();
    return response;
  } catch (error) {
    console.error("Error fetching personalities:", error);
    throw error;
  }
};

// Create a session
export const createSession = async (userId: string, personalityId: string) => {
  try {
    const response = await twin.createSession(userId, personalityId);
    return response.data;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

//generate chat response 
export const createChat = async (message: string, personalityId: string, language:string) => {
  try {
    const sessionId = "a19017f3-7b3f-4738-b184-a55011cdb646";
    const userId = "9443c250-818f-47f1-b548-e0a3a07bb646";
    const wordLimit = 50;
    const modelName = "gpt-4";
    // const language = "hi";
    
    const response = await twin.createChat(
      sessionId,
      message,
      userId,
      personalityId,
      wordLimit,
      modelName,
      language
    );
    return response;
  } catch (error: any) {
    console.error("Error creating chat:", error.message || error);
    throw error;
  }
};