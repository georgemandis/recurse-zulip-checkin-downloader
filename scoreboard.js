/**
 * Recurse Center Check-in Stream Exporter
 * The Content Wars™
 * ===
 * By George Mandis (Winter 2, 2020 @ Recure Center)
 */

const zulip = require("zulip-js");
const dateFormat = require("dateformat");
const prettyBytes = require("pretty-bytes");

(async () => {
  // Pass the path to your zuliprc file here.
  // You can read instructions for downloading this file here:
  // https://zulipchat.com/api/api-keys
  const config = {
    zuliprc: "zuliprc"
  };

  const client = await zulip(config);

  async function get_topics() {
    let data;
    try{
      data = await client.streams.topics.retrieve({ stream_id: 18961 });
    }catch(err){
      console.log(err);
      exit;
    }

    const topics = data.topics.map(topic => topic.name)
    topics.sort();
    return topics;
  }

  /**
   * Retrieve all the messages from the check-in stream
   * under the corresponding topic
   */
  async function get_messages(topic) {
    const readParams = {
      anchor: 10000000000,
      num_before: 3000,
      num_after: 0,
      apply_markdown: false,
      narrow: [
        { operator: "stream", operand: "checkins" },
        { operator: "topic", operand: escape(topic) }
      ]
    };

    // Fetch messages anchored around id (1 before, 1 after)
    const data = await client.messages.retrieve(readParams);
    let returnData = "";
    let topicUserID = "";

    data.messages.forEach((message,index) => {
      if (index === 0) {
        topicUserID = message.sender_id;
      }
      /**
       * Build HTML or markdown output depending on selection and
       * optionally include
       */

      const formattedTimestamp = dateFormat(message.timestamp * 1000);
      if (message.sender_id === topicUserID) {
        returnData += `**${message.sender_full_name} (${formattedTimestamp})**\n\n${message.content}\n\n********\n\n`;
      }

    });

    return returnData;
  }


  /**
   * Updates from the frontline of...
   * The Content Wars™
   */

   const topics = await get_topics();

   const results = [];

   topics.forEach((topic, index, totalTopics) => {
     setTimeout(async ()=> {

      const checkin = await get_messages(topic);

      results.push({
        topic: topic,
        letters: checkin.length
      });

      console.log(`${topic}: ${prettyBytes(checkin.length)}`);

      if (index === totalTopics.length -1) {
        // Done. Sort and dispaly
        results.sort((a,b) =>{
          return a.letters - b.letters;
        }).reverse();

        results.forEach((t) => {
          console.log(`${t.topic},${prettyBytes(t.letters)}`);
          // console.log(`${t.topic}, ${t.letters}, ${prettyBytes(t.letters)}`);
        })
      }
     }, 350*index)

   })

  //  console.log(topics)


})();
