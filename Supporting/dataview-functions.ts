/**
 * Dataview functions for Tuckers Tools
 * These functions provide enhanced processing capabilities for course vocabulary and due dates
 */

/**
 * Processes and displays course vocabulary from all notes associated with a course
 * @param dv - The dataview API object
 * @param courseId - The course identifier to search for
 */
export async function processCourseVocabulary(dv: any, courseId: string) {
    try {
        // Find all pages with the course ID tag
        const pages = dv.pages(courseId)
            .filter((p: any) => p.file.ext === "md" && p.file.name !== courseId)
            .map((p: any) => ({
                name: p.file.name,
                path: p.file.path
            }));

        // Process each page and extract vocabulary
        dv.header(1, "All Course Vocabulary");
        
        for (const page of pages) {
            if (!page.path) continue;
            
            try {   
                const file = await dv.app.vault.getFileByPath(page.path);
                const content = await dv.app.vault.read(file);
                
                // Extract vocabulary using regex
                const vocabRegex = /^#+ Vocabulary.*\n((?:.*?\n)*?)(?=\n\s*#|$)/m;
                const vocabMatches = content?.match(vocabRegex);

                if (vocabMatches) {
                    const vocabData = vocabMatches[1].trim();
                    const cleanedVocab = vocabData
                        .replace(/\[\[.*?\]\]/g, "")  // Remove wikilinks
                        .trim()
                        .split("\n")
                        .filter((line: string) => line.startsWith("- "))  // Only lines starting with "- "
                        .map((line: string) => line.substring(2))  // Remove "- " prefix
                        .filter(Boolean);  // Remove empty entries

                    if (cleanedVocab.length > 0) {
                        dv.header(3, `[[${page.name}]]`);
                        dv.list(cleanedVocab);
                    }
                }

            } catch (e) {
                console.log(`Error processing ${page.path}:`, e);
                continue;
            }
        }

    } catch (error) {
        console.error("Error in Vocabulary Processing:", error);
    }
}

/**
 * Processes and displays due dates from all notes associated with a course
 * @param dv - The dataview API object
 * @param source - The tag or path to search for due dates
 * @param startDate - Optional start date for filtering (YYYY-MM-DD format)
 * @param endDate - Optional end date for filtering (YYYY-MM-DD format)
 */
export async function processDueDates(dv: any, source: string, startDate: string | null = null, endDate: string | null = null) {
    function deduplicateFirstTwoColumns(arr: any[]) {
        const seen = new Set();
        return arr.filter((entry: any) => {
            const key = JSON.stringify([entry[0], entry[1]]);
            return !seen.has(key) && seen.add(key);
        });
    }

    // If no date range is specified, default to showing dates starting from yesterday
    const defaultStartDate = (window as any).moment().subtract(1, "day").format("YYYY-MM-DD");
    const start = startDate || defaultStartDate;
    const end = endDate || (window as any).moment().add(1, "year").format("YYYY-MM-DD"); // Show a year of dates by default

    const pages = await dv.pages(source)
        .filter((p: any) => p.file.name !== source && p.file.ext == "md");

    let allEntries: any[] = [];

    for (const page of pages.values) {
        if (!page?.file?.path) { return }
        const content = await (dv.app.vault as any).cachedRead((dv.app.vault as any).getFileByPath(page.file?.path));
        const regex = /# Due Dates([\s\S]*?)(?=\n#|$)/;
        const matches = content?.match(regex);
        if (matches) {
        const tableData = matches[1].trim();
        const lines = tableData.split("\n").slice(1);
        for (const line of lines) {
            let formattedDueDate: string;
            const columns = line
            .split("|")
            .map((c: string) => c.trim())
            .filter((c: string) => c);
            let [dueDate, assignment] = columns;
            if (!Date.parse(dueDate) || assignment?.match(/✅/)) {
            continue;
            }
            assignment = assignment?.match(/[A-Z]{3}-[0-9]{3}/)
            ? assignment
            : `#${page.course_id} - ${assignment}`;
            
            if (
            (window as any).moment(dueDate).isBetween(start, end, undefined, "[]")  // include endpoints
            ) {
            const uniqueRow = !allEntries.some(
                (e: any) =>
                e[0].match((window as any).moment(dueDate)?.format("YYYY-MM-DD")) &&
                e[1] == assignment
            );
            if (assignment && uniqueRow) {
                if ((window as any).moment(dueDate)?.isBefore(start)) {
                continue;
                } else if ((window as any).moment(dueDate).isAfter((window as any).moment().subtract(1, "w"))) {
                formattedDueDate = `<span class="due one_week">${(window as any).moment(
                    dueDate
                )?.format("YYYY-MM-DD ddd")}</span>`;
                } else if ((window as any).moment(dueDate).isAfter((window as any).moment().subtract(2, "w"))) {
                formattedDueDate = `<span class="due two_weeks">${(window as any).moment(
                    dueDate
                )?.format("YYYY-MM-DD ddd")}</span>`;
                } else {
                formattedDueDate = (window as any).moment(dueDate)?.format("YYYY-MM-DD ddd");
                }
                allEntries.push([
                dueDate,
                formattedDueDate,
                assignment,
                `[[${page?.file?.path}|${page?.file?.name}]]`,
                ]);
            }
            }
        }
        }
    }

    const sortedRows = deduplicateFirstTwoColumns(allEntries
        .sort((a: any, b: any) => (window as any).moment(a[0]).valueOf() - (window as any).moment(b[0]).valueOf() ) 
        .map((a: any) => [a[1], a[2], a[3]])
    );
    
    const table = dv.markdownTable( ["Due Date", "Task Description", "File"], sortedRows );
    dv.el("table", table);
}
