 const button = document.getElementById('button');
        const input = document.getElementById('inputtext');
        const deadlineInput = document.getElementById('deadline');
        const priorityInput = document.getElementById('Priority');
        const taskList = document.getElementById('task');
        const filterButtons = document.querySelectorAll('#filters button');

        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        function saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        function renderTasks(filter = 'all') {
            taskList.innerHTML = '';
            tasks.forEach((task, index) => {
                if (filter === 'completed' && !task.completed) return;
                if (filter === 'pending' && task.completed) return;

                const li = document.createElement('li');
                li.className = task.completed ? 'completed' : '';
                li.innerHTML = `
                    <div>
                        <strong>${task.text}</strong><br>
                        Deadline: ${task.deadline || 'N/A'} | Priority: ${task.priority}
                    </div>
                `;
                li.addEventListener('click', () => {
                    task.completed = !task.completed;
                    saveTasks();
                    renderTasks(filter);
                });

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'deletebutton';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    tasks.splice(index, 1);
                    saveTasks();
                    renderTasks(filter);
                });
                li.appendChild(deleteBtn);
                taskList.appendChild(li);
            });
        }

        button.addEventListener('click', () => {
            const taskText = input.value.trim();
            const deadline = deadlineInput.value;
            const priority = priorityInput.value;

            if (taskText === '') {
                alert("Please enter a task");
                return;
            }

            tasks.push({ text: taskText, deadline, priority, completed: false });
            input.value = '';
            deadlineInput.value = '';
            priorityInput.selectedIndex = 0;
            saveTasks();
            renderTasks();
        });

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderTasks(btn.getAttribute('data-filter'));
            });
        });

        renderTasks();