export const generateMeetingLink = (sessionId) => {
  // Using Jitsi Meet's free service
  const baseUrl = "https://meet.jit.si";
  // Create a unique room name using the session ID
  const roomName = `mentorconnect-${sessionId}`;
  return `${baseUrl}/${roomName}`;
};
