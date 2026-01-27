const { DeepgramClient } = require('@deepgram/sdk');

class DeepgramTTS {
  constructor() {
    if (!process.env.TTS_DEEPGRAM_KEY)
      throw new Error("No Deepgram API key was set.");
    this.deepgram = new DeepgramClient({ key: process.env.TTS_DEEPGRAM_KEY });

    // Arcas as default voice
    // https://developers.deepgram.com/docs/tts-models
    this.model = process.env.TTS_DEEPGRAM_VOICE_MODEL ?? "aura-2-arcas-en";
  }

  static async voices() {
    try {
      const response = await fetch("https://api.deepgram.com/v1/models")
      const data = await response.json();
      return data.tts || [];
    } catch { }
    return [];
  }

  async #stream2buffer(webStream) {
    const reader = webStream.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    return Buffer.concat(chunks);
  }

  async ttsBuffer(textInput) {
    try {
      const response = await this.deepgram.speak.request(
        { text: textInput },
        { model: this.model }
      );
      const stream = await response.getStream();
      if (!stream) {
        console.error("No stream returned from Deepgram TTS");
        return null;
      }
      return await this.#stream2buffer(stream);
    } catch (e) {
      console.error(e);
    }
    return null;
  }
}

module.exports = {
  DeepgramTTS,
};
