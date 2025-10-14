---
course_id: <% courseId %>
module_number: <% moduleNumber %>
week_number: <% weekNumber %>
class_day: <% dayOfWeek %>
content_type: module
parent_course: "[[<% course %>]]"
created: <% tp.date.now("YYYY-MM-DD[T]HH:mm:ssZ") %>
tags:
  - education
  - <% courseId %>
  - module
---

<%*
const { season, moduleNumber, weekNumber, course, courseId, discipline, dayOfWeek } = await tp.user.new_module(app, tp, "2025");
let title = courseId
if (moduleNumber && weekNumber) { title = `M${moduleNumber}/W${weekNumber}`}
else if (moduleNumber) { title = `M${moduleNumber}` } 
else if (weekNumber) { title = `W${weekNumber}`}
%>

# [[<% course %>]] - <% title %> - <% dayOfWeek %>

## Learning Objectives

## Reading Assignment

## Lecture Notes

## Discussion Questions

## Assignments
| Date | Assignment | Status |
| ---- | ---------- | ------ |
|      |            |        |

## Vocabulary

## Additional Resources
