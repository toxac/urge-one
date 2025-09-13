interface AssessmentQuestion {
  id: number;
  text: string;
  attribute: string;
}

export const assessmentQuestions: AssessmentQuestion [] = [
  // Risk Tolerance
  { id: 1, text: "I am comfortable taking calculated risks.", attribute: "risk-tolerance" },
  { id: 2, text: "I am not afraid of failure, seeing it as a learning experience.", attribute: "risk-tolerance" },

  // Creativity
  { id: 3, text: "I am good at coming up with new and innovative ideas.", attribute: "creativity" },
  { id: 4, text: "I am open to trying new things and experimenting with different approaches.", attribute: "creativity" },

  // Resilience
  { id: 5, text: "I am able to bounce back from setbacks and challenges.", attribute: "resilience" },
  { id: 6, text: "I don't give up easily, even when things get tough.", attribute: "resilience" },

  // Problem-solving
  { id: 7, text: "I am a good problem-solver.", attribute: "problem-solving" },
  { id: 8, text: "I am able to generate creative solutions to problems.", attribute: "problem-solving" },

  // Decision-making
  { id: 9, text: "I am decisive and able to make decisions efficiently.", attribute: "decision-making" },
  { id: 10, text: "I am able to weigh the pros and cons of different options.", attribute: "decision-making" },

  // Leadership
  { id: 11, text: "I am comfortable taking on leadership roles.", attribute: "leadership" },
  { id: 12, text: "I am able to motivate and inspire others.", attribute: "leadership" },

  // Communication
  { id: 13, text: "I am a good communicator.", attribute: "communication" },
  { id: 14, text: "I am a good listener.", attribute: "communication" },

  // Persistence
  { id: 15, text: "I am persistent and don't give up easily.", attribute: "persistence" },
  { id: 16, text: "I am able to set goals and work towards them consistently.", attribute: "persistence" },

  // Asking and Handling Rejection
  { id: 17, text: "I am comfortable asking for what I want, even if it means facing potential rejection.", attribute: "asking-and-handling-rejection" },
  { id: 18, text: "I am able to handle rejection gracefully and learn from it.", attribute: "asking-and-handling-rejection" },
];