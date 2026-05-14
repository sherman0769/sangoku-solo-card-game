import { describe, expect, it } from "vitest";
import { createGame, selectRoute } from "@/lib/game/engine";
import { routeEvents } from "@/lib/game/routeEvents";
import { stageRoutes } from "@/lib/game/routes";
import { getTtsAssetByAudioKey } from "@/lib/game/ttsManifest";
import { canPlayVoice } from "@/lib/game/voice";

const routeEventVoicePaths = {
  "route-mountain-spring": "/audio/voices/route-events/route-mountain-spring.mp3",
  "route-hermit-guidance": "/audio/voices/route-events/route-hermit-guidance.mp3",
  "route-misty-path": "/audio/voices/route-events/route-misty-path.mp3",
  "route-post-station": "/audio/voices/route-events/route-post-station.mp3",
  "route-military-dispatch": "/audio/voices/route-events/route-military-dispatch.mp3",
  "route-remnant-troops": "/audio/voices/route-events/route-remnant-troops.mp3",
  "route-cliff-ambush": "/audio/voices/route-events/route-cliff-ambush.mp3",
  "route-battlefield-relic": "/audio/voices/route-events/route-battlefield-relic.mp3",
  "route-night-raid": "/audio/voices/route-events/route-night-raid.mp3",
} as const;

const routeEventAudioByEventId = {
  "mountain-spring": "route-mountain-spring",
  "hermit-guidance": "route-hermit-guidance",
  "foggy-trail": "route-misty-path",
  "relay-station": "route-post-station",
  "urgent-orders": "route-military-dispatch",
  "remnant-troops": "route-remnant-troops",
  "cliff-ambush": "route-cliff-ambush",
  "battlefield-relic": "route-battlefield-relic",
  "night-raid": "route-night-raid",
} as const;

describe("route event TTS import", () => {
  it("marks all route event audioKeys as ready and playable", () => {
    Object.entries(routeEventVoicePaths).forEach(([audioKey, filePath]) => {
      expect(getTtsAssetByAudioKey(audioKey)).toMatchObject({
        audioKey,
        filePath,
        status: "ready",
        trigger: "route_event",
      });
      expect(canPlayVoice(audioKey)).toBe(true);
    });
  });

  it("maps every route event to its audioKey", () => {
    expect(routeEvents).toHaveLength(9);
    routeEvents.forEach((event) => {
      const audioKey = routeEventAudioByEventId[event.id as keyof typeof routeEventAudioByEventId];

      expect(event.audioKey).toBe(audioKey);
      expect(event.flavorText).toBe(getTtsAssetByAudioKey(event.audioKey)?.text);
    });
  });

  it("creates routeEvent phase dialogue with the route event audioKey", () => {
    Object.entries(routeEventAudioByEventId).forEach(([eventId, audioKey]) => {
      const event = routeEvents.find((item) => item.id === eventId)!;
      const routeState = {
        ...createGame("guan-yu"),
        phase: "route" as const,
        availableRoutes: stageRoutes.map((route) => ({ ...route })),
      };
      const next = selectRoute(routeState, event.routeId, { routeEventId: event.id });

      expect(next.phase).toBe("routeEvent");
      expect(next.currentRouteEvent).toMatchObject({
        id: event.id,
        audioKey,
        image: event.image,
      });
      expect(next.currentDialogue).toMatchObject({
        audioKey,
        trigger: "route_event",
        text: event.flavorText,
      });
    });
  });
});
