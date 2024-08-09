#!/usr/bin/env node

const { Command } = require('commander');
const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const inquirer = require('inquirer');

const git = simpleGit();

const program = new Command();
program
  .version('1.0.0')
  .description('CLI for creating CyberServer projects');

program
  .command('create')
  .description('Create a new CyberServer project')
  .action(async () => {
    const repoUrls = {
      'HTTP Server': 'https://github.com/your-username/http-server-repo.git',
      'GraphQL Server': 'https://github.com/your-username/graphql-server-repo.git',
      'WebSocket Server': 'https://github.com/your-username/websocket-server-repo.git',
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
    const projectPath = path.join(process.cwd(), name);

    fs.ensureDirSync(projectPath);
    console.log(`Cloning repository for ${type} into ${projectPath}`);
    await git.clone(repoUrl, projectPath);

    process.chdir(projectPath);
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    console.log('Project created successfully!');
  });

program.parse(process.argv);
