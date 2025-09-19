
document.addEventListener('DOMContentLoaded', () => {
    const { marked } = require('marked');
    console.log("DOM loaded. Initializing script v3.");

    // --- Page Switching Logic ---
    const navLinks = document.querySelectorAll('.sidebar .nav-links li a');
    const pages = document.querySelectorAll('.page');

    const switchPage = (targetId) => {
        console.log(`--- Switching to [${targetId}] ---`);

        // Hide all pages
        pages.forEach(page => {
            page.classList.add('hidden');
        });

        // Show the target page
        const pageToShow = document.getElementById(targetId);
        if (pageToShow) {
            pageToShow.classList.remove('hidden');
        } else {
            console.error(`Page with ID "${targetId}" was not found!`);
        }

        // Update the 'active' class on the sidebar links
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${targetId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // Attach a click listener to each navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetPageId = link.getAttribute('href').substring(1);
            switchPage(targetPageId);
        });
    });

    // --- Modal Logic ---
    const progressCard = document.getElementById('progress-card');
    const detailsModal = document.getElementById('details-modal');
    const closeButton = document.querySelector('.close-button');

    if (progressCard) {
        progressCard.addEventListener('click', () => detailsModal.classList.remove('hidden'));
    }
    if (closeButton) {
        closeButton.addEventListener('click', () => detailsModal.classList.add('hidden'));
    }
    window.addEventListener('click', (event) => {
        if (event.target === detailsModal) {
            detailsModal.classList.add('hidden');
        }
    });
    ////-------------------------------me---------------
// 1. A simple "database" of lesson content
const lessons = {
    variables: {
        title: 'Variables and Data Types',
        content: `
            <p>In Java, a variable is a container that holds a value. Before you can use a variable, you must declare it by specifying its type and name.</p>
            <p>There are eight primitive data types in Java:</p>
            <ul>
                <li><b>byte</b>, <b>short</b>, <b>int</b>, <b>long</b> for whole numbers.</li>
                <li><b>float</b>, <b>double</b> for floating-point numbers.</li>
                <li><b>char</b> for single characters.</li>
                <li><b>boolean</b> for true/false values.</li>
            </ul>
            <h4>Example Code:</h4>
            <pre><code>// Declaring an integer variable
int userAge = 30;

// Declaring a character variable
char grade = 'A';

// Printing a variable to the console
System.out.println("User's age is: " + userAge);</code></pre>
        `
    },
    operators: {
        title: 'Operators',
        content: `
            <p>Operators are special symbols that perform specific operations on one, two, or three operands, and then return a result.</p>
            <h4>Arithmetic Operators:</h4>
            <p>Used to perform common mathematical operations.</p>
            <pre><code>int x = 100 + 50; // Addition (+)
int y = x - 20;   // Subtraction (-)
int z = y * 2;    // Multiplication (*)
int w = z / 4;    // Division (/)
int rem = 10 % 3; // Modulus (remainder)</code></pre>
        `
    },
    'control-flow': {
        title: 'Control Flow (If/Else)',
        content: `
            <p>The <b>if-else</b> statement is used to execute a block of code only if a specified condition is true.</p>
            <h4>Example:</h4>
            <pre><code>int time = 20;
if (time < 18) {
  System.out.println("Good day.");
} else {
  System.out.println("Good evening.");
}
// Outputs "Good evening."</code></pre>
        `
    }
    // We can add the 'loops' lesson here later
};

// 2. Get the elements we need to manipulate
const lessonTopicList = document.querySelector('.lesson-topics ul');
const lessonContentEl = document.querySelector('.lesson-content');

// 3. Listen for clicks on the list of topics
lessonTopicList.addEventListener('click', (event) => {
    // Check if a link was actually clicked
    if (event.target.tagName === 'A') {
        event.preventDefault();

        const lessonKey = event.target.dataset.lesson;
        const lesson = lessons[lessonKey];

        if (lesson) {
            // Update the content on the right
            lessonContentEl.innerHTML = `<h3>${lesson.title}</h3>${lesson.content}`;

            // Update the 'active' class on the left
            // First, remove 'active' from any link that has it
            lessonTopicList.querySelector('.active-lesson').classList.remove('active-lesson');
            // Then, add 'active' to the link that was just clicked
            event.target.classList.add('active-lesson');
        }
    }
});
// --- Practice Page (Quiz) Logic ---

const quizData = [
    {
        question: "Which data type is used to create a variable that should store text?",
        options: ["String", "string", "str", "Txt"],
        answer: "String"
    },
    {
        question: "How do you create a variable with the numeric value 5?",
        options: ["num x = 5;", "x = 5;", "float x = 5;", "int x = 5;"],
        answer: "int x = 5;"
    },
    {
        question: "Which operator is used to add together two values?",
        options: ["The + sign", "The & sign", "The * sign"],
        answer: "The + sign"
    }
];

