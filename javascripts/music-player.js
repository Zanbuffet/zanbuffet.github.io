(() => {
  let player, audio, configKey, spin, slowingTimer;
  const $ = (selector, root = document) => root.querySelector(selector);
  const time = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}` : "0:00";
  const icon = playing => playing ? "Ⅱ" : "▶";
  const getConfig = () => { const node = $("#ncm-player-config"); if (!node) return null; try { return JSON.parse(node.textContent); } catch { return null; } };
  const normalise = config => {
    const list = Array.isArray(config.playlist) ? config.playlist : (config.id ? [{ id: config.id, title: config.title, cover: config.cover }] : []);
    return list.filter(song => song && song.id).map(song => ({ id: String(song.id), title: song.title || "网易云音乐", cover: song.cover || "" }));
  };
  const stopSpin = () => { clearInterval(slowingTimer); if (!spin) return; slowingTimer = setInterval(() => { spin.playbackRate = Math.max(0, spin.playbackRate - .08); if (!spin.playbackRate) { spin.pause(); clearInterval(slowingTimer); } }, 45); };
  const startSpin = () => { clearInterval(slowingTimer); if (!spin) return; spin.playbackRate = 1; spin.play(); };
  const destroy = () => { clearInterval(slowingTimer); if (audio) audio.pause(); if (spin) spin.cancel(); player?.remove(); player = audio = spin = null; };
  const make = config => {
    const playlist = normalise(config); if (!playlist.length) return;
    let index = 0, mode = config.mode || "sequence", dragging = false;
    player = document.createElement("section"); player.className = "ncm-player";
    player.innerHTML = `<div class="ncm-panel"><div class="ncm-info"><span class="ncm-title"></span><div class="ncm-row"><button class="ncm-btn" data-toggle aria-label="播放">▶</button><button class="ncm-btn" data-next aria-label="下一首">⏭</button><button class="ncm-btn" data-volume aria-label="静音">🔊</button><input class="ncm-volume" type="range" min="0" max="1" step=".01" value=".8" aria-label="音量"><span class="ncm-time">0:00 / 0:00</span></div><input class="ncm-progress" type="range" min="0" max="100" step=".1" value="0" aria-label="播放进度"><div class="ncm-modes"><button class="ncm-mode" data-mode="loop" title="列表循环播放">↻</button><button class="ncm-mode" data-mode="sequence" title="列表单次播放">⇄</button><button class="ncm-mode" data-mode="single" title="当前歌曲单次播放">↪</button></div></div></div><button class="ncm-disc" aria-label="展开或拖动播放器"><span class="ncm-cover"></span></button><audio preload="metadata"></audio>`;
    document.body.append(player); audio = $("audio", player); audio.volume = .8;
    const disc = $(".ncm-disc", player), cover = $(".ncm-cover", player), title = $(".ncm-title", player), toggle = $("[data-toggle]", player), progress = $(".ncm-progress", player), duration = $(".ncm-time", player), volume = $(".ncm-volume", player), volumeButton = $("[data-volume]", player);
    spin = disc.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { duration: 8000, iterations: Infinity }); spin.pause();
    const setMode = next => { mode = next; player.querySelectorAll("[data-mode]").forEach(button => button.classList.toggle("active", button.dataset.mode === mode)); }; setMode(mode);
    const load = (next, shouldPlay = !audio.paused) => { index = (next + playlist.length) % playlist.length; const song = playlist[index]; title.textContent = song.title; cover.innerHTML = song.cover ? `<img src="${song.cover}" alt="">` : "<span>♫</span>"; audio.src = `https://music.163.com/song/media/outer/url?id=${encodeURIComponent(song.id)}.mp3`; audio.load(); if (shouldPlay) audio.play().catch(() => {}); };
    audio.addEventListener("play", () => { toggle.textContent = icon(true); toggle.setAttribute("aria-label", "停止播放"); startSpin(); });
    audio.addEventListener("pause", () => { toggle.textContent = icon(false); toggle.setAttribute("aria-label", "播放"); stopSpin(); });
    audio.addEventListener("timeupdate", () => { progress.value = audio.duration ? audio.currentTime / audio.duration * 100 : 0; duration.textContent = `${time(audio.currentTime)} / ${time(audio.duration)}`; });
    audio.addEventListener("ended", () => { if (mode === "single") { audio.currentTime = 0; audio.play().catch(() => {}); } else if (index < playlist.length - 1 || mode === "loop") load(index + 1, true); else { audio.currentTime = 0; } });
    toggle.onclick = () => audio.paused ? audio.play().catch(() => {}) : audio.pause(); $("[data-next]", player).onclick = () => load(index + 1, true);
    progress.oninput = () => { if (audio.duration) audio.currentTime = audio.duration * progress.value / 100; };
    volume.oninput = () => { audio.volume = volume.value; audio.muted = false; volumeButton.textContent = "🔊"; }; volumeButton.onclick = () => { audio.muted = !audio.muted; volumeButton.textContent = audio.muted ? "🔇" : "🔊"; };
    player.querySelectorAll("[data-mode]").forEach(button => button.onclick = () => setMode(button.dataset.mode));
    let sx, sy, ox, oy; disc.onpointerdown = event => { sx = event.clientX; sy = event.clientY; const rect = player.getBoundingClientRect(); ox = rect.left; oy = rect.top; dragging = false; disc.setPointerCapture(event.pointerId); };
    disc.onpointermove = event => { if (!disc.hasPointerCapture(event.pointerId)) return; const dx = event.clientX - sx, dy = event.clientY - sy; dragging ||= Math.abs(dx) + Math.abs(dy) > 3; if (!dragging) return; player.style.left = `${Math.max(8, Math.min(innerWidth - player.offsetWidth - 8, ox + dx))}px`; player.style.top = `${Math.max(8, Math.min(innerHeight - player.offsetHeight - 8, oy + dy))}px`; player.style.right = player.style.bottom = "auto"; };
    disc.onpointerup = event => { if (disc.hasPointerCapture(event.pointerId)) disc.releasePointerCapture(event.pointerId); if (!dragging) player.classList.toggle("open"); };
    load(0, false); if (config.autoplay !== false) audio.play().catch(() => {});
  };
  const sync = () => { const config = getConfig(), key = config && JSON.stringify(config); if (key === configKey) return; configKey = key; destroy(); if (config) make(config); };
  document.addEventListener("DOMContentLoaded", sync); document.addEventListener("document$", sync);
})();
