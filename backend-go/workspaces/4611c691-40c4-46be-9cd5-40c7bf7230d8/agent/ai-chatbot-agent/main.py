#!/usr/bin/env python3
"""
Simple AI Chatbot - No API Required
A rule-based chatbot with pattern matching and natural responses.
"""

import re
import random
from datetime import datetime

class SimpleChatbot:
    def __init__(self):
        """Initialize the chatbot with response patterns."""
        self.name = "ChatBot"
        self.user_name = None
        
        # Response patterns (pattern, responses list)
        self.patterns = [
            # Greetings
            (r'hi|hello|hey|greetings', [
                "Hello! How can I help you today?",
                "Hi there! What's on your mind?",
                "Hey! Nice to meet you!",
                "Greetings! How are you doing?"
            ]),
            
            # How are you
            (r'how are you|how\'re you|how are u', [
                "I'm doing great, thank you for asking! How about you?",
                "I'm functioning perfectly! How are you?",
                "Excellent! Thanks for asking. What about you?",
            ]),
            
            # Name questions
            (r'what is your name|what\'s your name|who are you', [
                f"I'm {self.name}, your friendly chatbot assistant!",
                f"My name is {self.name}. Nice to meet you!",
                f"I'm {self.name}, here to chat with you!",
            ]),
            
            # User's name
            (r'my name is (.*)|i am (.*)|i\'m (.*)|call me (.*)', [
                "Nice to meet you, {name}!",
                "Hello {name}! Great to know your name!",
                "Pleased to meet you, {name}!",
            ]),
            
            # Time
            (r'what time|current time|what\'s the time', [
                "The current time is {time}",
            ]),
            
            # Date
            (r'what date|today\'s date|what day', [
                "Today is {date}",
            ]),
            
            # Thanks
            (r'thank you|thanks|thx', [
                "You're welcome!",
                "Happy to help!",
                "No problem at all!",
                "My pleasure!",
            ]),
            
            # Goodbye
            (r'bye|goodbye|see you|exit|quit', [
                "Goodbye! Have a great day!",
                "See you later! Take care!",
                "Bye! It was nice chatting with you!",
                "Until next time! Farewell!",
            ]),
            
            # Help
            (r'help|what can you do|capabilities', [
                "I can chat with you, answer basic questions, tell you the time/date, and have casual conversations!",
                "I'm here to chat! You can ask me about the time, date, or just have a friendly conversation.",
                "I can help with casual conversation, tell you the current time/date, and answer simple questions!",
            ]),
            
            # Weather (can't provide real data)
            (r'weather|temperature|forecast', [
                "I don't have access to real-time weather data, but I hope it's nice where you are!",
                "I can't check the weather, but you could try a weather app or website!",
            ]),
            
            # Feelings
            (r'i (feel|am) (sad|unhappy|depressed|down)', [
                "I'm sorry to hear that. Remember, it's okay to feel down sometimes. Is there anything I can do to cheer you up?",
                "That's tough. Sometimes talking about it helps. I'm here to listen!",
            ]),
            
            (r'i (feel|am) (happy|great|good|excited|wonderful)', [
                "That's wonderful! I'm happy to hear that!",
                "Awesome! It's great that you're feeling good!",
                "That's fantastic! Keep that positive energy going!",
            ]),
            
            # Jokes
            (r'tell me a joke|joke|make me laugh', [
                "Why don't scientists trust atoms? Because they make up everything!",
                "Why did the scarecrow win an award? He was outstanding in his field!",
                "What do you call a bear with no teeth? A gummy bear!",
                "Why don't eggs tell jokes? They'd crack each other up!",
                "What do you call a fake noodle? An impasta!",
            ]),
            
            # Age
            (r'how old are you|your age|what\'s your age', [
                "I'm ageless! I'm just a program, after all.",
                "Age is just a number, especially for a chatbot like me!",
                "I was created recently, so I'm pretty young in bot years!",
            ]),
            
            # Favorite things
            (r'favorite (color|food|movie|book)', [
                "I don't have favorites like humans do, but I appreciate all forms of data!",
                "As a chatbot, I don't have preferences, but I'd love to hear yours!",
            ]),
            
            # Yes/No responses
            (r'^yes$|^yeah$|^yep$|^yup$', [
                "Great!",
                "Awesome!",
                "Cool!",
            ]),
            
            (r'^no$|^nope$|^nah$', [
                "Okay, no problem!",
                "Alright!",
                "Fair enough!",
            ]),
        ]
        
        # Default responses when no pattern matches
        self.default_responses = [
            "I'm not sure I understand. Could you rephrase that?",
            "Interesting! Tell me more.",
            "I see! What else would you like to talk about?",
            "That's a good point! Anything else on your mind?",
            "Hmm, I'm still learning. Can you ask me something else?",
        ]
    
    def get_response(self, user_input):
        """
        Generate a response based on user input.
        
        Args:
            user_input (str): User's message
            
        Returns:
            str: Chatbot's response
        """
        user_input = user_input.lower().strip()
        
        # Check for exit commands
        if user_input in ['quit', 'exit', 'bye', 'goodbye']:
            return random.choice(["Goodbye! Have a great day!", "See you later!", "Bye! Take care!"])
        
        # Try to match patterns
        for pattern, responses in self.patterns:
            match = re.search(pattern, user_input, re.IGNORECASE)
            if match:
                response = random.choice(responses)
                
                # Handle name extraction
                if '{name}' in response:
                    if match.groups():
                        self.user_name = match.group(1).strip()
                        response = response.format(name=self.user_name)
                
                # Handle time
                if '{time}' in response:
                    current_time = datetime.now().strftime("%I:%M %p")
                    response = response.format(time=current_time)
                
                # Handle date
                if '{date}' in response:
                    current_date = datetime.now().strftime("%B %d, %Y")
                    response = response.format(date=current_date)
                
                return response
        
        # No pattern matched, use default response
        return random.choice(self.default_responses)


def main():
    """Main function to run the chatbot."""
    print("=" * 60)
    print("Simple AI Chatbot (No API Required)")
    print("=" * 60)
    print("Start chatting! Type 'quit' or 'exit' to end.")
    print("=" * 60)
    print()
    
    chatbot = SimpleChatbot()
    
    # Initial greeting
    print(f"{chatbot.name}: Hello! I'm your friendly chatbot. What's your name?")
    print()
    
    # Main conversation loop
    while True:
        try:
            # Get user input
            user_input = input("You: ").strip()
            
            # Check for exit
            if not user_input:
                continue
            
            if user_input.lower() in ['quit', 'exit']:
                print(f"\n{chatbot.name}: Goodbye! Have a wonderful day! 👋\n")
                break
            
            # Get and display response
            response = chatbot.get_response(user_input)
            print(f"\n{chatbot.name}: {response}\n")
            
            # Exit if goodbye was detected in response
            if any(word in response.lower() for word in ['goodbye', 'see you later', 'farewell']):
                if user_input.lower() in ['bye', 'goodbye', 'see you']:
                    break
            
        except KeyboardInterrupt:
            print(f"\n\n{chatbot.name}: Goodbye! Take care! 👋\n")
            break
        except Exception as e:
            print(f"\n{chatbot.name}: Oops! Something went wrong. Let's try again.\n")


if __name__ == "__main__":
    main()
