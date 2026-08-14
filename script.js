async function generateMCQs() {

    const topic = document.getElementById("topic").value.trim();
    const difficulty = document.getElementById("difficulty").value;

    const quizContainer = document.getElementById("quiz-container");
    const scoreElement = document.getElementById("score");

    quizContainer.innerHTML = "";
    scoreElement.innerHTML = "";

    if (topic === "") {
        alert("Please enter a topic!");
        return;
    }

    quizContainer.innerHTML = `
        <div class="question">
            <h3>🤖 Generating your MCQs...</h3>
            <p>Please wait...</p>
        </div>
    `;

    try {

        const response = await fetch("http://localhost:3000/generate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                topic: topic,
                difficulty: difficulty
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        quizContainer.innerHTML = "";

        data.questions.forEach((q, index) => {

            const questionDiv = document.createElement("div");

            questionDiv.className = "question";

            questionDiv.innerHTML = `
                <h3>${index + 1}. ${q.question}</h3>

                ${q.options.map((option, optionIndex) => `
                    
                    <label class="option">

                        <input
                            type="radio"
                            name="question${index}"
                            value="${option}"
                        >

                        ${option}

                    </label>

                `).join("")}
            `;

            quizContainer.appendChild(questionDiv);
        });


        const submitButton = document.createElement("button");

        submitButton.innerText = "Submit Quiz 🎯";

        submitButton.onclick = () => calculateScore(data.questions);

        quizContainer.appendChild(submitButton);

    } catch (error) {

        console.error(error);

        quizContainer.innerHTML = `
            <div class="question">

                <h3>❌ Something went wrong</h3>

                <p>
                    Could not generate questions.
                    Please make sure your server is running.
                </p>

            </div>
        `;
    }
}


function calculateScore(questions) {

    let score = 0;

    questions.forEach((q, index) => {

        const selected = document.querySelector(
            `input[name="question${index}"]:checked`
        );

        if (selected && selected.value === q.answer) {
            score++;
        }

    });

    document.getElementById("score").innerHTML = `
        🎉 Your Score: ${score} / ${questions.length}
    `;
}