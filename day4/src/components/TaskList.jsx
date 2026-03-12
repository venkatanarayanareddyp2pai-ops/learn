function TaskList() {

  const tasks = [
    "Learn JSX",
    "Understand Props",
    "Practice useState",
    "Build Components"
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