import fs from "fs";
import path from "path";

export type TriageRule = {
  conditions: {
    type?: string;
    location?: string;
    department?: string;
  };
  assignee: string;
};

const RULES_PATH = path.join(__dirname, "rules.json");

export function loadRules() {
  try {
    const raw = fs.readFileSync(RULES_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveRules(rules: TriageRule[]) {
  fs.writeFileSync(RULES_PATH, JSON.stringify(rules, null, 2), "utf-8");
}
