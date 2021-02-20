#!/usr/bin/env node

const program = require('commander');
const prompt = require('prompt');
const pkg = require('../../package.json');
const scraper = require('../scraper');

function getArgumentValues(args) {
  const argumentReceivedValues = program
    .version(pkg.version, '-v, --version')
    .usage('[options] [-u email] [-p password]')
    .option('-u, --email <linkedin_handle>', 'provide your LinkedIn handle i.e. email or phone number')
    .option('-p, --password <linkedin_password>', 'provide your LinkedIn password')
    .option('-m, --max-invites <number_of_invites_to_send>', 'number of limit to send invites (default: 50)')
    .option('-k, --keywords <keywords_to_search>', 'keyworks')
    .option('--no-verbose', 'keep your console clean')
    .parse(args);
  const argumentReceivedValuesWithDefaultValues = {
    ...argumentReceivedValues,
    maxInvites: argumentReceivedValues.maxInvites || 50,
    keywords: argumentReceivedValues.keywords || '',
  };
  global.verbose = program.verbose;
  return argumentReceivedValuesWithDefaultValues;
}

function makePromptSchema(inputFromArguments) {
  const schema = {
    properties: {
      email: {
        description: 'Enter LinkedIn email',
        message: 'empty email',
        type: 'string',
        required: true,
        ask() {
          return !inputFromArguments.email;
        },
      },
      password: {
        description: 'Enter LinkedIn password',
        message: 'empty password',
        type: 'string',
        required: true,
        ask() {
          return !inputFromArguments.password;
        },
      },
      maxInvites: {
        description: 'Enter max invite limit (50):',
        type: 'number',
        required: false,
        ask() {
          return !inputFromArguments.maxInvites;
        },
      },
      keywords: {
        description: 'Enter keywords to search (Sample: Developer):',
        type: 'number',
        required: false,
        ask() {
          return !inputFromArguments.keywords;
        },
      },
    },
  };
  return schema;
}

function getPromptAsks(inputFromArguments) {
  const promptSchema = makePromptSchema(inputFromArguments);
  prompt.message = '';
  prompt.start();

  prompt.get(promptSchema, (err, result) => {
    if (err) {
      console.error('Operation canceled, exiting...');
      process.exit(0);
    }

    inputFromArguments.email = result.email || inputFromArguments.email;
    inputFromArguments.password = result.password || inputFromArguments.password;
    scraper.start(inputFromArguments.email, inputFromArguments.password);
  });
}

function main(args = []) {
  const argumentValues = getArgumentValues(args);
  getPromptAsks(argumentValues);
}

module.exports = main;
