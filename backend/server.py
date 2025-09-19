import os
import requests
import google.generativeai as genai
from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForCausalLM

# --- Flask App Initialization ---
app = Flask(__name__)

# --- API Key Configuration ---
# PASTE YOUR NEW GOOGLE AI API KEY HERE
GOOGLE_AI_API_KEY = "AIzaSyBA2KW_qriB0RaiCoQUi3fY64OP3NA9iAU"
genai.configure(api_key=GOOGLE_AI_API_KEY)

# --- Main Application Code ---

# Load Our Fine-Tuned Model (for quizzes)
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'final_model')

print("Loading the fine-tuned model for quiz generation...")
try:
    quiz_tokenizer = AutoTokenizer.from_pretrained(model_path)
    quiz_model = AutoModelForCausalLM.from_pretrained(model_path)
    print("Fine-tuned model loaded successfully.")
except Exception as e:
    print(f"FATAL ERROR: Could not load fine-tuned model. Error: {e}")
    quiz_tokenizer = None
    quiz_model = None

# --- API Endpoints ---

@app.route('/api/generate', methods=['POST'])
def generate_text():
    # This endpoint for your local model remains the same
    if not quiz_model or not quiz_tokenizer:
        return jsonify({'error': 'Fine-tuned model is not available.'}), 500
    try:
        data = request.json
        prompt = data.get('prompt', '')
        inputs = quiz_tokenizer.encode(prompt, return_tensors='pt')
        outputs = quiz_model.generate(
            inputs, max_length=60, num_return_sequences=1, do_sample=True,
            temperature=0.7, top_k=50, pad_token_id=quiz_tokenizer.eos_token_id
        )
        generated_text = quiz_tokenizer.decode(outputs[0], skip_special_tokens=True)
        return jsonify({'generated_text': generated_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/explain-code', methods=['POST'])
def explain_code():
    """This function now uses the Google AI Gemini API."""
    data = request.json
    user_code = data.get('code', '')

    if "YOUR_GOOGLE_AI_KEY_HERE" in GOOGLE_AI_API_KEY:
        return jsonify({'error': 'Server is missing the Google AI API Key.'}), 500
    if not user_code.strip():
        return jsonify({'error': 'No code provided.'}), 400

    prompt = f"Explain the following Java code snippet. Describe its purpose, what each part does, and the overall logic in a clear, step-by-step manner.\n\nCODE:\n```java\n{user_code}\n```"
    
    try:
        print("Sending request to Google AI Gemini API...")
        model = genai.GenerativeModel('gemini-1.5-flash-latest') # Using the fast and powerful Flash model
        response = model.generate_content(prompt)
        
        explanation = response.text
        print("Successfully received response from Gemini API.")
        return jsonify({'explanation': explanation})
        
    except Exception as e:
        print(f"An error occurred with the Gemini API: {e}")
        return jsonify({'error': f'An error occurred with the AI service: {e}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)