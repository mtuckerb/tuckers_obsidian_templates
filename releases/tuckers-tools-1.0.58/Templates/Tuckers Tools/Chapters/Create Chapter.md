---
course_id: <% courseId %>
chapter_number: <% chapterNumber %>
content_type: chapter
parent_course: "[[<% course %>]]"
text_reference: "[[<% text %>]]"
created: <% tp.date.now("YYYY-MM-DD[T]HH:mm:ssZ") %>
tags:
  - education
  - <% courseId %>
  - chapter
---

<%*
const { chapterNumber, course, courseId, discipline, text} = await tp.user.new_chapter(tp);
%>

# [[<% text %>]] - Chapter <% chapterNumber %>

## Summary

## Key Concepts

## Vocabulary
- 

## Notes

## Discussion Questions

## Further Reading
