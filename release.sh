#!/usr/bin/env bash

# Release script for Tuckers Tools plugin

echo "Creating release for Tuckers Tools plugin..."

# Get version from manifest.json
VERSION=$(grep -o '"version": "[^"]*"' manifest.json | cut -d'"' -f4)

echo "Current version: $VERSION"

# Create release directory
RELEASE_DIR="releases/tuckers-tools-$VERSION"
mkdir -p "$RELEASE_DIR"

# Copy necessary files
cp main.js "$RELEASE_DIR/"
cp manifest.json "$RELEASE_DIR/"
cp styles.css "$RELEASE_DIR/"
cp README.md "$RELEASE_DIR/"

# Create Templates directory structure
TEMPLATES_DIR="$RELEASE_DIR/Templates/Tuckers Tools"
mkdir -p "$TEMPLATES_DIR/Courses"
mkdir -p "$TEMPLATES_DIR/Modules"
mkdir -p "$TEMPLATES_DIR/Chapters"
mkdir -p "$TEMPLATES_DIR/Assignments"
mkdir -p "$TEMPLATES_DIR/Daily"
mkdir -p "$TEMPLATES_DIR/Utilities"

# Create sample template files
cat > "$TEMPLATES_DIR/Courses/Create Course Homepage.md" << 'EOF'
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
EOF

cat > "$TEMPLATES_DIR/Courses/Course Index.md" << 'EOF'
---
content_type: course_index
tags:
  - index
---

# Course Index

## Modules

## Chapters

## Assignments

## Resources

## Vocabulary

## Due Dates
EOF

cat > "$TEMPLATES_DIR/Modules/Create Module.md" << 'EOF'
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
EOF

cat > "$TEMPLATES_DIR/Chapters/Create Chapter.md" << 'EOF'
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
EOF

cat > "$TEMPLATES_DIR/Assignments/Create Assignment.md" << 'EOF'
---
course_id: <% courseId %>
assignment_type: <% assignmentType %>
due_date: <% dueDate %>
points: <% points %>
content_type: assignment
parent_course: "[[<% course %>]]"
created: <% tp.date.now("YYYY-MM-DD[T]HH:mm:ssZ") %>
status: pending
tags:
  - education
  - <% courseId %>
  - assignment
---

# <% assignmentName %> - <% courseId %>

## Description

## Instructions

## Due Date
**Assigned**: <% tp.date.now("YYYY-MM-DD") %>
**Due**: <% dueDate %>

## Submission

## Grading Criteria

## Resources
EOF

cat > "$TEMPLATES_DIR/Daily/Daily Note.md" << 'EOF'
---
content_type: daily_note
date: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - daily
  - <% tp.date.now("YYYY") %>
  - <% tp.date.now("MM") %>
  - <% tp.date.now("DD") %>
---

# <% tp.date.now("YYYY-MM-DD - dddd") %>

<< [[<% tp.date.yesterday("YYYY-MM-DD") %>]] | [[<% tp.date.tomorrow("YYYY-MM-DD") %>]] >>

## Today's Focus

## Courses Worked On
- 

## Tasks Completed
- [ ] 

## Vocabulary Reviewed
- 

## Assignments Due
- 

## Learning Achievements

## Challenges

## Tomorrow's Plan

## Reflection
EOF

cat > "$TEMPLATES_DIR/Utilities/Vocabulary Entry.md" << 'EOF'
## <% term %>
**Term**: <% term %>
**Part of Speech**: 
**Definition**: 
**Context**: 
**Examples**: 
**Related Terms**: 
**See Also**:
EOF

cat > "$TEMPLATES_DIR/Utilities/Due Date Entry.md" << 'EOF'
| <% dueDate %> | <% assignment %> | <% status %> |
EOF

cat > "$TEMPLATES_DIR/README.md" << 'EOF'
# Tuckers Tools Templates

This directory contains templates for the Tuckers Tools Obsidian plugin.

## Template Categories

- **Courses**: Templates for creating and organizing courses
- **Modules**: Templates for course modules
- **Chapters**: Templates for chapter notes
- **Assignments**: Templates for assignments
- **Daily**: Templates for daily notes
- **Utilities**: Helper templates

## Usage

These templates are designed to work with the Tuckers Tools plugin. To use them:

1. Install the Tuckers Tools plugin
2. Configure your settings in the plugin settings tab
3. Use the "Insert Template" command to apply these templates to new notes

## Customization

Feel free to customize these templates to suit your needs. The plugin will not overwrite your changes when updating templates.
EOF

# Create zip file if zip command is available, otherwise create tar.gz
if command -v zip &> /dev/null; then
    cd releases
    zip -r "tuckers-tools-$VERSION.zip" "tuckers-tools-$VERSION"
    echo "Release created: releases/tuckers-tools-$VERSION.zip"
elif command -v tar &> /dev/null; then
    cd releases
    tar -czf "tuckers-tools-$VERSION.tar.gz" "tuckers-tools-$VERSION"
    echo "Release created: releases/tuckers-tools-$VERSION.tar.gz"
else
    echo "Neither zip nor tar command found. Release directory created at: $RELEASE_DIR"
fi