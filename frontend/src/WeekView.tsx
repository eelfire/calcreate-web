import { Accessor, For, Match, Resource, Setter, Show, Switch, createSignal } from 'solid-js'
import { Course, ClassType } from './types'

const slots = [
    ["8:30 – 9:50", "A1", "B1", "A2", "C2", "B2"],
    ["10:00 - 11:20", "C1", "D1", "E1", "D2", "E2"],
    ["11:30 - 12:50", "F1", "G1", "H2", "F2", "G2"],
    ["13:00 - 14:00", "T1", "T2", "T3", "O1", "O2"],
    ["14:00 - 15:20", "I1", "J1", "I2", "K2", "J2"],
    ["15:30 - 16:50", "K1", "L1", "M1", "L2", "M2"],
    ["17:00 - 18:20", "H1", "N1", "P1", "N2", "P2"]
]


interface WeekViewProps {
    courses: Resource<Course[]>
}

interface SearchableCourseProps {
    courses: Resource<Course[]>;
    selected: Accessor<Course[]>;
    setSelected: Setter<Course[]>;
}

function SearchableCourse({ courses, setSelected }: SearchableCourseProps) {
    const [searchTerm, setSearchTerm] = createSignal('');

    return (
        <>
            <div class="m-2">
                <input class="w-80 border rounded-md p-1" type="text" placeholder="Search..." onInput={(e) => setSearchTerm(e.currentTarget.value)} />
            </div>
            <div class="SearchableList">
                <table>
                    <thead>
                        <tr>
                            <th>Add/Remove</th>
                            <th>Course Code</th>
                            <th>Course Name</th>
                            <th>L</th>
                            <th>T</th>
                            <th>P</th>
                            <th>C</th>
                            <th>Instructor</th>
                            <th>Lecture</th>
                            <th>Tutorial</th>
                            <th>Lab</th>
                            <th>Links</th>
                        </tr>
                    </thead>
                    <tbody>

                        <For each={courses()}>
                            {(course) => (
                                <Show when={
                                    course.course_code.toLowerCase().includes(searchTerm().toLowerCase())
                                    || course.course_name.toLowerCase().includes(searchTerm().toLowerCase())
                                }>
                                    <tr>
                                        <td>
                                            <button onClick={() => setSelected((selected) => [...selected, course])}>
                                                +
                                            </button>
                                            {/* <input type="checkbox" onClick={() => {
                                                if (selected().includes(course)) {
                                                    setSelected((selected) => selected.filter((selectedCourse) => selectedCourse !== course))
                                                } else
                                                    setSelected((selected) => [...selected, course])
                                            }} /> */}
                                        </td>
                                        <td>{course.course_code}</td>
                                        <td>{course.course_name}</td>
                                        <td>{course.l}</td>
                                        <td>{course.t}</td>
                                        <td>{course.p}</td>
                                        <td>{course.c}</td>
                                        <td>{course.instructor}</td>
                                        <td>{course.lecture.map(
                                            (lecture) => <>{lecture.times.join(", ")} : {lecture.location}</>
                                        )}</td>
                                        <td>{course.tutorial.map(
                                            (tutorial) => <>{tutorial.times.join(", ")} : {tutorial.location}</>
                                        )}</td>
                                        <td>{course.lab.map(
                                            (lab) => <>{lab.times.join(", ")} : {lab.location}</>
                                        )}</td>
                                        <td>{course.links.map(
                                            (link) => <><a href={link} target="_blank">Link</a><br /></>
                                        )}</td>
                                    </tr>
                                </Show>
                            )}
                        </For>

                    </tbody>
                </table>
            </div>
        </>
    )
}

function totalCredits(selected: Accessor<Course[]>) {
    let total = 0
    selected().forEach((course) => {
        total += parseInt(course.c)
    })
    return total
}

function totalHours(selected: Accessor<Course[]>) {
    let total = 0
    selected().forEach((course) => {
        total += parseFloat(course.l) + parseFloat(course.t) + parseFloat(course.p)
    })
    return total
}

function WeekView({ courses }: WeekViewProps) {
    const [selected, setSelected] = createSignal<Course[]>([])
    const [type, setType] = createSignal(ClassType.Lecture)

    return (
        // week view in table format with each day as a column and each row as a time slot of 1 hour 30 minutes
        // Slot	            M	T	W	Th	F
        // 0 8:30 – 9:50	A1	B1	A2	C2	B2
        // 1 10:00 - 11:20	C1	D1	E1	D2	E2
        // 2 11:30 - 12:50	F1	G1	H2	F2	G2
        // 3 13:00 - 14:00	T1	T2	T3	O1	O2
        // 4 14:00 - 15:20	I1	J1	I2	K2	J2
        // 5 15:30 - 16:50	K1	L1	M1	L2	M2
        // 6 17:00 - 18:20	H1	N1	P1	N2	P2
        <>
            <h1>
                Week View
            </h1>
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                    </tr>
                </thead>
                <tbody>
                    <For each={slots}>{(slot) => (
                        <tr>
                            <td>{slot[0]}</td>
                            <For each={slot.slice(1)}>{(slot) => (
                                // if slot is not empty, find the course that matches the slot and display it
                                <td>
                                    {slot}<br />
                                    <For each={selected()}>{(course) => (
                                        <Show when={course.lecture.find((slots) => {
                                            setType(ClassType.Lecture)
                                            return slots.times.includes(slot)
                                        }) || course.tutorial.find((slots) => {
                                            setType(ClassType.Tutorial)
                                            return slots.times.includes(slot)
                                        }
                                        ) || course.lab.find((slots) => {
                                            setType(ClassType.Lab)
                                            return slots.times.includes(slot)
                                        }
                                        )}>
                                            <div>{course.course_code} : {course.course_name} :
                                                <Switch>
                                                    <Match when={type() === ClassType.Lecture}> Lec</Match>
                                                    <Match when={type() === ClassType.Tutorial}> Tut</Match>
                                                    <Match when={type() === ClassType.Lab}> Lab</Match>
                                                </Switch>
                                            </div>
                                        </Show>
                                    )}</For>
                                </td>
                            )}
                            </For>
                        </tr>
                    )}
                    </For>
                </tbody>
            </table>

            <hr></hr>

            <h2>Selected Courses</h2>
            <div>
                <div>
                    <div>Total Credits: {totalCredits(selected)}</div>
                    <div>Total hrs/week: {totalHours(selected)}</div>
                </div>
                <For each={selected()}>
                    {(course) => (
                        <div>
                            <button onClick={() => setSelected((selected) => selected.filter((selectedCourse) => selectedCourse !== course))}>
                                X
                            </button>
                            {course.course_code} : {course.course_name} : {course.c}
                        </div>
                    )}
                </For>
            </div>

            {/* <For each={courses()} fallback={<>Loading...</>}>
                {(course) => (
                    <button onClick={() => setSelected((selected) => [...selected, course])}>
                        {course.course_code} - {course.course_name}
                    </button>
                )}
            </For> */}

            <hr></hr>

            <SearchableCourse courses={courses} selected={selected} setSelected={setSelected} />

        </>
    )
}

export default WeekView