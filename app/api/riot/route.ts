import { NextResponse } from 'next/server';

const CHAMPION_MAP: { [key: number]: string } = {
  266: "Aatrox", 103: "Ahri", 84: "Akali", 12: "Alistar", 32: "Amumu", 34: "Anivia", 1: "Annie", 523: "Aphelios", 22: "Ashe", 136: "AurelionSol", 268: "Azir", 432: "Bard", 53: "Blitzcrank", 63: "Brand", 201: "Braum", 51: "Caitlyn", 164: "Camille", 69: "Cassiopeia", 31: "ChoGath", 42: "Corki", 122: "Darius", 131: "Diana", 119: "Draven", 36: "DrMundo", 105: "Fizz", 41: "Gangplank", 86: "Garen", 150: "Gnar", 79: "Gragas", 104: "Graves", 120: "Hecarim", 74: "Heimerdinger", 420: "Illaoi", 39: "Irelia", 427: "Ivern", 40: "Janna", 59: "JarvanIV", 24: "Jax", 126: "Jayce", 202: "Jhin", 222: "Jinx", 145: "KaiSa", 429: "Kalista", 43: "Karma", 30: "Karthus", 38: "Kassadin", 55: "Katarina", 10: "Kayle", 141: "Kayn", 85: "Kennen", 121: "Khazix", 203: "Kindred", 7: "LeBlanc", 64: "LeeSin", 89: "Leona", 127: "Lissandra", 236: "Lucian", 117: "Lulu", 99: "Lux", 54: "Malphite", 90: "Malzahar", 57: "Maokai", 11: "MasterYi", 21: "MissFortune", 62: "Wukong", 25: "Morgana", 267: "Nami", 75: "Nasus", 111: "Nautilus", 518: "Neeko", 76: "Nidalee", 56: "Nocturne", 20: "Nunu", 2: "Olaf", 61: "Orianna", 516: "Ornn", 80: "Pantheon", 78: "Poppy", 555: "Pyke", 246: "Qiyana", 133: "Quinn", 497: "Rakan", 33: "Rammus", 421: "RekSai", 526: "Rell", 58: "Renekton", 107: "Rengar", 92: "Riven", 68: "Rumble", 13: "Ryze", 360: "Samira", 113: "Sejuani", 235: "Senna", 147: "Seraphine", 875: "Sett", 35: "Shaco", 98: "Shen", 102: "Shyvana", 27: "Singed", 14: "Sion", 15: "Sivir", 72: "Skarner", 37: "Sona", 16: "Soraka", 50: "Swain", 517: "Sylas", 134: "Syndra", 223: "TahmKench", 163: "Taliyah", 91: "Talon", 44: "Taric", 17: "Teemo", 412: "Thresh", 18: "Tristana", 48: "Trundle", 23: "Tryndamere", 4: "TwistedFate", 29: "Twitch", 77: "Udyr", 6: "Urgot", 110: "Varus", 67: "Vayne", 45: "Veigar", 161: "VelKoz", 711: "Vex", 254: "Vi", 234: "Viego", 112: "Viktor", 8: "Vladimir", 106: "Volibear", 19: "Warwick", 498: "Xayah", 101: "Xerath", 5: "XinZhao", 157: "Yasuo", 777: "Yone", 83: "Yorick", 350: "Yuumi", 154: "Zac", 238: "Zed", 115: "Ziggs", 26: "Zilean", 142: "Zoe", 143: "Zyra", 3: "Galio"
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameName = searchParams.get('gameName');
  const tagLine = searchParams.get('tagLine');
  const isFull = searchParams.get('full') === 'true';
  const RIOT_API_KEY = "RGAPI-89bc60a4-5f57-418c-8efe-ec5399050cc3";

  if (!gameName || !tagLine) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

  try {
    const resAcc = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${RIOT_API_KEY}`);
    const accData = await resAcc.json();
    const puuid = accData.puuid;

    if (!puuid) return NextResponse.json({ error: "No se encontró el PUUID" }, { status: 404 });

    const [resSum, resRank, resMastery] = await Promise.all([
      fetch(`https://la1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`).then(r => r.json()),
      fetch(`https://la1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`).then(r => r.json()),
      fetch(`https://la1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=1&api_key=${RIOT_API_KEY}`).then(r => r.json())
    ]);

    const soloQ = resRank.find((m: any) => m.queueType === 'RANKED_SOLO_5x5');
    const topChampId = resMastery?.[0]?.championId || 266;

    const baseData = {
      nivel: resSum.summonerLevel,
      icono: resSum.profileIconId,
      rango: soloQ ? `${soloQ.tier} ${soloQ.rank}` : "SIN RANGO",
      tier: soloQ ? soloQ.tier : "UNRANKED",
      lp: soloQ ? soloQ.leaguePoints : 0,
      victorias: soloQ ? soloQ.wins : 0,
      derrotas: soloQ ? soloQ.losses : 0,
      topChampion: CHAMPION_MAP[topChampId] || "Aatrox",
      masteryPoints: resMastery?.[0]?.championPoints || 0
    };

    if (isFull) {
      // FILTRO SOLO Q (queue=420) + RANKED (type=ranked)
      const resMatches = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&type=ranked&start=0&count=20&api_key=${RIOT_API_KEY}`);
      const matchIds = await resMatches.json();
      
      if (Array.isArray(matchIds) && matchIds.length > 0) {
        const matches = await Promise.all(
          matchIds.map(id => fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${id}?api_key=${RIOT_API_KEY}`).then(r => r.json()))
        );

        let wins = 0;
        let validMatches = 0;

        matches.forEach(m => {
          const player = m.info?.participants?.find((p: any) => p.puuid === puuid);
          // Filtro: Solo contamos si el jugador existe y la partida duró más de 5 min (evita remakes)
          if (player && m.info?.gameDuration > 300) {
            validMatches++;
            if (player.win) wins++;
          }
        });

        const wrCalculado = validMatches > 0 ? parseFloat(((wins / validMatches) * 100).toFixed(1)) : 0;
        return NextResponse.json({ ...baseData, wrReciente: wrCalculado, totalAnalizadas: validMatches, analizado: true });
      } else {
        // Si no tiene partidas de Solo Q recientes
        return NextResponse.json({ ...baseData, wrReciente: 0, totalAnalizadas: 0, analizado: true });
      }
    }

    return NextResponse.json(baseData);
  } catch (e) {
    return NextResponse.json({ error: "Error en API" }, { status: 500 });
  }
}