const fs = require("fs");
const report = JSON.parse(
  fs.readFileSync(
    ".lighthouseci/portfolio.kuasar.xyz-20251204T175312.json",
    "utf8",
  ),
);

const audits = report.audits;
const categories = report.categories;

console.log("--- Low Score Audits (< 0.9) ---");
for (const [id, audit] of Object.entries(audits)) {
  if (audit.score !== null && audit.score < 0.9) {
    console.log(`Audit: ${audit.title} (${id})`);
    console.log(`Score: ${audit.score}`);
    console.log(`Description: ${audit.description}`);
    console.log(`Display Value: ${audit.displayValue}`);
    if (audit.details && audit.details.items) {
      console.log("Items:");
      audit.details.items.forEach((item) => {
        console.log(JSON.stringify(item, null, 2));
      });
    }
    console.log("---");
  }
}

console.log("\n--- Category Scores ---");
if (categories) {
  for (const [id, category] of Object.entries(categories)) {
    console.log(`Category: ${category.title} (${id})`);
    console.log(`Score: ${category.score}`);
    console.log("---");
  }
}
