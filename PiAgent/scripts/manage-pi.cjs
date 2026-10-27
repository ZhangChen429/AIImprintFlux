const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const workspace = path.resolve(__dirname, '..');
const repository = path.dirname(workspace);
const upstream = path.join(workspace, 'upstream');
const action = process.argv[2];

function run(command, args, cwd = repository) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.status ?? result.signal}).`);
}

try {
  if (!['setup', 'update'].includes(action)) throw new Error('Usage: node scripts/manage-pi.cjs setup|update');
  // Windows cannot replace native modules while another Pi session has them loaded.
  if (process.platform === 'win32') {
    const nativeRoot = path.join(workspace, 'node_modules', '@earendil-works', 'pi-tui', 'native', 'win32');
    process.env.PI_NATIVE_CHECK_DIR = nativeRoot;
    run('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
      "$ErrorActionPreference = 'Stop'; if (Test-Path -LiteralPath $env:PI_NATIVE_CHECK_DIR) { foreach ($file in Get-ChildItem -LiteralPath $env:PI_NATIVE_CHECK_DIR -Filter '*.node' -Recurse) { try { $handle = [System.IO.File]::Open($file.FullName, 'Open', 'ReadWrite', 'None'); $handle.Dispose() } catch { Write-Error 'Close running Pi sessions before setup/update, then retry.'; exit 1 } } }"]);
    delete process.env.PI_NATIVE_CHECK_DIR;
  }
  if (!fs.existsSync(path.join(upstream, '.git'))) {
    run('git', ['submodule', 'update', '--init', '--recursive', '--', 'PiAgent/upstream']);
  }
  if (action === 'update') {
    const status = spawnSync('git', ['status', '--porcelain'], { cwd: upstream, encoding: 'utf8' });
    if (status.error) throw status.error;
    if (status.status !== 0 || status.stdout.trim()) {
      throw new Error('Pi upstream has local changes. Commit or resolve them before updating.');
    }
    run('git', ['fetch', '--no-tags', 'origin', '+refs/heads/stable:refs/remotes/origin/stable'], upstream);
    run('git', ['submodule', 'update', '--remote', '--no-fetch', '--checkout', '--', 'PiAgent/upstream']);
  }

  const sourcePackage = JSON.parse(fs.readFileSync(path.join(upstream, 'packages/coding-agent/package.json'), 'utf8'));
  const version = sourcePackage.version;
  if (sourcePackage.name !== '@earendil-works/pi-coding-agent' || !/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error('Expected an official stable Pi release with a numeric version.');
  }

  process.env.npm_config_cache = path.join(workspace, '.npm-cache');
  const packageFile = path.join(workspace, 'package.json');
  const installedConfig = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  const pinnedVersion = installedConfig.dependencies?.[sourcePackage.name];
  const npmArgs = pinnedVersion === version && fs.existsSync(path.join(workspace, 'package-lock.json'))
    ? ['ci', '--ignore-scripts', '--no-fund']
    : ['install', '--save-exact', '--ignore-scripts', '--no-fund', `${sourcePackage.name}@${version}`];

  // All arguments are fixed strings or the validated official package/version.
  if (process.platform === 'win32') {
    run(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', `npm.cmd ${npmArgs.join(' ')}`], workspace);
  } else {
    run('npm', npmArgs, workspace);
  }

  const agentDir = path.join(workspace, '.pi-agent');
  fs.mkdirSync(agentDir, { recursive: true });
  for (const [template, filename] of [['AGENTS.example.md', 'AGENTS.md'], ['settings.example.json', 'settings.json']]) {
    const destination = path.join(agentDir, filename);
    if (!fs.existsSync(destination)) fs.copyFileSync(path.join(workspace, 'config', template), destination, fs.constants.COPYFILE_EXCL);
  }
  run(process.execPath, [path.join(__dirname, 'start-pi.cjs'), '--version'], workspace);
  console.log(`Pi ${version} is ready. Start with PiAgent\\pi.cmd.`);
  if (action === 'update') console.log('Review and commit the submodule pointer and any package/lockfile changes to save this update.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
