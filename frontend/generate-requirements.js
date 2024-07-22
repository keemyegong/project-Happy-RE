const fs = require('fs');
const path = require('path');

// package.json 파일 경로
const packageJsonPath = path.resolve(__dirname, 'package.json');

// package.json 파일 읽기
const packageJson = require(packageJsonPath);

// dependencies 추출
const dependencies = packageJson.dependencies;
let requirements = '';

for (let pkg in dependencies) {
  requirements += `${pkg}\n`;
}

// requirements.txt 파일 생성
const requirementsPath = path.resolve(__dirname, 'requirements.txt');
fs.writeFileSync(requirementsPath, requirements);

console.log('requirements.txt has been generated.');
