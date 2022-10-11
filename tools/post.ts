#!/usr/bin/env -S deno run --allow-net --allow-read --allow-run

const HTTPIE = 'http';

const main = async () => {
  const args = Deno.args;
  if (args.length !== 2) {
    console.log('Usage: post.ts DEPLOY_ID JSON_PATH');

    return;
  }

  const [deployID, input] = args;
  if (!input.endsWith('.json')) {
    console.log('Please specify a .json file');

    return;
  }

  const cmd = `${HTTPIE} https://script.google.com/macros/s/${deployID}/exec @${input}`;
  console.log(`cmd: ${cmd}`);
  const status = await Deno.run({ cmd: cmd.split(' ') }).status();
  console.log(status);
};

main(); // eslint-disable-line
