import './App.css';
import tasks from './utils/data-tasks';
import Card from './components/Card/Card';

function App() {
    const todoTasks = tasks.filter((task) => task.status === 'todo');
    const inProgressTasks = tasks.filter((task) => task.status === 'in-progress');
    const doneTasks = tasks.filter((task) => task.status === 'done');

    return (
        <>
            <div>
                <h2>Todo tasks</h2>
                {todoTasks.map((item) => (
                    <Card
                        id={item.id}
                        title={item.title}
                        key={item.id}
                        points={item.points}
                    />
                ))}
            </div>
            <div>
                <h2>In progress</h2>
                {inProgressTasks.map((item) => (
                    <Card
                        id={item.id}
                        title={item.title}
                        key={item.id}
                        points={item.points}
                    />
                ))}
            </div>
            <div>
                <h2>Done</h2>
                {doneTasks.map((item) => (
                    <Card
                        id={item.id}
                        title={item.title}
                        key={item.id}
                        points={item.points}
                    />
                ))}
            </div>
        </>
    );
}

export default App;
