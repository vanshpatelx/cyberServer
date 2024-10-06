#!/usr/bin/env node

import { Command } from 'commander';
import simpleGit from 'simple-git';
import path from 'path';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import boxen from 'boxen';

// Initialize git
const git = simpleGit();

// Command-line program setup
const program = new Command();

// Futuristic header and design
const header = figlet.textSync('Cyber Server', { horizontalLayout: 'full' });
const headerBox = boxen(chalk.blue.bold(header), {
  padding: 1,
  margin: 1,
  borderStyle: 'double',
  borderColor: 'cyan',
  backgroundColor: 'black'
});

// Futuristic symbols and text
const subHeader = '🚀 Seamless and Secure Server Creation 🌐';
const authorInfo = '✨ by Vansh Patel & Team ✨';

const subHeaderBox = boxen(chalk.cyanBright(subHeader + '\n' + authorInfo), {
  padding: 1,
  margin: 1,
  borderStyle: 'single',
  borderColor: 'blue',
  backgroundColor: 'black'
});

// Display header and subheader
console.log(headerBox);
console.log(subHeaderBox);
console.log('\n');

// CLI description
program
  .version('1.0.0')
  .description('CLI for creating CyberServer projects');

program
  .command('create')
  .description('Create a new CyberServer project')
  .action(async () => {
    const repoUrls = {
      'HTTP Server': 'https://github.com/vanshpatelx/cyberServer.git',
      'GraphQL Server': 'https://github.com/vanshpatelx/cyberServer.git',
      'WebSocket Server': 'https://github.com/vanshpatelx/cyberServer.git',
    };

    const folderPaths = {
      'HTTP Server': 'packages/examples/http-server',
      'HTTP Cluster Server': 'packages/examples/http-cluster',
      'GraphQL Server': 'packages/examples/graphql-server',
      'WebSocket Server': 'packages/examples/websocket-server',
    };

    const { type, name } = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Choose the type of server you want to create:',
        choices: Object.keys(repoUrls),
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter the project name:',
        default: 'my-cyberserver-project',
      },
    ]);

    const repoUrl = repoUrls[type];
    const folderPath = folderPaths[type];
    const tempClonePath = path.join(process.cwd(), 'temp-repo');
    const projectPath = path.join(process.cwd(), name);

    fs.ensureDirSync(projectPath);
    console.log(chalk.green(`🔄 Cloning repository for ${type} into ${tempClonePath}`));
    await git.clone(repoUrl, tempClonePath);

    const sourcePath = path.join(tempClonePath, folderPath);
    console.log(chalk.yellow(`📂 Copying files from ${sourcePath} to ${projectPath}`));
    fs.copySync(sourcePath, projectPath);

    console.log(chalk.blue('🗑️ Removing temporary cloned repository...'));
    fs.removeSync(tempClonePath);

    process.chdir(projectPath);
    console.log(chalk.blue('🔧 Installing dependencies using Yarn...'));
    execSync('yarn install', { stdio: 'inherit' });

    console.log(chalk.green('🚀 Project created successfully!'));
  });

program.parse(process.argv);
