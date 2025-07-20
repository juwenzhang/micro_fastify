import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      traverseDir(filePath);
    } else if (stats.isFile() && path.extname(file) === '.js') {
      fixImports(filePath);
    }
  });
}

// 替换文件中的 .ts 导入为 .js
function fixImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/from\s+['"](.+?)\.ts['"]/g, 'from \'$1.js\'');
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

console.log('Starting to fix imports...');
traverseDir(distDir);
console.log('Import fixing completed.');