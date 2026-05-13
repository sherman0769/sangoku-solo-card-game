import type { SoundCue } from "./sounds";

const soundEnabledStorageKey = "sangoku-solo-card-game:sound-enabled";

type AudioWindow = Window & {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
};

interface ToneStep {
  frequency: number;
  duration: number;
  wave: OscillatorType;
  gain: number;
}

let sharedAudioContext: AudioContext | undefined;

export function isAudioSupported() {
  return Boolean(getAudioContextConstructor());
}

export function playSound(cue: SoundCue) {
  const AudioContextCtor = getAudioContextConstructor();

  if (!AudioContextCtor) {
    return;
  }

  try {
    const context = getAudioContext(AudioContextCtor);
    if (context.state === "suspended") {
      void context.resume();
    }

    playToneSequence(context, getToneSequence(cue));
  } catch {
    // Audio is an optional feedback layer; unsupported or blocked playback should not affect gameplay.
  }
}

export function readSoundEnabledSetting() {
  const storage = getLocalStorage();

  if (!storage) {
    return false;
  }

  return storage.getItem(soundEnabledStorageKey) === "true";
}

export function writeSoundEnabledSetting(enabled: boolean) {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  storage.setItem(soundEnabledStorageKey, enabled ? "true" : "false");
}

export function getSoundEnabledStorageKey() {
  return soundEnabledStorageKey;
}

function getAudioContextConstructor() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const audioWindow = window as AudioWindow;
  return audioWindow.AudioContext ?? audioWindow.webkitAudioContext;
}

function getAudioContext(AudioContextCtor: typeof AudioContext) {
  sharedAudioContext ??= new AudioContextCtor();
  return sharedAudioContext;
}

function getLocalStorage() {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function playToneSequence(context: AudioContext, sequence: ToneStep[]) {
  let time = context.currentTime;

  sequence.forEach((step) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = step.wave;
    oscillator.frequency.setValueAtTime(step.frequency, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(step.gain, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + step.duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(time);
    oscillator.stop(time + step.duration + 0.02);

    time += step.duration;
  });
}

function getToneSequence(cue: SoundCue): ToneStep[] {
  const tone: Record<SoundCue, ToneStep[]> = {
    "card-play": [{ frequency: 520, duration: 0.05, wave: "triangle", gain: 0.05 }],
    slash: [{ frequency: 880, duration: 0.07, wave: "sawtooth", gain: 0.055 }],
    dodge: [{ frequency: 660, duration: 0.08, wave: "triangle", gain: 0.045 }],
    hit: [{ frequency: 160, duration: 0.09, wave: "square", gain: 0.045 }],
    heal: [
      { frequency: 392, duration: 0.08, wave: "sine", gain: 0.04 },
      { frequency: 523, duration: 0.1, wave: "sine", gain: 0.04 },
    ],
    draw: [
      { frequency: 480, duration: 0.05, wave: "triangle", gain: 0.04 },
      { frequency: 640, duration: 0.05, wave: "triangle", gain: 0.04 },
    ],
    reward: [
      { frequency: 523, duration: 0.07, wave: "triangle", gain: 0.045 },
      { frequency: 784, duration: 0.09, wave: "triangle", gain: 0.045 },
    ],
    event: [{ frequency: 300, duration: 0.12, wave: "sine", gain: 0.04 }],
    route: [
      { frequency: 330, duration: 0.07, wave: "triangle", gain: 0.04 },
      { frequency: 440, duration: 0.07, wave: "triangle", gain: 0.04 },
    ],
    boss: [
      { frequency: 98, duration: 0.15, wave: "sawtooth", gain: 0.05 },
      { frequency: 82, duration: 0.16, wave: "sawtooth", gain: 0.045 },
    ],
    victory: [
      { frequency: 392, duration: 0.08, wave: "triangle", gain: 0.045 },
      { frequency: 523, duration: 0.08, wave: "triangle", gain: 0.045 },
      { frequency: 659, duration: 0.12, wave: "triangle", gain: 0.045 },
    ],
    defeat: [
      { frequency: 220, duration: 0.1, wave: "sine", gain: 0.04 },
      { frequency: 165, duration: 0.12, wave: "sine", gain: 0.04 },
      { frequency: 110, duration: 0.16, wave: "sine", gain: 0.04 },
    ],
  };

  return tone[cue];
}
