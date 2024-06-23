require('dotenv').config();
const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');

// Week-wise topics data
const topicsData = {
  "Week 1": {
    "Day 1": "Introduction to Python: What is Python and why use it?",
    "Day 2": "Setting up Python: Installing Python and setting up the development environment.",
    "Day 3": "Your First Python Program: Writing and running a simple program.",
    "Day 4": "Variables and Data Types: Understanding data types and variables.",
    "Day 5": "Basic Operators: Arithmetic, assignment, comparison, logical operators.",
    "Day 6": "String Manipulation: Basic string functions and operations.",
    "Day 7": "Control Flow: if, else, and elif statements."
  },
  "Week 2": {
    "Day 8": "Lists and List Operations: Creating lists, accessing elements, list comprehensions.",
    "Day 9": "Tuples and Sets: Differences from lists, usage, and properties.",
    "Day 10": "Dictionaries: Creating, accessing, and manipulating dictionaries.",
    "Day 11": "Looping Constructs: Using for loops and while loops.",
    "Day 12": "Functions: Defining and calling functions, arguments, and return values.",
    "Day 13": "Modules and Packages: Importing and using modules, exploring standard libraries.",
    "Day 14": "File Handling: Reading from and writing to files."
  },
  "Week 3": {
    "Day 15": "Error and Exception Handling: Try, except block, finally clause.",
    "Day 16": "Classes and Objects: Introduction to OOP, creating classes and objects.",
    "Day 17": "Inheritance and Polymorphism: Extending classes, overriding methods.",
    "Day 18": "Decorators: Understanding decorators and their usage.",
    "Day 19": "Generators and Iterators: Creating and using iterators and generators.",
    "Day 20": "Comprehensions: List, dictionary, and set comprehensions.",
    "Day 21": "Lambda Functions: Writing anonymous functions."
  },
  "Week 4": {
    "Day 22": "Working with APIs: Making network requests, parsing JSON.",
    "Day 23": "Introduction to Web Scraping: Using BeautifulSoup or similar libraries.",
    "Day 24": "Introduction to Data Analysis: Using Pandas for basic data manipulation.",
    "Day 25": "Plotting Data: Introduction to Matplotlib or Seaborn for data visualization.",
    "Day 26": "Databases in Python: Connecting to SQL databases, executing queries.",
    "Day 27": "Testing in Python: Basic unit tests using unittest or pytest.",
    "Day 28": "Virtual Environments: Why and how to use virtual environments."
  },
  "Week 5": {
    "Day 29": "Coding Practice: Part 1",
    "Day 30": "Coding Practice: Part 2"
  }
};

const bot = new Telegraf(process.env.BOT_TOKEN);

// Command handler for /start command
bot.command('start', (ctx) => {
  let startMessage = 'Welcome to Python Learning Bot!\n\n';
  startMessage += 'Here are the available commands:\n';

  // Iterate through each week and day to list commands
  for (const week in topicsData) {
    startMessage += `*${week}*\n`;
    for (const day in topicsData[week]) {
      startMessage += `/${day.toLowerCase()} - ${topicsData[week][day]}\n`;
    }
    startMessage += '\n'; // Add newline between weeks
  }

  // Send the start message with commands list
  ctx.replyWithMarkdown(startMessage);
});

// Command handlers for different days (day1 to day30)
for (let day = 1; day <= 30; day++) {
  bot.command(`day${day}`, (ctx) => handleDayCommand(ctx, day));
}

// Function to handle commands for specific day
function handleDayCommand(ctx, dayNumber) {
  const dayData = readDayContent(dayNumber);

  if (dayData) {
    const message = formatDayMessage(dayData, dayNumber);
    ctx.replyWithMarkdown(message);
  } else {
    ctx.reply(`Failed to retrieve Day ${dayNumber} content. Please try again later.`);
  }
}

// Function to read content from a specific day's JSON file
function readDayContent(day) {
  try {
    const filePath = path.join(__dirname, 'data', `day${day}.json`);
    const data = fs.readFileSync(filePath, 'utf8');
    const dayContent = JSON.parse(data);
    return dayContent[`Day ${day}`];
  } catch (err) {
    console.error(`Error reading day${day}.json file:`, err);
    return null;
  }
}

// Function to format day message with Markdown
function formatDayMessage(dayData, dayNumber) {
  let message = `*Day ${dayNumber}: ${dayData.Topic}*\n\n${dayData.Explanation}\n\n`;

  if (dayData.Example) {
    if (dayData.Example.Code && dayData.Example.Description) {
      message += `*Example:*\n\`\`\`\n${dayData.Example.Code}\n\`\`\`\n${dayData.Example.Description}\n\n`;
    }
  }

  if (dayData.Examples) {
    for (const key in dayData.Examples) {
      const example = dayData.Examples[key];
      if (example.Code && example.Description) {
        message += `*${key}:*\n\`\`\`\n${example.Code}\n\`\`\`\n${example.Description}\n\n`;
      }
    }
  }

  if (dayData.Exercise) {
    if (dayData.Exercise.Task && dayData.Exercise.Hint) {
      message += `*Exercise:*\n${dayData.Exercise.Task}\n_Hint:_ ${dayData.Exercise.Hint}\n`;
    }
  }

  return message;
}

// Start the bot
bot.launch().then(() => {
  console.log('Bot is running!');
}).catch((err) => {
  console.error('Error starting bot:', err);
});