const questionTextEl = document.getElementById('question-text');
const optionsContainerEl = document.getElementById('options-container');
const feedbackTextEl = document.getElementById('feedback-text');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');

let currentQuestionIndex = 0;
let selectedAnswer = null;

function loadQuestion() {
    // Reset state from previous question
    selectedAnswer = null;
    feedbackTextEl.textContent = '';
    submitBtn.classList.remove('hidden');
    nextBtn.classList.add('hidden');
    optionsContainerEl.innerHTML = ''; // Clear old options

    const currentQuestion = quizData[currentQuestionIndex];
    questionTextEl.textContent = currentQuestion.question;

    // Create and display option buttons
    currentQuestion.options.forEach(optionText => {
        const button = document.createElement('button');
        button.textContent = optionText;
        button.classList.add('option-btn');
        optionsContainerEl.appendChild(button);
    });
}

// Handle clicking on an option
optionsContainerEl.addEventListener('click', (event) => {
    if (event.target.classList.contains('option-btn')) {
        // Remove 'selected' from any previously selected button
        const previouslySelected = optionsContainerEl.querySelector('.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        
        // Add 'selected' to the clicked button and store the answer
        event.target.classList.add('selected');
        selectedAnswer = event.target.textContent;
    }
});

// Handle clicking the "Check Answer" button
submitBtn.addEventListener('click', () => {
    if (selectedAnswer === null) {
        feedbackTextEl.textContent = "Please select an answer.";
        return;
    }

    const currentQuestion = quizData[currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.answer;
    
    // Show feedback
    feedbackTextEl.textContent = correct ? "Correct!" : "Incorrect. The right answer was: " + currentQuestion.answer;
    feedbackTextEl.style.color = correct ? '#2ecc71' : '#e74c3c';

    // Style the buttons based on the answer
    Array.from(optionsContainerEl.children).forEach(button => {
        if (button.textContent === currentQuestion.answer) {
            button.classList.add('correct');
        } else if (button.textContent === selectedAnswer) {
            button.classList.add('incorrect');
        }
        button.disabled = true; // Disable buttons after answering
    });

    // Toggle navigation buttons
    submitBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
});

// Handle clicking the "Next Question" button
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
        // Re-enable buttons by re-creating them in loadQuestion
    } else {
        // End of quiz
        questionTextEl.textContent = "Quiz Complete!";
        optionsContainerEl.innerHTML = '';
        feedbackTextEl.textContent = '';
        nextBtn.classList.add('hidden');
    }
});
loadQuestion();
const generateBtn = document.getElementById('generate-question-btn');
const aiQuestionEl = document.getElementById('ai-generated-question');
generateBtn.addEventListener('click', async () => {
    
    // 1. Set a loading message
    aiQuestionEl.textContent = '🧠 Thinking...';
    
    // 2. Define the prompt for our AI model
    const prompt = "A good quiz question about Java variables is:";
    
    try {
        // 3. "fetch" is the modern way to make API calls in JavaScript.
        // We send a POST request to our running Python server.
        const response = await fetch('http://127.0.0.1:5000/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 4. Get the JSON data from the response
        const data = await response.json();
        
        // 5. Display the AI's generated text in our app
        aiQuestionEl.textContent = data.generated_text;

    } catch (error) {
        // 6. Show an error message if something goes wrong
        aiQuestionEl.textContent = 'Error connecting to the AI model. Is the Python server running?';
        console.error('Fetch error:', error);
    }
});
///-------------------------ME-----------------------

    // --- Code Playground Logic ---
    const explainCodeBtn = document.getElementById('explain-code-btn');
    const codeEditor = document.getElementById('code-editor');
    const explanationOutput = document.getElementById('explanation-output');

    if (explainCodeBtn) {
        explainCodeBtn.addEventListener('click', async () => {
            const userCode = codeEditor.value;
            if (!userCode.trim()) {
                explanationOutput.textContent = "Please write some code in the editor first.";
                return;
            }
            explanationOutput.textContent = "🤖 Thinking...";
            explainCodeBtn.disabled = true;

            try {
                const response = await fetch('http://127.0.0.1:5000/api/explain-code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: userCode }),
                });
                const data = await response.json();
                explanationOutput.innerHTML = response.ok ? marked(data.explanation) : `<p style="color: red;">Error: ${data.error}</p>`;            } catch (error) {
                console.error('Fetch error:', error);
                explanationOutput.textContent = "Failed to connect to the backend server. Is it running?";
            } finally {
                explainCodeBtn.disabled = false;
            }
        });
    }

    // --- Initial Load ---
    console.log("Initialization complete. Setting initial page to dashboard.");
    switchPage('page-dashboard');
});