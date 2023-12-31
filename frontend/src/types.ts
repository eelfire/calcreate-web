export type Course = {
    course_code: string,
    course_name: string,
    l: string,
    t: string,
    p: string,
    c: string,
    instructor: string,
    lecture: Slot[],
    tutorial: Slot[],
    lab: Slot[],
    links: string[],
}

// #[derive(Debug, Serialize, Deserialize)]
// struct Slot {
//     times: Vec<String>,
//     location: String,
// }

export type Slot = {
    times: string[],
    location: string,
}

export enum ClassType {
    Lecture,
    Tutorial,
    Lab
}
