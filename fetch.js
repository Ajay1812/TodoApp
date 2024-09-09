function renderTasks(tasks) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = ''; // Clear the current list

  tasks.forEach(task => {
    const tr = document.createElement('tr');

    // Create a cell for the title
    const titleCell = document.createElement('td');
    titleCell.textContent = task.title;

    // Create a cell for the description
    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = task.description;

    // Create a cell for the actions (edit, delete)
    const actionsCell = document.createElement('td');

    // Create a container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'action-buttons'; // Apply the inline-flex style

    // Create Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';
    editBtn.onclick = function() {
      editTask(task.id, task.title, task.description);
    };

    // Create Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = function() {
      deleteTask(task.id);
    };

    // Append buttons to the container
    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);

    // Append the button container to the actions cell
    actionsCell.appendChild(buttonContainer);

    // Append cells to the row
    tr.appendChild(titleCell);
    tr.appendChild(descriptionCell);
    tr.appendChild(actionsCell);

    // Append the row to the table body
    taskList.appendChild(tr);
  });
}


function fetchTasks() {
  fetch('http://localhost:3000/todos')
    .then(res => res.json())
    .then(data => {
      renderTasks(data);  // Call the function to render tasks
    })
    .catch(err => {
      console.error("Error fetching tasks: ", err);
    });
}

function parsedResponse(data) {
  console.log(data);
  fetchTasks();  // Fetch the updated list after posting a new task
}

function postCallback(res) {
  res.json().then(parsedResponse);
}

function onPost() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      description: description
    })
  }).then(postCallback);
}

// DELETE Task
function deleteTask(taskId) {
  fetch(`http://localhost:3000/todos/${taskId}`, {
    method: 'DELETE',
  })
    .then(res => {
      if (res.ok) {
        fetchTasks();  // Refresh the task list after deletion
      } else {
        console.error('Error deleting task');
      }
    })
    .catch(err => {
      console.error("Error deleting task: ", err);
    });
}

// Edit Task
function editTask(taskId, oldTitle, oldDescription) {
  // Populate inputs with the old values for editing
  document.getElementById('title').value = oldTitle;
  document.getElementById('description').value = oldDescription;

  // Change the Add button to Update
  const addButton = document.getElementById('add');
  addButton.textContent = 'Update';
  addButton.onclick = function() {
    onUpdate(taskId);  // Attach update event
  };
}

// Update Task (PUT Request)
function onUpdate(taskId) {
  const updatedTitle = document.getElementById('title').value;
  const updatedDescription = document.getElementById('description').value;
  fetch(`http://localhost:3000/todos/${taskId}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: updatedTitle,
      description: updatedDescription,
    })
  })
  .then(res => {
    if (res.ok) {
      // Reset the form and button state
      document.getElementById('title').value = '';
      document.getElementById('description').value = '';
      const addButton = document.getElementById('add');
      addButton.textContent = 'Add';
      addButton.onclick = onPost;

      fetchTasks();  // Refresh the task list after update
    } else {
      console.error('Error updating task');
    }
  })
  .catch(err => {
    console.error("Error updating task: ", err);
  });
}

// Call fetchTasks when the page loads to display the task list
window.onload = function() {
  fetchTasks();
};
