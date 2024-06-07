import openai

# Set up OpenAI API key
openai.api_key = 'secret-key'

def classify_learning_outcome(learning_outcome):
    # Prompt for GPT-3
    prompt = f"Classify the learning outcome: '{learning_outcome}' into one of the Bloom's Taxonomy levels: Remember, Understand, Apply, Analyze, Evaluate, Create. Answer in one word"

    # Call OpenAI's GPT-3 API to generate text based on the prompt
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",  # Choose GPT-3 model
        messages=[
            {
                "role": "user",
                "content": prompt,
            },
        ],
        max_tokens=50,  # Adjust based on the desired length of the generated text
    )
    print(response)

    # Extract and return the generated text as the predicted label
    predicted_label = response.choices[0].message.content
    return predicted_label