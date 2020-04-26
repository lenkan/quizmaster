Array.from(document.getElementsByClassName("remove-question")).forEach(
  (element) => {
    const questionId = element.getAttribute("data-question-id");
    const quizId = element.getAttribute("data-quiz-id");

    element.addEventListener("click", async () => {
      await fetch(`/quiz-builder/${quizId}/remove-question`, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: questionId,
        }),
        method: "post",
      });

      window.location.reload();
    });
  }
);
