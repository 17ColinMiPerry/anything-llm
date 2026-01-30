export default function DeepgramOptions({ settings }) {
  // STT uses the same API key as TTS (TTSDeepgramKey)
  // Show asterisks if TTS key exists
  const hasKey = settings?.TTSDeepgramKey;

  return (
    <div className="flex gap-x-4">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          API Key
        </label>
        <input
          type="password"
          name="TTSDeepgramKey"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="Deepgram API Key"
          defaultValue={hasKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
