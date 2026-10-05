import { queryRulesEngine } from './src/utils/rulesBotEngine.js';

console.log('--- Testing Rules Bot Engine ---');

const testQuestions = [
  "Can you Nope a Defuse?",
  "Can you Nope a Nope?",
  "What happens if someone steals my Exploding Kitten when I have Streaking Kitten?",
  "Can Barking Kitten be Noped?",
  "Do Attack cards stack turns?",
  "How do Cat Card combos work?",
  "Can Imploding Kitten be defused?",
  "Can Godcat be played as a Nope?",
  "Can dead players play cards in Zombie Kittens?",
  "What is Catomic Bomb?"
];

for (const q of testQuestions) {
  const res = queryRulesEngine(q);
  console.log(`\nQ (EN): "${q}"`);
  console.log(`Reference: ${res.reference}`);
  console.log(`Answer: ${res.answer.slice(0, 100)}...`);
  console.assert(res.answer && res.answer.length > 20, `Answer should be substantive for "${q}"`);
}

console.log('\n--- Testing German Rules Bot Queries ---');
const germanQuestions = [
  "Kann man eine Entschärfung mit Nö! abwehren?",
  "Kann man ein Nö! auf ein Nö! spielen?",
  "Addieren sich Angriffskarten?",
  "Wie funktionieren Katzenkarten-Kombos?",
  "Was passiert, wenn jemand mein Explodierendes Kätzchen stiehlt?",
  "Kann das Implodierende Kätzchen entschärft werden?",
  "Wie funktioniert die Entschärfung?",
  "Gottkatze Regeln"
];

for (const q of germanQuestions) {
  const res = queryRulesEngine(q, 'de');
  console.log(`\nQ (DE): "${q}"`);
  console.log(`Reference: ${res.reference}`);
  console.log(`Answer: ${res.answer.slice(0, 100)}...`);
  console.assert(res.answer && res.answer.length > 20, `Answer should be substantive for German "${q}"`);
}

console.log('\nAll English & German Rules Bot queries tested successfully!');
