(() => {
  const translations = {
    en: {
      title: "Background music",
      trackLabel: "Choose a song",
      statusReady: "Playback starts when you press play.",
      statusPlaying: "Now playing: {track}.",
      statusPaused: "Paused.",
      statusEnded: "Track ended. Press play to replay.",
      statusError: "This MP3 could not be played. Check that the file is present and supported.",
      play: "Play",
      pause: "Pause",
      volume: "Volume",
      track: "Track {number}"
    },
    es: {
      title: "Música de fondo",
      trackLabel: "Elige una canción",
      statusReady: "La reproducción comienza al pulsar reproducir.",
      statusPlaying: "Reproduciendo: {track}.",
      statusPaused: "En pausa.",
      statusEnded: "Pista terminada. Pulsa reproducir para volver a escucharla.",
      statusError: "No se pudo reproducir este MP3. Comprueba que el archivo exista y sea compatible.",
      play: "Reproducir",
      pause: "Pausar",
      volume: "Volumen",
      track: "Pista {number}"
    },
    fr: {
      title: "Musique de fond",
      trackLabel: "Choisir une chanson",
      statusReady: "La lecture commence lorsque vous appuyez sur Lecture.",
      statusPlaying: "Lecture : {track}.",
      statusPaused: "En pause.",
      statusEnded: "Piste terminée. Appuyez sur Lecture pour la réécouter.",
      statusError: "Ce fichier MP3 n’a pas pu être lu. Vérifiez qu’il existe et qu’il est compatible.",
      play: "Lire",
      pause: "Pause",
      volume: "Volume",
      track: "Piste {number}"
    },
    de: {
      title: "Hintergrundmusik",
      trackLabel: "Song auswählen",
      statusReady: "Die Wiedergabe beginnt, wenn Sie auf Wiedergabe drücken.",
      statusPlaying: "Wird abgespielt: {track}.",
      statusPaused: "Pausiert.",
      statusEnded: "Titel beendet. Zum erneuten Abspielen auf Wiedergabe drücken.",
      statusError: "Diese MP3-Datei konnte nicht abgespielt werden. Prüfen Sie, ob die Datei vorhanden und kompatibel ist.",
      play: "Abspielen",
      pause: "Pause",
      volume: "Lautstärke",
      track: "Titel {number}"
    },
    zh: {
      title: "背景音乐",
      trackLabel: "选择歌曲",
      statusReady: "点击播放后开始播放。",
      statusPlaying: "正在播放：{track}。",
      statusPaused: "已暂停。",
      statusEnded: "曲目已结束。点击播放可重新收听。",
      statusError: "无法播放此 MP3。请检查文件是否存在且格式受支持。",
      play: "播放",
      pause: "暂停",
      volume: "音量",
      track: "曲目 {number}"
    },
    hi: {
      title: "बैकग्राउंड संगीत",
      trackLabel: "गाना चुनें",
      statusReady: "प्ले दबाने पर संगीत शुरू होगा।",
      statusPlaying: "चल रहा है: {track}।",
      statusPaused: "रुका हुआ।",
      statusEnded: "ट्रैक समाप्त। दोबारा सुनने के लिए प्ले दबाएँ।",
      statusError: "यह MP3 नहीं चल सका। जाँचें कि फ़ाइल मौजूद है और समर्थित है।",
      play: "चलाएँ",
      pause: "रोकें",
      volume: "आवाज़",
      track: "ट्रैक {number}"
    },
    ar: {
      title: "موسيقى الخلفية",
      trackLabel: "اختر أغنية",
      statusReady: "يبدأ التشغيل عند الضغط على تشغيل.",
      statusPlaying: "قيد التشغيل: {track}.",
      statusPaused: "متوقف مؤقتًا.",
      statusEnded: "انتهى المقطع. اضغط تشغيل للاستماع إليه مجددًا.",
      statusError: "تعذّر تشغيل ملف MP3 هذا. تحقق من وجود الملف ودعم تنسيقه.",
      play: "تشغيل",
      pause: "إيقاف مؤقت",
      volume: "مستوى الصوت",
      track: "المقطع {number}"
    },
    pt: {
      title: "Música de fundo",
      trackLabel: "Escolha uma música",
      statusReady: "A reprodução começa quando você pressiona reproduzir.",
      statusPlaying: "Reproduzindo: {track}.",
      statusPaused: "Pausado.",
      statusEnded: "Faixa concluída. Pressione reproduzir para ouvir novamente.",
      statusError: "Não foi possível reproduzir este MP3. Verifique se o arquivo existe e é compatível.",
      play: "Reproduzir",
      pause: "Pausar",
      volume: "Volume",
      track: "Faixa {number}"
    },
    ru: {
      title: "Фоновая музыка",
      trackLabel: "Выберите песню",
      statusReady: "Воспроизведение начнётся после нажатия кнопки.",
      statusPlaying: "Сейчас играет: {track}.",
      statusPaused: "Пауза.",
      statusEnded: "Трек завершён. Нажмите воспроизведение, чтобы слушать снова.",
      statusError: "Не удалось воспроизвести этот MP3. Проверьте наличие файла и поддержку формата.",
      play: "Воспроизвести",
      pause: "Пауза",
      volume: "Громкость",
      track: "Трек {number}"
    },
    ja: {
      title: "BGM",
      trackLabel: "曲を選択",
      statusReady: "再生ボタンを押すと音楽が始まります。",
      statusPlaying: "再生中：{track}。",
      statusPaused: "一時停止中。",
      statusEnded: "曲が終了しました。再生ボタンでもう一度聴けます。",
      statusError: "このMP3を再生できません。ファイルの存在と形式をご確認ください。",
      play: "再生",
      pause: "一時停止",
      volume: "音量",
      track: "トラック {number}"
    }
  };

  function initializeMusicPlayer() {
    const player = document.querySelector(".background-music-player");
    if (!player) return;

    const trackSelect = player.querySelector("select");
    const audio = player.querySelector("audio");
    const status = player.querySelector("[role='status']");
    const title = player.querySelector("summary");
    const label = player.querySelector("label");
    const playButton = player.querySelector("button");
    const volumeLabel = player.querySelector("[data-volume-label]");
    const volumeControl = player.querySelector("input[type='range']");
    if (!trackSelect || !audio || !status || !title || !label || !playButton || !volumeLabel || !volumeControl) {
      throw new Error("The background music player markup is incomplete.");
    }

    const tracks = Array.from({ length: 31 }, (_, index) => {
      const number = index + 1;
      return {
        number,
        file: number === 1 ? "1 Lead Vocal.mp3" : `1 Lead Vocal (${number}).mp3`
      };
    });

    function currentLanguage() {
      const guideLanguage = document.getElementById("guideLanguage");
      const appLanguage = document.getElementById("langSelector");
      return (guideLanguage?.value || appLanguage?.value || "en").split("-")[0];
    }

    let playbackState = "ready";
    let playbackError = "";

    function localize() {
      const language = translations[currentLanguage()] || translations.en;
      title.textContent = `♫ ${language.title}`;
      label.textContent = language.trackLabel;
      trackSelect.setAttribute("aria-label", language.trackLabel);
      volumeLabel.textContent = language.volume;
      volumeControl.setAttribute("aria-label", language.volume);
      Array.from(trackSelect.options).forEach((option, index) => {
        option.textContent = language.track.replace("{number}", String(tracks[index].number));
      });
      playButton.textContent = audio.paused ? language.play : language.pause;
      playButton.setAttribute("aria-pressed", String(!audio.paused));
      const selectedTrack = language.track.replace("{number}", String(tracks[trackSelect.selectedIndex].number));
      status.textContent = playbackState === "playing"
        ? language.statusPlaying.replace("{track}", selectedTrack)
        : playbackState === "error"
          ? `${language.statusError} (${playbackError})`
          : language[`status${playbackState[0].toUpperCase()}${playbackState.slice(1)}`];
    }

    tracks.forEach(track => {
      const option = document.createElement("option");
      option.value = track.file;
      option.textContent = `Track ${track.number}`;
      trackSelect.append(option);
    });

    function selectTrack() {
      if (!audio.paused) audio.pause();
      playbackState = "ready";
      playbackError = "";
      localize();
    }

    trackSelect.addEventListener("change", selectTrack);
    playButton.addEventListener("click", async () => {
      if (!audio.paused) {
        audio.pause();
        return;
      }

      const source = new URL(trackSelect.value, document.baseURI).href;
      if (audio.src !== source) audio.src = source;
      try {
        await audio.play();
      } catch (error) {
        playbackState = "error";
        playbackError = error.name;
        localize();
      }
    });
    audio.addEventListener("playing", () => {
      playbackState = "playing";
      localize();
    });
    audio.addEventListener("pause", () => {
      if (playbackState !== "error") playbackState = "paused";
      localize();
    });
    audio.addEventListener("ended", () => {
      playbackState = "ended";
      localize();
    });
    audio.addEventListener("error", () => {
      playbackState = "error";
      playbackError = audio.error ? `MediaError ${audio.error.code}` : "Media error";
      localize();
    });
    volumeControl.addEventListener("input", () => {
      audio.volume = Number(volumeControl.value);
    });
    document.getElementById("guideLanguage")?.addEventListener("change", localize);
    document.getElementById("langSelector")?.addEventListener("change", localize);

    audio.volume = 0.35;
    audio.loop = true;
    volumeControl.value = String(audio.volume);
    selectTrack();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMusicPlayer, { once: true });
  } else {
    initializeMusicPlayer();
  }
})();
