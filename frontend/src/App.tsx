import { Show, createResource, createSignal } from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Course } from './types'
// import CourseTable from './CourseTable'
import WeekView from './WeekView'

const fetchCourses = async () => {
    const response = await fetch('http://localhost:3000/api/courses');
    const json = await response.json();
    return json as Course[];
}

function App() {
    const [count, setCount] = createSignal(0)
    const [courses] = createResource<Course[]>(fetchCourses)

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} class="logo" alt="Vite logo" />
                </a>
                <a href="https://solidjs.com" target="_blank">
                    <img src={solidLogo} class="logo solid" alt="Solid logo" />
                </a>
            </div>
            <h1>Vite + Solid</h1>
            <div class="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count()}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p class="read-the-docs">
                Click on the Vite and Solid logos to learn more
            </p>

            <hr></hr>

            <Show when={!courses.loading} fallback={<>Loading...</>}>
                <WeekView courses={courses} />
            </Show>


            <hr></hr>

            {/* <CourseTable courses={courses} /> */}
        </>
    )
}

export default App
