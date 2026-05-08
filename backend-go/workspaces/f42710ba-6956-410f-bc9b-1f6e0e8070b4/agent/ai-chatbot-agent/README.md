# Simple AI Chatbot (No API Required!) 🤖

A friendly, rule-based chatbot that works completely offline with **NO API keys needed**!

## ✨ Features

- 💬 Natural conversation flow
- 🎯 Pattern-based responses
- 🕐 Tells current time and date
- 😄 Tells jokes
- 🎲 Randomized responses for variety
- 📝 Remembers your name during the conversation
- 🚫 **NO API keys or internet required**
- ⚡ Runs instantly with just Python

## 🎯 What It Can Do

- Greet you and have casual conversations
- Answer "How are you?" questions
- Tell you the current time and date
- Share jokes
- Respond to your emotions
- Remember your name
- Help with basic Q&A
- And more!

## 🚀 Installation & Setup

### Prerequisites
- Python 3.6 or higher (that's it!)

### Quick Start

1. **Extract the files** from the zip
2. **Open terminal/command prompt** in the extracted folder
3. **Run the chatbot:**
   ```bash
   python main.py
   ```

That's it! No installation, no API keys, no configuration needed!

## 💻 Usage

Once you run the program:

```
============================================================
Simple AI Chatbot (No API Required)
============================================================
Start chatting! Type 'quit' or 'exit' to end.
============================================================

ChatBot: Hello! I'm your friendly chatbot. What's your name?

You: Hi! My name is John
ChatBot: Nice to meet you, John!

You: Tell me a joke
ChatBot: Why don't scientists trust atoms? Because they make up everything!

You: What time is it?
ChatBot: The current time is 02:30 PM

You: quit
ChatBot: Goodbye! Have a wonderful day! 👋
```

## 🎮 Try These Commands

- "Hello" / "Hi" - Greet the bot
- "My name is [Your Name]" - Introduce yourself
- "How are you?" - Ask about the bot
- "Tell me a joke" - Get a random joke
- "What time is it?" - Get current time
- "What's the date?" - Get current date
- "Help" - See what the bot can do
- "Goodbye" / "quit" / "exit" - End the conversation

## 🔧 How It Works

This chatbot uses:
- **Regular expressions** for pattern matching
- **Random selection** for varied responses
- **Python standard library** only (no external dependencies!)

It's completely self-contained and works offline!

## 🎨 Customization

Want to add your own responses? Edit `main.py` and add patterns to the `self.patterns` list:

```python
(r'your pattern here', [
    "Response 1",
    "Response 2",
    "Response 3",
]),
```

## 📝 Technical Details

- **Language:** Python 3
- **Dependencies:** None! (Uses standard library only)
- **Type:** Rule-based chatbot with pattern matching
- **Size:** Lightweight and fast
- **Privacy:** 100% offline, no data sent anywhere

## 🤔 Limitations

Since this is a rule-based chatbot without AI:
- Responses are based on predefined patterns
- Cannot understand complex or nuanced questions
- Limited to programmed conversation topics
- No learning capability

For advanced AI capabilities, you'd need an API-based solution like the previous chatbot.

## 📜 License

Free to use and modify!

## 🎉 Enjoy!

Have fun chatting with your bot! Feel free to customize it and add more patterns and responses!
