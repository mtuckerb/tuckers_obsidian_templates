import fs from 'fs/promises';
import { execSync } from 'child_process';

async function main() {
  const manifestPath = 'manifest.json';
  const versionsPath = 'versions.json';
  
  // Read manifest
  const manifestBuffer = await fs.readFile(manifestPath);
  const manifest = JSON.parse(manifestBuffer.toString());
  
  // Get new version from command line or increment patch version
  const newVersion = process.argv[2] || incrementVersion(manifest.version);
  
  // Update manifest
  manifest.version = newVersion;
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  
  // Update versions.json
  const versionsBuffer = await fs.readFile(versionsPath);
  const versions = JSON.parse(versionsBuffer.toString());
  versions[newVersion] = manifest.minAppVersion;
  await fs.writeFile(versionsPath, JSON.stringify(versions, null, 2));
  
  // Commit changes
  execSync('git add manifest.json versions.json');
  execSync(`git commit -m "Version bump to ${newVersion}"`);
  
  console.log(`Version bumped to ${newVersion}`);
}

function incrementVersion(version) {
  const parts = version.split('.');
  const patch = parseInt(parts[2]) + 1;
  return `${parts[0]}.${parts[1]}.${patch}`;
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});