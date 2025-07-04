import { db, pool } from "../src/db/db";
import * as schema from "../src/db/schema";
import { reset, seed } from "drizzle-seed";

export const seedDb = async () => {
  await reset(db, schema);

  const todoTitles = [
    "Buy groceries",
    "Read a book",
    "Write TypeScript code",
    "Go for a run",
    "Call a friend",
    "Clean the house",
    "Finish homework",
    "Watch a movie",
    "Cook dinner",
    "Plan a trip",
    "Learn a new skill",
    "Meditate",
    "Organize desk",
    "Water the plants",
    "Update resume",
    "Practice guitar",
    "Take a walk",
    "Backup files",
    "Review notes",
    "Schedule appointments",
  ];

  const todoDescriptions = [
    "Pick up fruits and vegetables from the market.",
    "Finish reading the latest mystery novel.",
    "Work on a new TypeScript project for practice.",
    "Jog around the neighborhood park.",
    "Catch up with an old friend over the phone.",
    "Tidy up the living room and kitchen.",
    "Complete all assignments before the deadline.",
    "Watch a recommended film on streaming.",
    "Try a new recipe for dinner tonight.",
    "Research destinations for the upcoming vacation.",
    "Enroll in an online course to learn something new.",
    "Spend 10 minutes meditating for relaxation.",
    "Sort and arrange items on the work desk.",
    "Give water to all indoor and outdoor plants.",
    "Update and polish the professional resume.",
    "Practice a new song on the guitar.",
    "Take a stroll in the nearby park.",
    "Create backups of important documents.",
    "Go over class notes and highlight key points.",
    "Book appointments for the week ahead.",
  ];

  await seed(db, schema).refine((funcs) => ({
    usersTable: {
      columns: {
        age: funcs.int({ minValue: 13, maxValue: 120 }),
      },
      count: 20,
      with: { todosTable: 20 },
    },
    todosTable: {
      columns: {
        title: funcs.valuesFromArray({ values: todoTitles }),
        description: funcs.valuesFromArray({ values: todoDescriptions }),
      },
    },
  }));
};

seedDb()
  .then(() => {
    console.log("Database seeded successfully");
    return pool.end();
  })
  .catch((e) => {
    console.log(e);
    return pool.end();
  });
