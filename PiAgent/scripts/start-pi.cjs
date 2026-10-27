const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');

const workspace = path.resolve(__dirname, '..');
process.chdir(workspace);
process.env.PI_CODING_AGENT_DIR = path.join(workspace, '.pi-agent');

const cli = path.join(workspace, 'node_modules', '@earendil-works', 'pi-coding-agent', 'dist', 'cli.js');
try {
  const upstreamPackage = JSON.parse(fs.readFileSync(path.join(workspace, 'upstream', 'packages', 'coding-agent', 'package.json'), 'utf8'));
  const runtimePackage = JSON.parse(fs.readFileSync(path.join(workspace, 'node_modules', '@earendil-works', 'pi-coding-agent', 'package.json'), 'utf8'));
  if (upstreamPackage.version !== runtimePackage.version) {
    throw new Error(`Pi source ${upstreamPackage.version} and runtime ${runtimePackage.version} differ.`);
  }
} catch (error) {
  console.error(`${error.message}\nRun PiAgent\\setup.cmd to initialize the submodule and install its matching release.`);
  process.exit(1);
}
process.argv[1] = cli;
import(pathToFileURL(cli).href).catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
