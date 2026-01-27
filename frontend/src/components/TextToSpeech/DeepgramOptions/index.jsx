import { useState, useEffect } from "react";
import System from "@/models/system";

export default function DeepgramOptions({ settings }) {
  const [inputValue, setInputValue] = useState(settings?.TTSDeepgramKey);
  const [deepgramKey, setDeepgramKey] = useState(
    settings?.TTSDeepgramKey
  );

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
          defaultValue={settings?.TTSDeepgramKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => setDeepgramKey(inputValue)}
        />
      </div>
      {!settings?.credentialsOnly && (
        <DeepgramModelSelection settings={settings} apiKey={deepgramKey} />
      )}
    </div>
  );
}

function DeepgramModelSelection({ apiKey, settings }) {
  const [groupedModels, setGroupedModels] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      setLoading(true);
      const { models } = await System.customModels(
        "deepgram-tts",
        typeof apiKey === "boolean" ? null : apiKey
      );

      if (models?.length > 0) {
        const modelsByLanguage = models.reduce((acc, model) => {
          const language = model.language || "Unknown";
          acc[language] = acc[language] || [];
          acc[language].push(model);
          return acc;
        }, {});
        setGroupedModels(modelsByLanguage);
      }

      setLoading(false);
    }
    findCustomModels();
  }, [apiKey]);

  if (loading) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Voice Model Selection
        </label>
        <select
          name="TTSDeepgramVoiceModel"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            -- loading available models --
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-3">
        Voice Model Selection
      </label>
      <select
        name="TTSDeepgramVoiceModel"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {Object.keys(groupedModels)
          .sort()
          .map((language) => (
            <optgroup key={language} label={language}>
              {groupedModels[language].map((model) => (
                <option
                  key={model.id}
                  value={model.id}
                  selected={model.id === settings?.TTSDeepgramVoiceModel}
                >
                  {model.name}
                </option>
              ))}
            </optgroup>
          ))}
      </select>
    </div>
  );
}
