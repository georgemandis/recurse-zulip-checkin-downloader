/**
 * Recurse Center Check-in Stream Exporter
 * ===
 * By George Mandis (Winter 2, 2020 @ Recure Center)
 */

const zulip = require("zulip-js");
const dateFormat = require("dateformat");

const topic = process.argv[2];

/**
 * This is most likely formated something like this:
 * e.g. "George Mandis (W2'20)"
 */
if (!topic) {
  console.log("No topic provided!");
  return false;
}

/**
 * html or markdown output options
 */
const outputFormat = ["html", "markdown"].includes(process.argv[3])
  ? process.argv[3]
  : "html";

(async () => {
  // Pass the path to your zuliprc file here.
  // You can read instructions for downloading this file here:
  // https://zulipchat.com/api/api-keys
  const config = {
    zuliprc: "zuliprc"
  };

  const client = await zulip(config);

  /**
   * Retrieve all the messages from the check-in stream
   * under the corresponding topic
   */
  async function get_messages(topic) {
    const readParams = {
      anchor: 10000000000,
      num_before: 3000,
      num_after: 0,
      apply_markdown: outputFormat === "markdown" ? false : true,
      narrow: [
        { operator: "stream", operand: "checkins" },
        { operator: "topic", operand: topic }
      ]
    };

    // Fetch messages anchored around id (1 before, 1 after)
    const data = await client.messages.retrieve(readParams);
    let returnData = "";

    data.messages.forEach(message => {
      /**
       * Build HTML or markdown output depending on selection and
       * optionally include
       */

      const formattedTimestamp = dateFormat(message.timestamp * 1000);

      if (outputFormat === "html") {
        returnData += `<strong>${message.sender_full_name} (${formattedTimestamp})</strong>\n${message.content}
        \n<hr>\n\n`;
      } else if (outputFormat === "markdown") {
        returnData += `**${message.sender_full_name} (${formattedTimestamp})**\n\n${message.content}\n\n********\n\n`;
      }
    });

    console.log(returnData);
  }

  get_messages(topic);
})();
