export type BgmTrackStatus = "planned" | "ready";

export type BgmTrackId = "home-theme" | "battle-theme" | "boss-theme";

export interface BgmTrack {
  id: BgmTrackId;
  displayName: string;
  filePath: string;
  usage: string;
  loop: boolean;
  status: BgmTrackStatus;
}

export const BGM_TRACKS: BgmTrack[] = [
  {
    id: "home-theme",
    displayName: "首頁主題音樂",
    filePath: "/audio/bgm/home-theme.mp3",
    usage: "首頁、選角、展示",
    loop: true,
    status: "ready",
  },
  {
    id: "battle-theme",
    displayName: "一般戰鬥音樂",
    filePath: "/audio/bgm/battle-theme.mp3",
    usage: "第一章一般戰鬥",
    loop: true,
    status: "ready",
  },
  {
    id: "boss-theme",
    displayName: "Boss 戰音樂",
    filePath: "/audio/bgm/boss-theme.mp3",
    usage: "呂布 Boss 戰",
    loop: true,
    status: "ready",
  },
];
