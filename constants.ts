import { Game } from './types';

// Updated to use online URLs for deployment compatibility.
// Local file paths (C:\...) do not work on deployed web applications.

export const GAMES: Game[] = [
  {
    id: 1,
    title: "PUBG: BATTLEGROUNDS",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/PUBG_Battlegrounds_Logo.svg/640px-PUBG_Battlegrounds_Logo.svg.png",
    url: "https://pubg.game.daum.net/"
  },
  {
    id: 2,
    title: "Lucky Dog",
    // Using a placeholder that visually represents the game title since the local file is inaccessible
    imageUrl: "https://placehold.co/400x400/indigo/white?text=Lucky+Dog", 
    url: "https://staticdemo.yggdrasilgaming.com/10728/index.html?appsrv=https://demo.yggdrasilgaming.com&boostUrl=/boost/current/boost.js&channel=pc&countryCode=kr&currency=KRW&fullscreen=yes&gameid=10728&key=&lang=kr&license=mt&org=Demo&pcUrl=/partnerconnect/current/partnerconnect.js"
  },
  {
    id: 3,
    title: "Overwatch 2",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Overwatch_2_logo.svg/640px-Overwatch_2_logo.svg.png",
    url: "https://overwatch.blizzard.com/ko-kr/"
  },
  {
    id: 4,
    title: "VALORANT",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/640px-Valorant_logo_-_pink_color_version.svg.png",
    url: "https://playvalorant.com/ko-kr/"
  },
  {
    id: 5,
    title: "Minecraft",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png",
    url: "https://www.minecraft.net/ko-kr"
  },
  {
    id: 6,
    title: "Lost Ark",
    imageUrl: "https://upload.wikimedia.org/wikipedia/ko/c/c5/Lost_Ark_Logo.png",
    url: "https://lostark.game.onstove.com/"
  },
  {
    id: 7,
    title: "MapleStory",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Maplestory_logo.png",
    url: "https://maplestory.nexon.com/"
  },
  {
    id: 8,
    title: "FC Online",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/EA_Sports_FC_Online_logo.svg/640px-EA_Sports_FC_Online_logo.svg.png",
    url: "https://fconline.nexon.com/"
  },
  {
    id: 9,
    title: "Sudden Attack",
    imageUrl: "https://upload.wikimedia.org/wikipedia/ko/5/58/Sudden_Attack_logo.png",
    url: "https://sa.nexon.com/"
  },
  {
    id: 10,
    title: "Stardew Valley",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/fd/Stardew_Valley_Logo.png",
    url: "https://www.stardewvalley.net/"
  }
];