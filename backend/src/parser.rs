use csv::Reader;
use dotenvy::dotenv;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::{env, error::Error};

#[rustfmt::skip]
#[derive(Debug, Deserialize)]
pub struct CourseIn {
    #[serde(rename = "Course Code")] pub course_code: Option<String>,
    #[serde(rename = "Course Name")] pub course_name: Option<String>,
    #[serde(rename = "L")] pub l: Option<String>,
    #[serde(rename = "T")] pub t: Option<String>,
    #[serde(rename = "P")] pub p: Option<String>,
    #[serde(rename = "C")] pub c: Option<String>,
    #[serde(rename = "Instructor")] pub instructor: Option<String>,
    #[serde(rename = "Number of Students")] pub number_of_students: Option<String>,
    #[serde(rename = "Sections")] pub sections: Option<String>,
    #[serde(rename = "Lecture")] pub lecture: Option<String>,
    #[serde(rename = "Tutorial")] pub tutorial: Option<String>,
    #[serde(rename = "Lab")] pub lab: Option<String>,
    #[serde(rename = "Course Plan")] pub course_plan: Option<String>,
    #[serde(rename = "links")] pub links: Option<String>,
    #[serde(rename = "Preferred Knowledge Equivalent to")] pub requirements: Option<String>,
    #[serde(rename = "Remark")] pub remark: Option<String>,
    #[serde(rename = "Minor in")] pub minor_in: Option<String>,
    #[serde(rename = "HSS/BS elective")] pub hss_ms: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct CourseOut {
    course_code: String,
    course_name: String,
    l: String,
    t: String,
    p: String,
    c: String,
    instructor: String,
    lecture: Vec<Slot>,
    tutorial: Vec<Slot>,
    lab: Vec<Slot>,
    links: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Slot {
    times: Vec<String>,
    location: String,
}

impl CourseOut {
    fn new(course: &CourseIn) -> CourseOut {
        CourseOut {
            course_code: course.course_code.clone().unwrap_or_else(|| "".to_string()),
            course_name: course.course_name.clone().unwrap_or_else(|| "".to_string()),
            l: course.l.clone().unwrap_or_else(|| "".to_string()),
            t: course.t.clone().unwrap_or_else(|| "".to_string()),
            p: course.p.clone().unwrap_or_else(|| "".to_string()),
            c: course.c.clone().unwrap_or_else(|| "".to_string()),
            instructor: course.instructor.clone().unwrap_or_else(|| "".to_string()),
            lecture: parse_slots(&course.lecture),
            tutorial: parse_slots(&course.tutorial),
            lab: parse_slots(&course.lab),
            links: parse_links(&course.links),
        }
    }
}

fn parse_slots(slots: &Option<String>) -> Vec<Slot> {
    let mut slots_out = Vec::new();

    if slots.is_none() {
        return slots_out;
    }
    let slots_v = slots
        .as_ref()
        .unwrap()
        .lines()
        .map(|line| line.to_string())
        .collect::<Vec<String>>();

    slots_v.chunks(2).for_each(|x| {
        let times = x[0]
            .split(',')
            .map(|x| x.to_string())
            .collect::<Vec<String>>();
        let location = x[1].to_string();
        slots_out.push(Slot { times, location });
    });

    slots_out
}

fn parse_links(links: &Option<String>) -> Vec<String> {
    if links.is_none() {
        return Vec::new();
    }
    let links_v = links
        .as_ref()
        .unwrap()
        .split_whitespace()
        .map(|x| x.to_string())
        .collect::<Vec<String>>();

    links_v
}

pub fn parse() -> Result<Value, Box<dyn Error>> {
    dotenv().ok();
    let csv_path = env::var("CSV_FILE").unwrap();
    let mut rdr = Reader::from_path(csv_path).unwrap();

    let mut courses_in = Vec::new();

    for result in rdr.deserialize() {
        let course: CourseIn = result?;
        courses_in.push(course);
    }

    let one_course = &courses_in[197];
    println!("{:?}", one_course);

    let mut slots = Vec::new();
    let mut locations = Vec::new();

    let one_lecture = one_course.lecture.clone().unwrap();
    let one_lecture_v = one_lecture.lines().collect::<Vec<&str>>();

    one_lecture_v.chunks(2).for_each(|x| {
        slots.push(x[0]);
        locations.push(x[1]);
    });

    println!("{:?}", slots);
    println!("{:?}", locations);
    println!();

    let mut courses_out = Vec::new();
    for course in courses_in {
        let check = CourseOut::new(&course);
        courses_out.push(check);
    }

    let check_json = serde_json::to_value(&courses_out).unwrap();
    // println!("{}", check_json);
    // let output_json = "./db/output.json";
    // std::fs::write(output_json, &check_json)?;

    Ok(check_json)
    // Ok(())
}
