require('dotenv').config(); // Load environment variables from .env file
const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');

// Initialize Telegraf bot instance with your bot token from environment variables
const bot = new Telegraf(process.env.BOT_TOKEN);

// Command handlers for different days (day1 to day30)
for (let day = 1; day <= 30; day++) {
    bot.command(`day${day}`, (ctx) => handleDayCommand(ctx, day));
}

// Function to handle commands for specific day
function handleDayCommand(ctx, dayNumber) {
    // Read content from JSON file for the given day
    const dayData = readDayContent(dayNumber);

    if (dayData) {
        // Format message with Day content using Markdown
        const message = formatDayMessage(dayData, dayNumber);

        // Send formatted message
        ctx.replyWithMarkdown(message);
    } else {
        ctx.reply(`Failed to retrieve Day ${dayNumber} content. Please try again later.`);
    }
}

// Function to read content from a specific day's JSON file
function readDayContent(day) {
    try {
        // Construct the file path
        const filePath = path.join(__dirname, 'data', `day${day}.json`);
        
        // Read the file synchronously
        const data = fs.readFileSync(filePath, 'utf8');
        const dayContent = JSON.parse(data);
        return dayContent[`Day ${day}`]; // Return content for specific day
    } catch (err) {
        console.error(`Error reading day${day}.json file:`, err);
        return null;
    }
}

// Function to format day message with Markdown
function formatDayMessage(dayData, dayNumber) {
    let message = `*Day ${dayNumber}: ${dayData.Topic}*\n\n${dayData.Explanation}\n\n`;

    // Check and include Example section if it exists
    if (dayData.Example) {
        if (dayData.Example.Code && dayData.Example.Description) {
            message += `*Example:*\n\`\`\`\n${dayData.Example.Code}\n\`\`\`\n${dayData.Example.Description}\n\n`;
        }
    }

    // Check and include Examples section if it exists
    if (dayData.Examples) {
        for (const key in dayData.Examples) {
            const example = dayData.Examples[key];
            if (example.Code && example.Description) {
                message += `*${key}:*\n\`\`\`\n${example.Code}\n\`\`\`\n${example.Description}\n\n`;
            }
        }
    }

    // Check and include Exercise section if it exists
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