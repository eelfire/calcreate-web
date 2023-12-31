import { Course } from './types'
import { For, Resource, Show } from 'solid-js'

interface CourseTableProps {
    courses: Resource<Course[]>
}

function CourseTable({ courses }: CourseTableProps) {
    return (
        <>
            <h1>Course List</h1>
            <Show when={!courses.loading} fallback={<>Loading...</>}>
                <table>
                    <tbody>
                        <For each={courses()}>
                            {(course) => (
                                <tr>
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
                            )}
                        </For>
                    </tbody>
                </table>
            </Show>

            {/* <div>{JSON.stringify(courses(), null, 2)}</div> */}
        </>
    )
}

export default CourseTable