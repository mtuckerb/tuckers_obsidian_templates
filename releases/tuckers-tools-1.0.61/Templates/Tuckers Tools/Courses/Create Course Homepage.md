---
course_id: <% courseId %>
course_name: <% courseName %>
course_term: <% courseSeason %> <% courseYear %>
course_year: <% courseYear %>
course_semester: <% courseSeason %>
content_type: course_homepage
school: University
school_abbreviation: U
created: <% tp.date.now("YYYY-MM-DD[T]HH:mm:ssZ") %>
tags: 
  - course_home
  - education
  - <% courseId %>
  - U/<% courseYear %>/<% courseSeason %>/<% courseId %>
---

<%*
const { exec } = require("child_process");
let courseName = await tp.system.prompt("Course Name (e.g. PSI-101 - Intro to Psych)")
let courseSeason = await tp.system.suggester(["Fall","Winter","Spring","Summer"],["Fall","Winter","Spring","Summer"], "Season")
let courseYear = await tp.system.prompt("Year")
let courseId = courseName.split(' - ')[0]
await tp.file.move(`/Courses/${courseYear}/${courseSeason}/${courseName}/${courseName}`)
try {await app.vault.createFolder(`/Courses/${courseYear}/${courseSeason}/${courseName}/Attachments`)} catch (e) {}
%>

# <% courseName %>

## Course Information
**Course ID**: <% courseId %>
**Term**: <% courseSeason %> <% courseYear %>
**School**: University

## Instructor
**Name**: 
**Email**: 
**Office Hours**: 

## Course Description

## Learning Objectives

## Required Texts
```meta-bind-js-view
{texts} as texts
---
const availableTexts = app.vault.getFiles().filter(file => file.extension == 'pdf').map(f => f?.name)
const escapeRegex = /[,`'()]/g;
options = availableTexts.map(t => `option([[${t.replace(escapeRegex,`\\$1`)}]], ${t.replace(escapeRegex,`\\$1`)})` )
const str = `\`INPUT[inlineListSuggester(${options.join(", ")}):texts]\``
return engine.markdown.create(str)
```

## Schedule

## Assignments

## Resources

## Vocabulary
```dataviewjs
// Vocabulary aggregation code would go here
```

## Due Dates
```dataviewjs
// Due dates aggregation code would go here
```
