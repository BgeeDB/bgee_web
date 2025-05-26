const fs = require('fs');

const audit = [
  /**
   * put the results of the `yarn audit --json`
   */
];
const csv = ['Severity;Package version;Dependency;Path;Patched in'];
for (let i = 0; i < audit.length; ++i) {
  const { severity, module_name, findings, patched_versions } =
    audit[i].data.advisory;
  const issue = [severity, module_name, patched_versions];

  findings.forEach((f) => {
    f.paths.forEach((path) => {
      const dependency = path.substr(0, path.indexOf('>'));
      csv.push(
        [
          severity,
          `${module_name} ${f.version}`,
          dependency,
          path,
          patched_versions,
        ].join(';')
      );
    });
  });
}

try {
  const data = fs.writeFileSync('./audit.csv', csv.join('\n'));
  // file written successfully
  console.log('plop');
} catch (err) {
  console.error(err);
}
