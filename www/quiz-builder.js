Array.from(document.getElementsByClassName("delete-question")).forEach(
  (element) => {
    const idx = element.getAttribute("data-question-index");
    const id = element.getAttribute("data-quiz-id");

    element.addEventListener("click", async () => {
      await fetch(`/api/quizzes/${id}/questions/${idx}`, {
        method: "delete",
      });
      window.location.reload();
    });
  }
);
