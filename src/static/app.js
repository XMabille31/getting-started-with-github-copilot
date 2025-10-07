document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Traduction des textes dans le JS
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Effacer le message de chargement
      activitiesList.innerHTML = "";

      // Remplir la liste des activités
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Horaire :</strong> ${details.schedule}</p>
          <p><strong>Places disponibles :</strong> ${spotsLeft} restantes</p>
        `;

        activitiesList.appendChild(activityCard);

        // Ajouter l'option au menu déroulant
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Impossible de charger les activités. Veuillez réessayer plus tard.</p>";
      console.error("Erreur lors du chargement des activités :", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "Une erreur est survenue";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Masquer le message après 5 secondes
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Échec de l'inscription. Veuillez réessayer.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Erreur lors de l'inscription :", error);
    }
  });

  // Initialize app
  fetchActivities();
});
