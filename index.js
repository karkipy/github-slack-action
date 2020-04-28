const core = require('@actions/core');
const github = require('@actions/github');
const { App } = require("@slack/bolt");

try {
  // `who-to-greet` input defined in action metadata file
  const message = core.getInput('SLACK_MESSAGE');
  const channel = core.getInput('SLACK_CHANNEL');
  const token = core.getInput('SLACK_TOKEN');
  const signingSecret = core.getInput('SLACK_SIGNING_SECRET');
  const filePath = core.getInput('FILE_PATH');
  const slackBot = new App({
    token,
    signingSecret,
  });

  async function sendFile() {
    const fileName = path.resolve(__dirname, '..', filePath);
    try {
      // Call the files.upload method using the built-in WebClient
      const result =  await slackBot.client.files.upload({
        // The token you used to initialize your app is stored in the `context` object
        token,
        channels: channel,
        initial_comment: "Here\'s new updated build :smile:",
        // Include your filename in a ReadStream here
        file: createReadStream(fileName)
      });
      console.log('Sucessfully sent')
    }
    catch (error) {
      console.error('oops: ', error);
    }
  }

  async function sendMessage() {
    try {
      // Call the chat.postMessage method using the built-in WebClient
      const result = await slackBot.client.chat.postMessage({
        // The token you used to initialize your app is stored in the `context` object
        token,
        // Payload message should be posted in the channel where original message was heard
        channel: channel,
        text: message,
      });
    }
    catch (error) {
      console.error(error);
    }
  }

  if (filePath) {
    sendFile();
  } else { sendMessage() }

} catch (error) {
  core.setFailed(error.message);
}