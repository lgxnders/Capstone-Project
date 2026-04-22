import fs from "fs";
import path from "path";
import prompts from "prompts";
import { v4 as uuidv4 } from "uuid";
import { Resource } from "../types/resource";


const resourceFile = path.join(__dirname, "../../data/resources.json");

const loadResources = (): Resource[] => {
    if (!fs.existsSync(resourceFile)) {
        fs.writeFileSync(resourceFile, "[]", "utf-8");
        return [];
    }

    const content = fs.readFileSync(resourceFile, "utf-8").trim();
    if (!content) {
        fs.writeFileSync(resourceFile, "[]", "utf-8");
        return [];
    }

    return JSON.parse(content) as Resource[];
};

const saveResources = (resources: Resource[]) => {
    fs.writeFileSync(resourceFile, JSON.stringify(resources, null, 2), "utf-8");
};

async function main() {
  const resources = loadResources();

  const response = await prompts([
        {
            type: "text",
            name: "title",
            message: "Resource title:",
            validate: value => value ? true : "Title cannot be empty"
        },
        {
            type: "text",
            name: "url",
            message: "Resource URL:",
            validate: value => {
                if (!value) return "URL cannot be empty";
                if (resources.some(r => r.url === value)) return "URL already exists!";
                return true;
            }
        },
        { type: "text", name: "description", message: "Description:" },
        {
            type: "select",
            name: "type",
            message: "Resource type:",
            choices: [
                { title: "Article", value: "article" },
                { title: "Video", value: "video" },
                { title: "Tool", value: "tool" },
                { title: "Exercise", value: "exercise" },
                { title: "Course", value: "course" },
                { title: "Community", value: "community" }
            ]
        },
        { type: "text", name: "topics", message: "Topics (comma-separated):" },
        { type: "text", name: "tags", message: "Tags (comma-separated):" },
        { type: "text", name: "targetStates", message: "Target states (comma-separated):" },
        { type: "number", name: "timeEstimate", message: "Time estimate in minutes (optional):" },
        {
            type: "select",
            name: "accessLevel",
            message: "Access level:",
            choices: [
                { title: "Low", value: "low" },
                { title: "Medium", value: "med" },
                { title: "High", value: "high" }
            ]
        },
        {
            type: "select",
            name: "credibilityLevel",
            message: "Credibility level (optional):",
            choices: [
                { title: "Skip", value: undefined },
                { title: "Low", value: "low" },
                { title: "Medium", value: "med" },
                { title: "High", value: "high" }
            ]
        }
  ]);

  const newResource: Resource = {
        id:                 uuidv4(),
        title:              response.title,
        url:                response.url,
        description:        response.description,
        type:               response.type,
        topics:             response.topics.split(",").map((t: string) => t.trim()),
        tags:               response.tags.split(",").map((t: string) => t.trim()),
        targetStates:       response.targetStates.split(",").map((t: string) => t.trim()),
        timeEstimate:       response.timeEstimate || undefined,
        accessLevel:        response.accessLevel,
        credibilityLevel:   response.credibilityLevel,
        embedding:          []
  };

  resources.push(newResource);
  saveResources(resources);

  console.log("\n Resource has been added to the database.");
  console.log(`Title: ${newResource.title}`);
  console.log(`URL: ${newResource.url}`);
}

main();