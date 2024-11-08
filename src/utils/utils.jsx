import { ROUTES } from "src/routes/urls"
import teamPlaceholder from "src/assets/images/team_placeholder.svg";
import playerPlaceholder from "src/assets/images/player_placeholder.svg";
import appPlaceholder from "src/assets/images/placeholder.png"
import seriesPlaceholder from "src/assets/images/tournament-icon.svg"
import groundPlaceholder from "src/assets/images/ground-placeholder.jpg"


import ColorThief from 'colorthief'
import tinycolor from "tinycolor2";

export function FindAppPlaceholder() {
  return appPlaceholder
}

export function RunRateStringMaker(runRates){
  let runRateNameMap = {
    "currentRunRate": "CRR",
    "requiredRunRate": "RRR",
    "runsRequired": "RR",
    "ballsRemaining": "BR"
  }
  return Object.keys(runRates).filter(key=>runRates[key] != null).map((key)=>{
    return runRateNameMap[key] + ": " + runRates[key]
  }).join(" • ")
}

// Utility
export const rgbToHex = (r, g, b) => {
  const values = [r, g, b].map((value) => {
    const hex = value.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  });
  return `#${values.join('')}`;
};

export async function FindImageDominantColor(imageUrl) {
  try {
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
    });

    let thief = new ColorThief();
    let color = thief.getColor(img);
    color = rgbToHex(color[0], color[1], color[2])

    // console.log('Dominant color:', color);
    return tinycolor(color).lighten(10).toHexString();
  } catch (error) {
    console.error('Error finding dominant color:', error);
    return "";
  }
}

export function FindDateStringLong(date) {  
  if (date != null) {
    date = new Date(date)
    return date.toLocaleDateString("en-US", {dateStyle:"long"}) 
  }
  return ""
}


export function FindMatchLink(slug, series) {
  return ROUTES.SERIES + "/" + FindSeriesSlugOrCreateDummy(series) + "/" + slug;
}


export function FindGroundLongName(ground) {
  if (ground == null) {
    return "Ground Unknown"
  }
  return typeof ground != "string" ? ground.longName : ground;
}

export function FindGroundShortName(ground) {
  if (ground == null) {
    return "Ground Unknown"
  }
  return typeof ground != "string" ? ground.shortName != null ? ground.shortName : ground.longName : ground;
}

export function FindGroundProfile(ground) {
  return typeof ground != "string" && ground != null ? ROUTES.GROUNDS + "/" + ground.slug : "";
}

export function FindGroundImage(ground) {
  return typeof ground != "string" ? ground.image != null ? ground.image : appPlaceholder : appPlaceholder;
}



export function FindSeriesSlugOrCreateDummy(series) {
  return typeof series != "string" ? series.slug : series.toLowerCase().replace(" ", "-");
}

export function FindSeriesSeason(series) {
  return typeof series != "string" ? series.season != null ? series.season : "" : "";
}

export function FindSeriesLongName(series) {
  return typeof series != "string" ? series.longName : series;
}

export function FindSeriesShortName(series) {
  return typeof series != "string" ? series.shortName != null ? series.shortName : series.longName : series;
}

export function FindSeriesImage(series) {
  if (typeof series != "string"){
    if (series.teams.length == 2) {
      let teamImages = series.teams.map((value, index)=>{
        return FindTeamImage(value)
      })
      return teamImages
    }
    return seriesPlaceholder
  }
  return seriesPlaceholder
}

export function FindSeriesProfile(series) {
  return typeof series != "string" ? ROUTES.SERIES + "/" + series.slug : "";
}


export function FindTeamLongName(team) {
  return typeof team != "string" ? team.longName : team;
}

export function FindTeamShortName(team) {
  return typeof team != "string" && !!team ? team.shortName != null ? team.shortName : team.longName : team;
}

export function FindTeamProfile(team) {
  return typeof team != "string" ? ROUTES.TEAMS + "/" + team.slug : "";
}

export function FindTeamImage(team) {
  return typeof team != "string" ? team.image != null ? team.image : teamPlaceholder : teamPlaceholder;
}

export function FindTeamColor(team) {
  return typeof team != "string" ? team.color != null ? team.color : team.image != null ? FindImageDominantColor(team.image) : "" : "";
}



export function FindPlayerName(player) {
  return typeof player != "string" ? player.name : player;
}

export function FindPlayerProfile(player) {
  return typeof player != "string" ? ROUTES.PLAYERS + "/" + player.slug : "#not found";
}

export function FindPlayerFaceImage(player) {
  let image =  (player.faceImage != null && player.faceImage != "https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci")
    ? player.faceImage
    : (player.image != null && player.image != "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_640,q_50/lsci")
    ? player.image
    : playerPlaceholder;
    return image
}

export function FindPlayerImage(player) {
  return player.image != null
    ? player.image
    : player.faceImage != null
    ? player.faceImage
    : playerPlaceholder;
}

export function FindPlayerTeamByName(teamMap, playerMap, playerName) {
  let foundTeam = null;
  for (let team in playerMap) {
    for (let player in playerMap[team]) {
      if (player == playerName) {
        foundTeam = team;
        break;
      }
    }
    if (foundTeam != null) {
      break;
    }
  }
  return teamMap[foundTeam];
}
  