const fs = require("fs");
const glob = require("glob");

const files = glob
  .sync("src/content/cvExperience/*.md")
  .concat(glob.sync("src/content/cvEducation/*.md"));

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");

  content = content.replace(/role:\s*"([^"]+)"/, (match, roleStr) => {
    const str = roleStr.trim();
    const fixes = {
      "Head of Communication": "Head of communication",
      "Creative & Independent Developer": "Creative & independent developer",
      "Audiovisual Producer & Director (Independent)":
        "Audiovisual producer & director (independent)",
      "Civil Service IT Adult Trainer": "Civil service IT adult trainer",
      "Signal Transmission Soldier": "Signal transmission soldier",
      "Surgical Unit IT Specialist": "Surgical unit IT specialist",
      "IT Intern": "IT intern",
      "Co-founder (Independent)": "Co-founder (independent)",
      "Co-fondateur (Indépendant)": "Co-fondateur (indépendant)",
      "Digital Marketing Intern": "Digital marketing intern",
    };

    return `role: "${fixes[str] || str}"`;
  });

  content = content.replace(/company:\s*"([^"]+)"/, (match, companyStr) => {
    const str = companyStr.trim();
    const fixes = {
      "Personal Projects, Canada": "Personal projects, Canada",
    };
    return `company: "${fixes[str] || str}"`;
  });

  fs.writeFileSync(file, content, "utf8");
});
