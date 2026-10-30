/** Curated public demonstrations, never provider output or private user content. */
export const MILA_STYLES=['Homegirl','CEO','Auntie','Advisor','Teacher','Mom'] as const;
export type MilaStyle=typeof MILA_STYLES[number];
export const MILA_TOPICS={Career:"I want a better job, but I don’t know where to start.",Life:"I feel like I’m falling behind.",Goals:"Help me get my life organized."} as const;
export type MilaTopic=keyof typeof MILA_TOPICS;
export const MILA_EXAMPLES:Record<MilaTopic,Record<MilaStyle,string>>={
 Career:{
 Homegirl:"We can figure this out together. Tell me what you’re doing now, what you want more of, and one thing you’d love to leave behind. That’s our starting point.",
 CEO:"Let’s define your next move: target role, minimum pay and the strengths you bring. Then we’ll choose one focused action for this week.",
 Auntie:"First things first: you have something to offer. Tell me what work gives you energy and what isn’t working. We’ll make a sensible plan from there.",
 Advisor:"Start by identifying the gap between your current role and your preferred work. What responsibilities, pay and working conditions matter most?",
 Teacher:"Let’s take this in three steps: list your strengths, choose two roles to explore, and compare their requirements. What kind of work interests you?",
 Mom:"You don’t have to solve your whole career today. Let’s start with what you need to feel more secure and supported in your next job."},
 Life:{
 Homegirl:"You’re not behind. You’re building something. Tell me what’s been weighing on you, and we’ll figure out a next move together.",
 CEO:"Your progress isn’t defined by someone else’s timeline. Let’s identify your top three priorities and build a plan you can actually follow.",
 Auntie:"Everybody’s journey has its own timing. Let’s put the comparisons down for a moment. What’s one thing you want to make room for?",
 Advisor:"Let’s separate what you’re feeling from what the evidence shows. Which goals are you measuring yourself against, and which matter most to you?",
 Teacher:"Let’s break that feeling into smaller pieces. First, identify your goals. Then we’ll look at your progress and choose achievable next steps.",
 Mom:"You don’t have to have everything figured out today. The effort you’re making matters. Let’s work through what’s worrying you, one thing at a time."},
 Goals:{
 Homegirl:"Let’s clear some space in your head. Give me the three things taking up the most room, and we’ll sort what needs attention first.",
 CEO:"Let’s build a simple operating plan: three priorities, clear next actions and a realistic calendar. What must move forward this week?",
 Auntie:"We’re not going to fix everything before lunch. Let’s pick what matters today, what can wait, and what you can stop carrying altogether.",
 Advisor:"Let’s map your responsibilities and available time. Then we can distinguish urgent tasks from important longer-term goals and plan accordingly.",
 Teacher:"Try three lists: today, this week and later. We’ll turn each goal into one small action. What would you like to put on the first list?",
 Mom:"We can make this gentler. Start with one thing that would make today easier, and leave room for rest. What feels most important right now?"}
};
