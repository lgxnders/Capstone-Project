export const generateResponse = async (message) => {
    if (message.toLowerCase().includes('hello')) return 'Hello! How can I help you today?';
    return "chatbot stuff";
};