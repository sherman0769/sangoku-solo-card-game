import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  currentVersionLabel,
  getPhaseHint,
  getHeroIntroAudioKey,
  getHeroPreviewAudioKey,
  getHeroStartLabel,
  gameLoadingCopy,
  homeCollapsibleSections,
  homeAuthorCopy,
  homeHeroPreviewCopy,
  homeHeroSelectionCopy,
  homeMainFlowSteps,
  homeOpeningVideoEntry,
  howToSteps,
  mobileGameplaySections,
  openingVideoModalActions,
  quickRules,
  routeSelectionCopy,
} from "@/lib/game/showcase";
import { canPlayVoice } from "@/lib/game/voice";

describe("showcase and onboarding copy", () => {
  it("includes homepage how-to copy without version feature lists", () => {
    expect(currentVersionLabel).toBe("v0.26.0 挑戰模式版");
    expect(howToSteps.map((step) => step.title)).toEqual([
      "選擇武將",
      "進入戰鬥",
      "擊敗敵人",
      "遇見事件",
      "選擇獎勵",
      "選擇路線",
    ]);
  });

  it("defines deterministic loading copy for client-only game initialization", () => {
    expect(gameLoadingCopy).toEqual({
      title: "戰局準備中……",
      description: "正在生成本局敵人與初始手牌。",
    });
  });

  it("describes the corrected homepage start flow", () => {
    expect(homeMainFlowSteps).toEqual(["觀看開場動畫", "選擇武將", "開始遊戲"]);
    expect(homeHeroSelectionCopy).toContain("新增挑戰模式");
    expect(homeHeroSelectionCopy).toContain("更高壓力的第一章挑戰");
    expect(homeHeroPreviewCopy).toBe("開啟角色語音後，點選武將可試聽專屬選角語音。");
    expect(homeOpeningVideoEntry).toMatchObject({
      title: "開場動畫",
      description: "觀看第一章：黃巾亂起 的 20 秒直式開場動畫",
      primaryAction: "觀看開場動畫",
    });
    expect(Object.values(homeOpeningVideoEntry).join(" ")).not.toContain("略過動畫，直接開始");
    expect(getHeroStartLabel("關羽")).toBe("以關羽開始遊戲");
    expect(homeAuthorCopy).toContain("李詩民");
  });

  it("keeps opening video modal start actions", () => {
    expect(openingVideoModalActions).toContain("略過動畫，開始遊戲");
    expect(openingVideoModalActions).toContain("開始遊戲");
    expect(openingVideoModalActions).toContain("重新播放");
  });

  it("maps game phases to tutorial hints", () => {
    expect(getPhaseHint("player")).toBe(
      "先觀察敵人狀態，再決定使用攻擊、防禦、回復或策略卡。準備好了就按結束回合。",
    );
    expect(getPhaseHint("defense")).toBe(
      "敵人正在攻擊，你可以使用閃或相關技能抵消，也可以選擇承受傷害。",
    );
    expect(getPhaseHint("reward")).toBe("選擇一項戰後強化，它會影響後續整局戰鬥。");
    expect(getPhaseHint("event")).toBe("事件會帶來補給、策略或風險，請選擇你的處理方式。");
    expect(getPhaseHint("route")).toBe(
      "選擇下一條路線。山道偏生存補給，官道偏情報穩定，險道偏奇遇與代價。",
    );
    expect(getPhaseHint("routeEvent")).toBe(
      "處理路線事件。不同路線會帶來補給、情報、支援或稀有奇遇。",
    );
    expect(getPhaseHint("observe")).toBe(
      "諸葛亮發動觀星，選擇一張你最需要的牌加入手牌。",
    );
  });

  it("describes route selection as a playstyle choice", () => {
    expect(routeSelectionCopy).toEqual({
      title: "選擇路線",
      description: "三條路線代表不同遭遇與資源方向，敵人難度不再直接由路線決定。",
    });
    expect(routeSelectionCopy.description).not.toContain("敵人 HP");
  });

  it("includes quick rules for the game page", () => {
    expect(quickRules).toContain("每回合開始會抽牌。");
    expect(quickRules).toContain("第 8 關擊敗呂布即可通關。");
  });

  it("describes mobile gameplay sections", () => {
    expect(mobileGameplaySections).toEqual([
      "手機戰鬥 HUD",
      "底部手牌操作區",
      "戰鬥紀錄收合",
      "狀態與設定收合",
      "事件 / 獎勵 / 路線選擇優化",
    ]);
  });

  it("describes collapsible homepage sections", () => {
    expect(homeCollapsibleSections.map((section) => section.id)).toEqual(["how-to"]);
    expect(homeCollapsibleSections.map((section) => section.title)).toEqual([
      "怎麼玩？展開教學",
    ]);
  });

  it("keeps the home page free of version feature and changelog sections", () => {
    const homePageSource = readFileSync(join(process.cwd(), "app", "page.tsx"), "utf-8");

    expect(homePageSource).not.toContain("查看目前版本特色");
    expect(homePageSource).not.toContain("目前版本特色");
    expect(homePageSource).not.toContain("修改記錄");
    expect(homePageSource).not.toContain("版本歷程");
    expect(homePageSource).toContain("選擇武將");
    expect(homePageSource).toContain("OpeningVideo");
    expect(homePageSource).toContain("ShareGameButton");
    expect(homeAuthorCopy).toContain("李詩民");
  });

  it("maps homepage hero selection to ready preview audio instead of intro audio", () => {
    expect(getHeroPreviewAudioKey("guan-yu")).toBe("guan-yu-preview");
    expect(getHeroPreviewAudioKey("zhao-yun")).toBe("zhao-yun-preview");
    expect(getHeroPreviewAudioKey("zhuge-liang")).toBe("zhuge-liang-preview");
    expect(getHeroPreviewAudioKey("li-shimin-ai-architect")).toBe("li-shimin-preview");
    expect(getHeroPreviewAudioKey("guan-yu")).not.toBe("guan-yu-intro");
    expect(getHeroPreviewAudioKey("zhao-yun")).not.toBe("zhao-yun-intro");
    expect(getHeroPreviewAudioKey("zhuge-liang")).not.toBe("zhuge-liang-intro");
    expect(canPlayVoice("guan-yu-preview")).toBe(true);
    expect(canPlayVoice("zhao-yun-preview")).toBe(true);
    expect(canPlayVoice("zhuge-liang-preview")).toBe(true);
    expect(canPlayVoice("li-shimin-preview")).toBe(true);
  });

  it("keeps game intro audio keys ready for entering the game", () => {
    expect(getHeroIntroAudioKey("guan-yu")).toBe("guan-yu-intro");
    expect(getHeroIntroAudioKey("zhao-yun")).toBe("zhao-yun-intro");
    expect(getHeroIntroAudioKey("zhuge-liang")).toBe("zhuge-liang-intro");
    expect(getHeroIntroAudioKey("li-shimin-ai-architect")).toBe("li-shimin-intro");
    expect(canPlayVoice("guan-yu-intro")).toBe(true);
    expect(canPlayVoice("zhao-yun-intro")).toBe(true);
    expect(canPlayVoice("zhuge-liang-intro")).toBe(true);
    expect(canPlayVoice("li-shimin-intro")).toBe(true);
  });
});
