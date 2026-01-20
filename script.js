let tasks = JSON.parse(localStorage.getItem("daydone_tasks")) || [];
let today = new Date().toDateString();
let savedDate = localStorage.getItem("daydone_date");

if (savedDate && savedDate !== today) {
  if (confirm("New day, start fresh on DayDone?")) {
    tasks = [];
    localStorage.clear();
  }
}
localStorage.setItem("daydone_date", today);

const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const celebration = document.getElementById("celebration");

/* -------- TABS -------- */
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelector(".tab.active").classList.remove("active");
    tab.classList.add("active");

    document.querySelector(".section.active").classList.remove("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

/* -------- TASKS -------- */
function saveTasks() {
  localStorage.setItem("daydone_tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  tasks
    .filter(
      (t) =>
        filter === "all" ||
        (filter === "completed" ? t.completed : !t.completed),
    )
    .forEach((task) => {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      li.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""}>
        <span>${task.text}</span>
        <span class="delete">🗑</span>
      `;

      li.querySelector("input").onclick = () => {
        task.completed = !task.completed;
        saveTasks();
        updateProgress();
        renderTasks(filter);
      };

      li.querySelector(".delete").onclick = () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        saveTasks();
        updateProgress();
        renderTasks(filter);
      };

      taskList.appendChild(li);
    });
}

function updateProgress() {
  const done = tasks.filter((t) => t.completed).length;
  const total = tasks.length;

  progressText.textContent = `${done} of ${total} tasks completed`;
  const percent = total ? (done / total) * 100 : 0;
  progressFill.style.width = percent + "%";

  celebration.textContent = percent === 100 ? "🎉 DayDone!" : "";
}

document.getElementById("addTaskBtn").onclick = () => {
  if (!taskInput.value.trim()) return;

  tasks.push({
    id: Date.now(),
    text: taskInput.value,
    completed: false,
  });

  taskInput.value = "";
  saveTasks();
  updateProgress();
  renderTasks();
};

/* FILTERS */
document.querySelectorAll(".filters button").forEach((btn) => {
  btn.onclick = () => {
    document.querySelector(".filters .active").classList.remove("active");
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  };
});

/* REFLECTION */
document.getElementById("saveReflection").onclick = () => {
  localStorage.setItem(
    "daydone_reflection",
    document.getElementById("reflectionText").value,
  );
  alert("Reflection saved 🌙");
};

updateProgress();
renderTasks();
