// ANIMATION JS START

window.addEventListener('load', function () {
  const loader = document.querySelector('.loader');
  const content = document.querySelector('.content');

  const animationDuration = 3000;
  setTimeout(function () {
    loader.style.display = 'none';
    content.classList.remove('hidden');
  }, animationDuration);
});

// ANIMATION JS CLOSE

// LIGHT / DARK MODE JS

function toggleMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");
  const isDarkMode = body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);
}

const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedDarkMode = JSON.parse(localStorage.getItem("darkMode"));

if (storedDarkMode !== null) {
  if (storedDarkMode) {
    document.body.classList.add("dark-mode");
  }
} else if (userPrefersDark) {
  document.body.classList.add("dark-mode");
}

function toggleImage() {
  var imageButton = document.getElementById("dark_light");
  var buttonImage = document.getElementById("buttonImage");

  if (buttonImage.src.endsWith("https://cdn-icons-png.flaticon.com/128/4489/4489231.png")) { // image 1
    buttonImage.src = "https://cdn-icons-png.flaticon.com/128/1829/1829191.png";
    buttonImage.alt = "Image 2";
  } else {
    buttonImage.src = "https://cdn-icons-png.flaticon.com/128/4489/4489231.png";
    buttonImage.alt = "Image 1";
  }
}


// LIGHT / DARK MODE CLOSE

// JAVASCRIPT FOR START PROGRAMMING LANGUAGES

const languageSelector = document.getElementById('languageSelector');
const roadmapContainer = document.getElementById('roadmapContainer');

// Check if languageSelector and roadmapContainer exist
if (languageSelector && roadmapContainer) {
  languageSelector.addEventListener('change', function () {
    const selectedLanguage = this.value;
    const allRoadmaps = roadmapContainer.getElementsByClassName('roadmap');

    for (let i = 0; i < allRoadmaps.length; i++) {
      allRoadmaps[i].classList.remove('active');
    }

    if (selectedLanguage !== 'none') {
      const selectedRoadmap = document.getElementById(selectedLanguage);
      if (selectedRoadmap) {
        selectedRoadmap.classList.add('active');
      }
    }
  });
}

// 50 DSA Question Cheack point JS start
document.addEventListener('DOMContentLoaded', function () {
  const tasks = document.querySelectorAll('.task');
  let completedTasks = 0;

  tasks.forEach(task => {
    task.addEventListener('click', function () {
      if (task.classList.contains('completed')) {
        task.classList.remove('completed');
        completedTasks--;
      } else {
        task.classList.add('completed');
        completedTasks++;
      }
      updateProgress(completedTasks);
      saveProgress();
    });
  });

  function updateProgress(completedTasks) {
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const totalTasks = tasks.length;
    const progress = (completedTasks / totalTasks) * 100;

    const circumference = 2 * Math.PI * 40; // Adjusted radius
    const strokeDashOffset = circumference - (progress / 100) * circumference;

    progressBar.style.strokeDasharray = `${circumference} ${circumference}`;
    progressBar.style.strokeDashoffset = strokeDashOffset;

    progressText.textContent = `${progress.toFixed(0)}%`;
    document.getElementById('completedCount').textContent = completedTasks;
  }

  function saveProgress() {
    const completedTaskList = [];
    tasks.forEach(task => {
      if (task.classList.contains('completed')) {
        completedTaskList.push(task.textContent);
      }
    });
    localStorage.setItem('completedTasks', JSON.stringify(completedTaskList));
  }

  function loadProgress() {
    const completedTaskList = JSON.parse(localStorage.getItem('completedTasks'));
    if (completedTaskList) {
      tasks.forEach(task => {
        if (completedTaskList.includes(task.textContent)) {
          task.classList.add('completed');
          completedTasks++;
        }
      });
      updateProgress(completedTasks);
    }
  }

  loadProgress();
});


// 50 DSA Question Cheack point JS end

// Typing js start
const text = "Beyond the Basics Unlock Your Potential with Expert Interview Prep and Advanced Web Dev Classes!";

let index = 0;

function displayText() {
  document.getElementById('text').textContent = text.slice(0, index);
  index++;

  if (index > text.length) {
    index = 0;
  }
}

setInterval(displayText, 50);

// Typing js End

// Notification JS Start
document.addEventListener('DOMContentLoaded', function () {
  showNotification();
});

function showNotification() {
  const notification = document.getElementById('notification');
  notification.style.display = 'block';
}

function closeNotification() {
  const notification = document.getElementById('notification');
  notification.style.display = 'none';
}

// Notification JS End

// Search Bar Js Start
function searchQuestions() {
  var searchTerm = document.getElementById('search-bar').value.toLowerCase();
  var questions = document.getElementsByClassName('question-item');

  for (var i = 0; i < questions.length; i++) {
    var questionText = questions[i].innerText.toLowerCase();

    if (questionText.includes(searchTerm)) {
      questions[i].style.display = 'block';
    } else {
      questions[i].style.display = 'none';
    }
  }
}
// Search Bar JS End