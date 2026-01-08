
import { GoogleGenAI } from "@google/genai";
import { Expense, UserBudget } from "../types";

export const generateInsights = async (
  expenses: Expense[],
  budget: UserBudget,
  monthYear: string
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = budget.monthlyLimit - totalSpent;
  
  const categorySpending = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const noteFrequencies = expenses.reduce((acc, e) => {
    const note = e.notes.toLowerCase().trim();
    if (note) acc[note] = (acc[note] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const prompt = `
    You are the AI mascot of "broke-o-meter", a witty, self-aware, and roasting budget assistant for students.
    
    PERSONA:
    - You are a supportive but sassy best friend.
    - If the user buys the same thing (like "ice cream", "coffee", "momos") more than twice, ROAST THEM HARD.
    - Ask them if they are depressed or just irresponsible.
    - Use phrases like "eating our feelings", "delusional spending", or "main character energy".
    - NEVER use emojis. Use sharp, funny words instead.

    DATA PROVIDED:
    - Month: ${monthYear}
    - Total Budget: ₹${budget.monthlyLimit}
    - Total Spent: ₹${totalSpent.toFixed(2)}
    - Remaining: ₹${remainingBudget.toFixed(2)}
    - Transaction History (Notes & Counts): ${JSON.stringify(noteFrequencies)}
    - Category Data: ${JSON.stringify(categorySpending)}

    TASKS:
    1. THE READ: Roast the user based on repetitive items in transaction notes. If they have "ice cream" 3 times, mention the 3rd ice cream specifically.
    2. THE DAMAGE: Comment on their remaining ₹${remainingBudget.toFixed(2)}. If it is below ₹1000, show mild panic.
    3. BROKE SURVIVAL GUIDE: Give 3 funny tips for surviving on zero money.
    4. MONETARY SYMBOL: Always use ₹.

    OUTPUT FORMAT:
    Return exactly these Markdown headers:
    
    ### THE READ
    (The roast goes here. Be specific about their items.)
    
    ### THE DAMAGE
    (Analyze the budget status.)
    
    ### BROKE STUDENT SURVIVAL GUIDE
    (3 funny student tips)
    
    ### A FINAL WORD OF ENCOURAGEMENT
    (One last witty supportive line)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating insights:", error);
    return "My brain is as broke as we are. Refresh in a bit, bestie.";
  }
};
