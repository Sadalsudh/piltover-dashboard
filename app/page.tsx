"use client";
import { useState, useEffect } from 'react';

// Valores para el ordenamiento del Ranking
const VALOR_LIGA: { [key: string]: number } = {
  "CHALLENGER": 9000, "GRANDMASTER": 8000, "MASTER": 7000, "DIAMOND": 6000,
  "EMERALD": 5000, "PLATINUM": 4000, "GOLD": 3000, "SILVER": 2000,
  "BRONZE": 1000, "IRON": 500, "SIN RANGO": 0, "UNRANKED": 0, "ESPERANDO": -1
};

const VALOR_DIVISION: { [key: string]: number } = {
  "I": 400, "II": 300, "III": 200, "IV": 100
};

const styles = {
  main: { minHeight: '100vh', width: '100%', backgroundColor: '#0d1111', color: '#f2e3a9', padding: '40px', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' as 'column', alignItems: 'center', margin: 0, boxSizing: 'border-box' as 'border-box' },
  header: { width: '100%', maxWidth: '1100px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', borderBottom: '1px solid rgba(166,139,83,0.2)', paddingBottom: '20px' },
  title: { fontSize: '48px', fontWeight: '900', fontStyle: 'italic', color: 'white', textTransform: 'uppercase' as 'uppercase', margin: 0, letterSpacing: '-2px' },
  btn: { backgroundColor: '#a68b53', color: '#0d1111', border: 'none', padding: '12px 40px', borderRadius: '50px', fontWeight: '900', cursor: 'pointer' },
  card: { width: '100%', maxWidth: '1100px', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', alignItems: 'center', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(20,29,29,0.4)', marginBottom: '8px', cursor: 'pointer' },
  cardSelected: { border: '1px solid #a68b53', backgroundColor: '#1c2a2a' },
  nombreLink: { fontWeight: 'bold', color: 'white', textTransform: 'uppercase' as 'uppercase', fontSize: '14px' },
  statsCol: { gridColumn: 'span 4', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' },
  nivelTexto: { color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '900', minWidth: '55px' },
  wrBarWrapper: { display: 'flex', flexDirection: 'column' as 'column', alignItems: 'center', gap: '4px', flex: 1 },
  wrBarContainer: { width: '70px', height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', display: 'flex' },
  wlContador: { display: 'flex', gap: '6px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' as 'uppercase' },
  wrPorcentaje: { color: '#a68b53', fontSize: '16px', fontWeight: '900', minWidth: '45px', textAlign: 'right' as 'right', fontStyle: 'italic' },
  rangoCol: { gridColumn: 'span 3', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' },
  rangoImg: { width: '45px', height: '45px', objectFit: 'contain' as 'contain' },
  rangoInfo: { display: 'flex', flexDirection: 'column' as 'column', alignItems: 'flex-end' },
  tabsContainer: { display: 'flex', flexDirection: 'row' as 'row', flexWrap: 'wrap' as 'wrap', justifyContent: 'center' as 'center', gap: '8px', width: '100%', maxWidth: '1100px', marginBottom: '30px' },
  tabBtn: { padding: '10px 18px', borderRadius: '6px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' as 'uppercase', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' },
  statsPanel: { width: '100%', maxWidth: '1100px', backgroundColor: '#141d1d', borderRadius: '40px', padding: '40px', display: 'flex', flexDirection: 'column' as 'column', gap: '40px', border: '1px solid rgba(255,255,255,0.05)' },
  topStatsRow: { display: 'flex', width: '100%', justifyContent: 'space-around', alignItems: 'center' },
  statBox: { textAlign: 'center' as 'center', flex: 1 },
  statLabel: { color: '#a68b53', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' as 'uppercase', letterSpacing: '4px', marginTop: '10px' },
  statValue: { fontSize: '45px', fontWeight: '900', color: 'white', fontStyle: 'italic', margin: 0, lineHeight: 1 },
  masterySection: { borderTop: '1px solid rgba(166,139,83,0.15)', paddingTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '50px' },
  masteryImg: { width: '120px', height: '120px', borderRadius: '50%', border: '2px solid #a68b53', objectFit: 'cover' as 'cover', backgroundColor: '#0d1111' },
  predictionPanel: { marginTop: '10px', paddingTop: '30px', borderTop: '1px solid rgba(166,139,83,0.15)', display: 'flex', flexDirection: 'column' as 'column', gap: '15px', width: '100%' },
  predictionRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px 30px', borderRadius: '15px', border: '1px solid rgba(166,139,83,0.08)' },
  predictionLabel: { fontSize: '11px', color: '#a68b53', fontWeight: 'bold', textTransform: 'uppercase' as 'uppercase', letterSpacing: '2px', marginBottom: '5px' },
  predictionValue: { fontSize: '32px', fontWeight: '900', color: 'white', fontStyle: 'italic', margin: 0 }
};

export default function Home() {
  const amigos = [
    { id: "SadalsudD#BAQ" }, { id: "Kindred Lamar#Zzzzz" }, { id: "YamteKudasai#LAN" },
    { id: "Orianna Grande#Zzzzz" }, { id: "MIa Kalista#Zzzzz" }, { id: "Vitafer#MED" },
    { id: "tumbalacasanami#FARC" }, { id: "yo y 4 webones#LAN" },
    { id: "pacu liarte#LAN" }, { id: "GalioleoGalilei#Zzzzz" },
  ];

  const [datosReales, setDatosReales] = useState<Record<string, any>>({});
  const [cargando, setCargando] = useState(false);
  const [calculando, setCalculando] = useState(false);
  const [seleccionado, setSeleccionado] = useState<string>(amigos[0].id);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `body, html { margin: 0 !important; padding: 0 !important; background-color: #0d1111 !important; }`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const actualizarRanking = async () => {
    if (cargando) return;
    setCargando(true);
    let copia = { ...datosReales };
    for (const a of amigos) {
      try {
        const [n, t] = a.id.split('#');
        const res = await fetch(`/api/riot?gameName=${encodeURIComponent(n)}&tagLine=${encodeURIComponent(t)}`);
        const data = await res.json();
        const tot = (data.victorias || 0) + (data.derrotas || 0);
        data.winrate = tot > 0 ? Math.round((data.victorias / tot) * 100) : 0;
        copia[a.id] = data;
        setDatosReales({ ...copia });
        await new Promise(r => setTimeout(r, 650)); 
      } catch (e) {}
    }
    setCargando(false);
  };

  const solicitarAnalisis = async () => {
    if (calculando) return;
    setCalculando(true);
    try {
      const [n, t] = seleccionado.split('#');
      const res = await fetch(`/api/riot?gameName=${encodeURIComponent(n)}&tagLine=${encodeURIComponent(t)}&full=true`);
      const data = await res.json();

      let probabilidadIA = "0.0";
      if (data.historialIA && data.historialIA.length > 0) {
        const { ejecutarIA } = await import('../lib/predictor');
        probabilidadIA = await ejecutarIA(data.historialIA);
      }

      setDatosReales(prev => ({ 
        ...prev, 
        [seleccionado]: { ...prev[seleccionado], ...data, probabilidadIA } 
      }));
    } catch (e) {
      console.error("Error en el análisis:", e);
    }
    setCalculando(false);
  };

  const amigosOrdenados = [...amigos].sort((a, b) => {
    const sA = datosReales[a.id];
    const sB = datosReales[b.id];

    const calcularPeso = (s: any) => {
      if (!s || !s.rango || s.rango === "ESPERANDO" || s.rango === "SIN RANGO") return -1;
      const ligaBase = VALOR_LIGA[s.tier] || 0;
      const partes = s.rango.split(' ');
      const division = partes[partes.length - 1]; 
      const pesoDivision = VALOR_DIVISION[division] || 0;
      return ligaBase + pesoDivision + (s.lp || 0);
    };

    const pesoA = calcularPeso(sA);
    const pesoB = calcularPeso(sB);

    if (pesoB !== pesoA) return pesoB - pesoA;
    return (sB?.nivel || 0) - (sA?.nivel || 0);
  });

  const dataAmigo = datosReales[seleccionado] || { nivel: 0, victorias: 0, derrotas: 0, winrate: 0, rango: "ESPERANDO", lp: 0, topChampion: "Aatrox", masteryPoints: 0, analizado: false, wrReciente: 0, tier: "UNRANKED", probabilidadIA: "0.0" };
  const tieneRango = dataAmigo.rango !== "SIN RANGO" && dataAmigo.rango !== "ESPERANDO" && dataAmigo.tier !== "UNRANKED";

  return (
    <main style={styles.main}>
      <div style={styles.header}>
        <h1 style={styles.title}>PILTOVER <span style={{ color: '#a68b53' }}>DASHBOARD</span></h1>
        <button onClick={actualizarRanking} style={styles.btn}>{cargando ? "SINCRO..." : "ACTUALIZAR"}</button>
      </div>

      <div style={{ width: '100%', maxWidth: '1100px', marginBottom: '30px' }}>
        {amigosOrdenados.map((a, i) => {
          const s = datosReales[a.id];
          const rL = (s?.rango || "IRON").split(' ')[0];
          return (
            <div key={a.id} onClick={() => setSeleccionado(a.id)} style={{ ...styles.card, ...(seleccionado === a.id ? styles.cardSelected : {}) }}>
              <div style={{ gridColumn: 'span 1', opacity: 0.1, fontWeight: 900, fontSize: '18px' }}>{i + 1}</div>
              <div style={{ gridColumn: 'span 4', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid #a68b53', overflow: 'hidden', backgroundColor: '#141d1d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={`https://ddragon.leagueoflegends.com/cdn/14.21.1/img/profileicon/${s?.icono || 29}.png`} style={{ width: '100%' }} />
                </div>
                <span style={styles.nombreLink}>{a.id.split('#')[0]}</span>
              </div>
              <div style={styles.statsCol}>
                <span style={styles.nivelTexto}>LVL {s?.nivel || 0}</span>
                <div style={styles.wrBarWrapper}>
                  <div style={styles.wrBarContainer}><div style={{ width: `${s?.winrate || 0}%`, height: '100%', backgroundColor: '#a68b53' }} /></div>
                  <div style={styles.wlContador}><span style={{ color: '#88d8b0' }}>{s?.victorias || 0}W</span><span style={{ color: '#ff6b6b' }}>{s?.derrotas || 0}L</span></div>
                </div>
                <span style={styles.wrPorcentaje}>{s?.winrate || 0}%</span>
              </div>
              <div style={styles.rangoCol}>
                <div style={styles.rangoInfo}>
                  <span style={{ fontWeight: '900', color: '#a68b53' }}>{s?.rango || "ESPERANDO"}</span>
                  <span style={{ fontSize: '10px', opacity: 0.4 }}>{s?.lp || 0} LP</span>
                </div>
                <img src={`/Ranks/${rL}.png`} style={styles.rangoImg} onError={(e) => e.currentTarget.src = "/Ranks/IRON.png"} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.tabsContainer}>
        {amigosOrdenados.map(a => (
          <button key={a.id} onClick={() => setSeleccionado(a.id)} style={{ ...styles.tabBtn, backgroundColor: seleccionado === a.id ? '#a68b53' : '#1c2a2a', color: seleccionado === a.id ? '#0d1111' : 'rgba(166,139,83,0.6)' }}>
            {a.id.split('#')[0]}
          </button>
        ))}
      </div>

      <div style={styles.statsPanel}>
        <div style={styles.topStatsRow}>
          <div style={styles.statBox}><p style={styles.statValue}>{dataAmigo.nivel}</p><p style={styles.statLabel}>Nivel</p></div>
          <div style={styles.statBox}><p style={{...styles.statValue, fontSize: '32px'}}>{dataAmigo.victorias}W - {dataAmigo.derrotas}L</p><p style={styles.statLabel}>Temporada</p></div>
          <div style={{ ...styles.statBox, flex: 1.5, borderLeft: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.05)' }}><p style={{ ...styles.statValue, fontSize: '35px' }}>{dataAmigo.rango}</p><p style={styles.statLabel}>Rango Actual</p></div>
          <div style={styles.statBox}><p style={styles.statValue}>{dataAmigo.winrate}%</p><p style={styles.statLabel}>Winrate</p></div>
          <div style={styles.statBox}><p style={styles.statValue}>{dataAmigo.lp}</p><p style={styles.statLabel}>LP</p></div>
        </div>

        <div style={styles.masterySection}>
          <img src={`https://ddragon.leagueoflegends.com/cdn/14.21.1/img/champion/${dataAmigo.topChampion}.png`} style={styles.masteryImg} />
          <div style={{ textAlign: 'left' }}>
            <p style={{ color: '#a68b53', fontSize: '10px', letterSpacing: '5px' }}>TOP MASTERY</p>
            <h2 style={{ fontSize: '42px', color: 'white', fontStyle: 'italic', margin: 0 }}>{dataAmigo.topChampion}</h2>
            <p style={{ color: '#a68b53', fontSize: '20px' }}>{(dataAmigo.masteryPoints || 0).toLocaleString()} <span style={{ opacity: 0.5, fontSize: '12px' }}>PUNTOS</span></p>
          </div>
        </div>

        <div style={styles.predictionPanel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'white', margin: 0, fontSize: '14px', letterSpacing: '2px' }}>HEXTECH <span style={{ color: '#a68b53' }}>PREDICTOR IA</span></h3>
            {tieneRango && !dataAmigo.analizado && (
              <button onClick={solicitarAnalisis} style={{ ...styles.btn, padding: '10px 25px', fontSize: '12px' }}>
                {calculando ? "ENTRENANDO IA..." : "ANALIZAR CON MACHINE LEARNING"}
              </button>
            )}
          </div>

          {dataAmigo.analizado ? (
            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
              <div style={{ ...styles.predictionRow, flex: 1 }}>
                <div><p style={styles.predictionLabel}>Tendencia Solo Q (Real)</p><p style={styles.predictionValue}>{dataAmigo.wrReciente}%</p></div>
              </div>
              <div style={{ ...styles.predictionRow, flex: 1, border: '1px solid #88d8b0' }}>
                <div><p style={{ ...styles.predictionLabel, color: '#88d8b0' }}>Probabilidad IA (Próxima Partida)</p><p style={{ ...styles.predictionValue, color: '#88d8b0' }}>{dataAmigo.probabilidadIA}%</p></div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '30px', textAlign: 'center', border: '1px dashed rgba(166,139,83,0.2)', borderRadius: '20px' }}>
              <p style={{ color: 'rgba(166,139,83,0.5)', fontSize: '13px' }}>
                {!tieneRango ? "Análisis IA no disponible para UNRANKED." : "La IA necesita procesar el historial de Solo Q para generar predicciones."}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}