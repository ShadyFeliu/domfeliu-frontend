import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir: string, callback: (path: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) { 
      walkDir(dirPath, callback); 
    } else if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
      callback(dirPath);
    }
  });
}

const colors = ['purple', 'blue', 'magenta', 'green', 'bg'];

walkDir('./src', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replace [var(--color-df-X)] with df-X
  colors.forEach(col => {
    const regex = new RegExp(`\\[var\\(--color-df-${col}\\)\\]`, 'g');
    content = content.replace(regex, `df-${col}`);
  });

  // Replace bg-gradient-to-X with bg-linear-to-X
  content = content.replace(/bg-gradient-to-([trbl]{1,2})/g, 'bg-linear-to-$1');

  // Replace w-[1px] with w-px
  content = content.replace(/w-\[1px\]/g, 'w-px');

  // Replace -ml-0 with ml-0
  content = content.replace(/-ml-0/g, 'ml-0');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
});
