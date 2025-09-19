# backend/train_model.py

import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TextDataset,
    DataCollatorForLanguageModeling,
    Trainer,
    TrainingArguments
)

# 1. CHOOSE A PRE-TRAINED MODEL
# We're using 'distilgpt2', a smaller, faster version of GPT-2.
# This is a great starting point for fine-tuning on a local machine.
MODEL_NAME = "distilgpt2"

# 2. LOAD THE TOKENIZER AND MODEL
# The tokenizer prepares the text for the model.
# The model is the neural network architecture we will fine-tune.
print(f"Loading tokenizer and model for '{MODEL_NAME}'...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)
print("Model and tokenizer loaded.")

# 3. PREPARE THE DATASET
# We load our clean text file and prepare it for training.
print("Preparing dataset...")
#train_file = "javadocs_clean.txt"

# In train_model.py
train_file = "book_data_clean.txt"
dataset = TextDataset(
    tokenizer=tokenizer,
    file_path=train_file,
    block_size=128  # The size of text chunks to feed the model
)

data_collator = DataCollatorForLanguageModeling(
    tokenizer=tokenizer, 
    mlm=False # Masked Language Modeling is false for GPT-style models
)
print("Dataset prepared.")

# 4. SET UP THE TRAINING ARGUMENTS
# These are the settings for our training session.
training_args = TrainingArguments(
    output_dir="./cognidesk-java-model", # Directory to save the trained model
    overwrite_output_dir=True,
    num_train_epochs=1, # One epoch is enough for a good start
    per_device_train_batch_size=2, # Lower this if you run out of memory
    save_steps=10_000,
    save_total_limit=2,
    prediction_loss_only=True,
)

# 5. CREATE THE TRAINER
# The Trainer object handles the entire training loop for us.
trainer = Trainer(
    model=model,
    args=training_args,
    data_collator=data_collator,
    train_dataset=dataset,
)

# 6. START FINE-TUNING
print("Starting fine-tuning...")
trainer.train()
print("Fine-tuning complete.")

# 7. SAVE THE FINAL MODEL
# The final, fine-tuned model is saved to a directory for later use.
final_model_path = "./final_model"
trainer.save_model(final_model_path)
tokenizer.save_pretrained(final_model_path)
print(f"Model saved to {final_model_path}")