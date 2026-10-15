// 外接屏清晰度计算器的核心算法 —— 构建期（静态表格）和浏览器端（交互）共用一份。
//
// 依据（与 /setup/external-monitor-for-macbook-air/ 一致）：
//   · macOS 的界面按约 110 逻辑 ppi 设计；Retina 屏 = 2× 渲染，Apple 自家桌面屏全是 218 ppi。
//   · 2× 时逻辑 ppi = 物理 ppi / 2，落在 90–125 之间 → 整数缩放、清晰且大小合适。
//   · 1× 时逻辑 ppi = 物理 ppi，落在 90–125 之间 → 大小合适但不是 Retina。
//   · 中间地带只能非整数缩放：macOS 按「看起来像」的 2 倍渲染，再整体压到面板分辨率。
// 阈值是经验区间，不是 Apple 公布的数字 —— 页面上要如实这么说。

export type Verdict = 'retina' | 'native' | 'fractional' | 'dense' | 'low';

export interface DisplayResult {
  ppi: number;
  widthIn: number;
  heightIn: number;
  verdict: Verdict;
  /** 推荐的「看起来像」分辨率（逻辑像素） */
  looksLike: [number, number];
  /** 该模式下 macOS 内部渲染的缓冲区 */
  renderAt: [number, number];
  /** 渲染缓冲 → 面板的缩放比；1 = 无重采样 */
  resample: number;
  /** 超过这个距离，单个像素不再可分辨（1 角分视力） */
  pixelFreeDistanceIn: number;
}

/** macOS 的舒适逻辑密度 */
export const TARGET_LOGICAL_PPI = 110;
const COMFORT_MIN = 90;
const COMFORT_MAX = 125;

const even = (n: number) => Math.max(2, Math.round(n / 2) * 2);

export function analyse(diagonalIn: number, w: number, h: number): DisplayResult | null {
  if (!(diagonalIn > 0 && w > 0 && h > 0)) return null;
  const ppi = Math.hypot(w, h) / diagonalIn;
  const base = {
    ppi,
    widthIn: w / ppi,
    heightIn: h / ppi,
    pixelFreeDistanceIn: 3438 / ppi,
  };

  const half = ppi / 2;
  if (half >= COMFORT_MIN && half <= COMFORT_MAX) {
    const lw = even(w / 2), lh = even(h / 2);
    return { ...base, verdict: 'retina', looksLike: [lw, lh], renderAt: [w, h], resample: 1 };
  }
  if (ppi >= COMFORT_MIN && ppi <= COMFORT_MAX) {
    return { ...base, verdict: 'native', looksLike: [w, h], renderAt: [w, h], resample: 1 };
  }
  if (ppi < COMFORT_MIN) {
    return { ...base, verdict: 'low', looksLike: [w, h], renderAt: [w, h], resample: 1 };
  }

  // 非整数缩放：按目标逻辑密度选「看起来像」，再算渲染缓冲和压缩比
  // 宽度吸附到 64 的倍数，接近 macOS 显示设置里实际给出的档位（27″ 4K → 2560 × 1440）
  const scale = ppi / TARGET_LOGICAL_PPI;
  const lw = Math.max(64, Math.round(w / scale / 64) * 64);
  const lh = even((lw * h) / w);
  const rw = lw * 2, rh = lh * 2;
  return {
    ...base,
    verdict: half > COMFORT_MAX ? 'dense' : 'fractional',
    looksLike: [lw, lh],
    renderAt: [rw, rh],
    resample: w / rw,
  };
}

export const VERDICT_TEXT: Record<Verdict, { label: string; tone: 'good' | 'ok' | 'warn'; body: string }> = {
  retina: {
    label: 'Clean 2× — Retina, no scaling blur',
    tone: 'good',
    body: 'macOS draws every interface pixel as an exact 2 × 2 block. Text is as sharp as the panel allows and nothing is resampled. This is the density Apple builds its own displays around.',
  },
  native: {
    label: 'Native 1× — right size, not Retina',
    tone: 'ok',
    body: 'At its native resolution the interface is a comfortable size, so no scaling is needed and nothing is blurred. Text is rendered at standard density, though: visibly less smooth than a Retina screen, which matters most if you read and write all day.',
  },
  fractional: {
    label: 'Fractional scaling — the in-between zone',
    tone: 'warn',
    body: 'At 1× the interface is too small; at a clean 2× it is too large. To get a comfortable size macOS renders a bigger frame and squeezes it onto the panel by a non-integer factor. It works, and many people never mind it, but fine text loses some crispness and the GPU does extra work.',
  },
  dense: {
    label: 'Very high density — tiny at 2×',
    tone: 'ok',
    body: 'Even a clean 2× leaves the interface small at desk distance. Choosing a larger-text mode means non-integer scaling. Usually a portable or laptop-class panel; sharpness is not the problem here, size is.',
  },
  low: {
    label: 'Low density — pixels visible up close',
    tone: 'warn',
    body: 'Below about 90 ppi the interface is large at 1× and individual pixels are easy to see at normal desk distance. Fine for video or at a distance, poor for reading text.',
  },
};

export interface Preset {
  name: string;
  d: number;
  w: number;
  h: number;
}

export const PRESETS: Preset[] = [
  { name: '24″ 1080p', d: 24, w: 1920, h: 1080 },
  { name: '27″ 1440p', d: 27, w: 2560, h: 1440 },
  { name: '24″ 4K', d: 24, w: 3840, h: 2160 },
  { name: '27″ 4K', d: 27, w: 3840, h: 2160 },
  { name: '32″ 4K', d: 32, w: 3840, h: 2160 },
  { name: '27″ 5K', d: 27, w: 5120, h: 2880 },
  { name: '32″ 6K', d: 32, w: 6016, h: 3384 },
  { name: '34″ ultrawide 3440 × 1440', d: 34, w: 3440, h: 1440 },
  { name: '34″ 5K2K ultrawide', d: 34, w: 5120, h: 2160 },
  { name: '49″ 5120 × 1440', d: 49, w: 5120, h: 1440 },
];
