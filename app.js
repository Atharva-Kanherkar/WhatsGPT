const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;
const openaiClient = axios.create({
    headers: { 'Authorization': 'Bearer ' + apiKey }
});

const whatsappClient = new Client({
  authStrategy: new LocalAuth(),
});

whatsappClient.initialize();

whatsappClient.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

whatsappClient.on('authenticated', () => {
  console.log('AUTHENTICATED');
});
//Sends the message to every user's first message every hour.
 let repliedUsers = [];
whatsappClient.on('message', msg => {
  if (msg.body && !repliedUsers.includes(msg.from) && !msg.isGroupMsg) {
    msg.reply('Thank you for reaching out to me, I will be responding soon!');
    repliedUsers.push(msg.from);
  }
});
setInterval(() => {
  repliedUsers = [];
}, 60 * 60 * 1000);

 
 

// whatsappClient.on('ready', async () => {
//   console.log('Client is ready!');
//   try {
//     const chats = await whatsappClient.getChats();
//     const TargetName = chats.find(chat => chat.name === 'Shruti');
    
//     if (TargetName) {
//       setInterval(async () => {
//         const prompt = "Something for shruti.";
//         const params = {
//           "model": "gpt-3.5-turbo",
//           "messages": [
//             {"role": "system", "content": "You are a helpful assistant, who is responding to shruti, my sister, on my behalf. Send her messages about her law degree,how foody she is, a joke type which is short."},
//             {"role": "user", "content": prompt}
//           ]
//         };
//         try {
//           const result = await openaiClient.post('https://api.openai.com/v1/chat/completions', params);
//           const openAIResponse = result.data.choices[0].message.content.trim();
//           whatsappClient.sendMessage(TargetName.id._serialized, openAIResponse);
//         } catch (err) {
//           console.log(err);
//           whatsappClient.sendMessage(TargetName.id._serialized, 'Sorry, I am unable to generate a message.');
//         }
//       }, 9000);
//     } else {
//       console.log("Chat not found");
//     }
//   } catch (err) {
//     console.log("Error fetching chats:", err);
//   }
// });
let TargetName;
whatsappClient.on('ready', async () => {
  console.log('Client is ready!');
  const chats = await whatsappClient.getChats();
  TargetName = chats.find(chat => chat.name === 'Mumma2');
});
//Replies to your questions.
whatsappClient.on('message', async msg => {
  if (msg.body && msg.from === process.env.MUMMA_ID) {
    const prompt = msg.body;
  
    const params = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {"role": "system", "content": "You are a helpful assistant, which talks to a person, taking text messages as prompts"},
        {"role": "user", "content": prompt}
      ]
    };
    try {
      const result = await openaiClient.post('https://api.openai.com/v1/chat/completions', params);
      const openAIResponse = result.data.choices[0].message.content.trim();
      if (TargetName) {
        whatsappClient.sendMessage(TargetName.id._serialized, openAIResponse);
      } else {
        console.log('Chat not found');
      }
    } catch (err) {
      console.log(err);
      if (TargetName) {
        whatsappClient.sendMessage(TargetName.id._serialized, 'Sorry, I am unable to generate a message.');
      }
    }
  }
});

let TargetName2;
whatsappClient.on('ready', async () => {
  console.log('Client is ready!');
  const chats = await whatsappClient.getChats();
  TargetName2 = chats.find(chat => chat.name === 'Deveshi');
});
//Respond to my freind, deveshi as i am busy.
whatsappClient.on('message', async msg => {
  if (msg.body && msg.from === process.env.DEVESHI_ID) {
    const prompt = msg.body;
  
    const params = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {"role": "system", "content": "You are a helpful assistant, talks to my freind,  deveshi as i am busy. Keep her entertained"},
        {"role": "user", "content": prompt}
      ]
    };
    try {
      const result = await openaiClient.post('https://api.openai.com/v1/chat/completions', params);
      const openAIResponse = result.data.choices[0].message.content.trim();
      if (TargetName2) {
        whatsappClient.sendMessage(TargetName2.id._serialized, openAIResponse);
      } else {
        console.log('Chat not found');
      }
    } catch (err) {
      console.log(err);
      if (TargetName2) {
        whatsappClient.sendMessage(TargetName2.id._serialized, 'Sorry, I am unable to generate a message.');
      }
    }
  }
});
//suggest more functionalities
//weather
whatsappClient.on('message', async msg => {
    if (msg.body == '!weather') {
        let weatherData = await getWeatherData(); // function to fetch weather data from API
        msg.reply(`
            Weather Update:
            Location: ${weatherData.location}
            Temperature: ${weatherData.temperature}°C
            Condition: ${weatherData.condition}
        `);
    }
});
