function TaskList() {

  const tasks = [
    "Learning jsX",
    "Narayana ",
    "Building Components"
  ];

  return (
    <div>
      <h3>Tasks</h3>

      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>

    </div>
  );
}

export default TaskList;