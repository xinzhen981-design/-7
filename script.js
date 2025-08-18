// ちひろガチャ ロジック
(function () {
  'use strict';

  /**
   * 確率設定
   * - 小吉: 60%
   * - 中吉: 30%
   * - 大吉: 10%
   */
  const PROBABILITIES = {
    small: 0.25, // 合計1にするため small+medium=0.6, big=0.4
    medium: 0.35,
    big: 0.4
  };

  const IMAGES = {
    machine: './スクリーンショット 2025-07-30 16.55.24.png',
    small: './中吉 (3).png',
    medium: './中吉 (5).png',
    big: './中吉 (7).png'
  };

  const BIG_URL = 'https://note.com/calm_worm6243/n/n768038a644d5';

  const button = document.getElementById('spinButton');
  const machineImg = document.getElementById('machineImg');
  const resultImg = document.getElementById('resultImg');
  const resultText = document.getElementById('resultText');
  const retryButton = document.getElementById('retryButton');
  const messageButton = document.getElementById('messageButton');
  const specialButton = document.getElementById('specialButton');
  const oya = document.getElementById('oyaOverlay');
  const cowField = document.getElementById('cowField');
  const burst = document.getElementById('burstOverlay');
  const rare = document.getElementById('rareOverlay');
  const gachaText = document.getElementById('gachaText');
  const flash = document.getElementById('flashOverlay');

  // 画像を先読み
  [IMAGES.small, IMAGES.medium, IMAGES.big].forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  // 初期表示で待機中アニメを適用
  machineImg.classList.add('idle-hard-shake');

  function drawResult() {
    const r = Math.random();
    if (r < PROBABILITIES.big) return 'big';
    if (r < PROBABILITIES.big + PROBABILITIES.medium) return 'medium';
    return 'small';
  }

  function show(result) {
    // 結果表示ではテキストは使わず、画像のみ表示
    resultText.hidden = true;
    // 押下ボタン（メイン）は隠す、もう一度回すボタンを出す
    button.disabled = true;
    button.style.visibility = 'hidden';
    switch (result) {
      case 'big':
        // バースト演出はボタン側で完了させる
        burst.classList.remove('show');
        // 大吉時は「おや…？」演出を先に表示
        oya.classList.add('show');
        setTimeout(() => {
          oya.classList.remove('show');
          resultImg.src = IMAGES.big;
          // 特別ボタンを表示（自動遷移は削除）
          specialButton.hidden = false;
        }, 3000);
        break;
      case 'medium':
        burst.classList.remove('show');
        resultImg.src = IMAGES.medium;
        // 中吉メッセージボタンを表示
        messageButton.textContent = '中吉おめでとう！';
        messageButton.hidden = false;
        break;
      default:
        burst.classList.remove('show');
        resultImg.src = IMAGES.small;
        // 小吉メッセージボタンを表示
        messageButton.textContent = '小吉おめでとう！';
        messageButton.hidden = false;
        break;
    }
    // リトライボタンを表示
    retryButton.hidden = false;
  }

  function shakeOnce() {
    machineImg.classList.remove('is-shaking');
    // 再トリガー用にリフロー
    void machineImg.offsetWidth;
    machineImg.classList.add('is-shaking');
  }

  function hardShakeWithImage() {
    // 抽選中は別画像に切替えて激しく揺らす
    const originalSrc = machineImg.src;
    machineImg.classList.remove('idle-hard-shake');
    machineImg.src = './ChatGPT Image 2025年7月30日 17_15_27.png';
    // 画像読み込み後にアニメーションを適用
    machineImg.onload = () => {
      // 勢いよく出てくるアニメーションを適用
      machineImg.classList.add('burst-in');
      // 出てくるアニメーション完了後に激しく揺れるアニメーションを開始
      setTimeout(() => {
        machineImg.classList.remove('burst-in');
        machineImg.classList.add('is-hard-shaking');
      }, 800);
    };
    return () => {
      machineImg.classList.remove('is-hard-shaking');
      // フェード後はガチャ機画像を非表示にする（結果が出るまで再表示しない）
      machineImg.src = originalSrc;
      machineImg.style.display = 'none';
    };
  }

  // かわいい牛が走る演出をランダム生成
  function spawnCow() {
    if (!cowField) return;
    const cow = document.createElement('div');
    cow.className = 'cow';
    cow.textContent = '🐮';
    const y = Math.floor(Math.random() * 95); // 0〜95vh
    const x = Math.floor(Math.random() * 95); // 0〜95vw
    const size = Math.floor(Math.random() * 18) + 20; // 20〜38px
    const dur = (Math.random() * 1.6 + 1.6).toFixed(2) + 's'; // 1.6〜3.2s
    const delay = (Math.random() * 1.2).toFixed(2) + 's';
    cow.style.setProperty('--y', y + 'vh');
    cow.style.setProperty('--x', x + 'vw');
    cow.style.setProperty('--size', size + 'px');
    cow.style.setProperty('--dur', dur);
    cow.style.setProperty('--delay', delay);
    cowField.appendChild(cow);
    // 一定時間後に消える
    setTimeout(() => { cow.remove(); }, 8000);
  }

  // 常時たくさん散らす
  setInterval(() => {
    const n = 4 + Math.floor(Math.random() * 6); // 4〜9個
    for (let i = 0; i < n; i += 1) {
      setTimeout(spawnCow, i * 120);
    }
  }, 1200);

  button.addEventListener('click', () => {
    const restore = hardShakeWithImage();
    resultText.hidden = true;
    resultImg.removeAttribute('src');
    // 全体光る演出
    flash.classList.add('show');
    setTimeout(() => { flash.classList.remove('show'); }, 600);

    // ドキドキさせるための待ち時間を長めに
    const initialDelayMs = 2500; // 押下後の揺れ時間（2.5秒に変更）
    const fadeDurationMs = 400; // フェードアウト時間 (CSS と一致)
    const burstDurationMs = 4000; // バーストの見せ時間（4秒に延長）

    // ガチャガチャ文字を表示
    setTimeout(() => {
      gachaText.classList.add('show');
    }, 300);

    setTimeout(() => {
      // 回している画像（差し替え中の machineImg）をフェードアウト
      machineImg.classList.add('fade-out');
      gachaText.classList.remove('show');
      setTimeout(() => {
        // バーストを表示
        burst.classList.add('show');
        // パッカーン演出中は背景の牛画像を非表示
        document.body.style.setProperty('--cow-opacity', '0');
        setTimeout(() => {
          burst.classList.remove('show');
          // パッカーン演出終了後、背景の牛画像を再表示
          document.body.style.setProperty('--cow-opacity', '0.15');
          machineImg.classList.remove('fade-out');
          const result = drawResult();
          show(result);
        }, burstDurationMs);
      }, fadeDurationMs);
    }, initialDelayMs);

    // 機械の画像は一定時間後に元へ
    setTimeout(() => { restore(); }, initialDelayMs + fadeDurationMs + burstDurationMs + 120);
  });

  // もう一度回す: 初期状態に戻す
  retryButton.addEventListener('click', () => {
    retryButton.hidden = true;
    messageButton.hidden = true;
    specialButton.hidden = true;
    resultImg.removeAttribute('src');
    button.disabled = false;
    button.style.visibility = 'visible';
    // ガチャ機画像を再表示して初期状態へ
    machineImg.style.display = '';
    machineImg.classList.remove('fade-out', 'is-hard-shaking', 'is-shaking');
    machineImg.src = IMAGES.machine;
    // 待機中アニメを再開
    machineImg.classList.add('idle-hard-shake');
  });

  // 特別ボタンクリックでnoteへ遷移
  specialButton.addEventListener('click', () => {
    window.location.href = BIG_URL;
  });
})();


