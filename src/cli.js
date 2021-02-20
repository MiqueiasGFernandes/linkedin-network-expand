#!/usr/bin/env node

const program = require('commander');
const prompt = require('prompt');
const pkg = require('../package.json');
const scraper = require('./scraper');

program
  .version(pkg.version, '-v, --version')
  .usage('[options] [-u email] [-p password]')
  .option('-u, --email <linkedin_handle>', 'provide your LinkedIn handle i.e. email or phone number')
  .option('-p, --password <linkedin_password>', 'provide your LinkedIn password')
  .option('-m, --max-invites <number_of_invites_to_send>', 'number of limit to send invites (default: 50)')
  .option('-k, --keywords <keywords_to_search>', 'keyworks')
  .option('--no-verbose', 'keep your console clean')
  .parse(process.argv);

let { email, password } = program;

global.verbose = program.verbose;

const schema = {
  properties: {
    email: {
      description: 'Enter LinkedIn email',
      message: 'empty email',
      type: 'string',
      required: true,
      ask() {
        return !email;
      },
    },
    password: {
      description: 'Enter LinkedIn password',
      message: 'empty password',
      type: 'string',
      required: true,
      hidden: true,
      ask() {
        return !password;
      },
    },
  },
};

prompt.message = '';
prompt.start();

prompt.get(schema, (err, result) => {
  if (err) {
    process.exit(0);
  }

  email = result.email || email;
  password = result.password || password;
  scraper.start(email, password);
});
