const tasksFromLS = JSON.parse(localStorage.getItem('tasks'))
let tasks = [];
if(tasksFromLS) {
  tasksFromLS.forEach((task) => {
    tasks.push(task)
  })
  updateTaskList();
  handleStats(false);
}



document
.getElementById("add-task")
.addEventListener("click", (e) => {
  e.preventDefault();
  addTask();
  handleStats(false);
});

function addTask() {
  const taskInputElement = document.getElementById("task-input");
  const taskText = taskInputElement.value;
  if(taskText) {
    taskInputElement.value = "";
    tasks.push({text: taskText, completed: false});
    updateTaskList();
  } 
}

function updateTaskList() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";  
  
  tasks.forEach((task,index) => {
    const taskItem = document.createElement("li"); 
    taskItem.addEventListener('click', (event) => {
      if(event.target.tagName != 'IMG' && event.target.tagName != 'INPUT') {
        const checkbox = document.getElementById("checkbox")
        checkbox.checked = !checkbox.checked; 
        toggleTaskCompleteChange(index);
      }
    });
    
    taskItem.addEventListener("change",() => toggleTaskCompleteChange(index) ); 

    taskItem.innerHTML = `
      <div class="task">
        <input id="checkbox" type="checkbox" ${task.completed ? 'checked' : ''}/>
        <p class="task-text ${task.completed ? 'completed' : ''}">${task.text}</p>
        <img src="./imgs/delete.svg" onclick="deleteTask(${index});"/>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
  updateLocaleStorage();

}

function toggleTaskCompleteChange(index) {
  tasks[index].completed = !tasks[index].completed;
  updateTaskList();
  handleStats(true);
}

function deleteTask(index) {
  let flag = true;
  if(tasks[index].completed) {
    flag = false;
  }
  tasks.splice(index,1);
  updateTaskList();
  handleStats(flag);
}

function handleStats(flag) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => { return task.completed}).length;
  const taskPercent = (completedTasks / totalTasks) * 100;

  document.getElementById("numbers").innerHTML = `${completedTasks} / ${totalTasks}`;
  if(totalTasks != 0 ) {
    document.getElementById("progress").style.width = `${taskPercent}%`;
  }else {
    document.getElementById("progress").style.width = '0%';
  }
  if(taskPercent === 100 && flag) {
    makeConfetti();
    playAudio();
  }
}

function updateLocaleStorage() {
  localStorage.setItem('tasks',JSON.stringify(tasks));
}

function playAudio() {
  let audio = new Audio("./sounds/sound_effect.mp3")
  audio.play()
}

function makeConfetti() {
  const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}