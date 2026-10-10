#!/usr/bin/env bash
# 发布后主动通知 IndexNow（Bing / Yandex / Seznam 共用端点）。
#
# 为什么需要它：IndexNow 只在**内容变化时**推送才有意义。接了 key 文件
# 只是拿到资格，不发请求等于没接。这个脚本把"发完文章顺手推一次"变成一条命令。
#
# 用法：
#   npm run indexnow                    # 推送 sitemap 里的全部 URL
#   npm run indexnow -- /tools/foo/     # 只推送指定路径（可给多个）
#   npm run indexnow -- https://mossbysea.com/tools/foo/
#
# 覆盖项（一般不用改）：
#   INDEXNOW_HOST=example.com   npm run indexnow
#   INDEXNOW_KEY=<key>          npm run indexnow
set -euo pipefail
cd "$(dirname "$0")/.."

HOST="${INDEXNOW_HOST:-mossbysea.com}"
ENDPOINT="https://api.indexnow.org/indexnow"
UA="mossbysea-indexnow/1.0 (+https://$HOST/)"

# 本机若把 HTTP(S)_PROXY 指向 127.0.0.1（代理软件的常见做法），
# curl 会被本地代理接管，必须显式绕过，否则拿到的响应不可信。
CURL_OPTS=(-sS -m 30)
case "${HTTP_PROXY:-}${HTTPS_PROXY:-}${http_proxy:-}${https_proxy:-}" in
  *127.0.0.1* | *localhost*) CURL_OPTS+=(--noproxy '*') ;;
esac

# ── 1. 找 key ──────────────────────────────────────────────────────────
# IndexNow 要求站点根目录能公开访问 <key>.txt，且内容就是 key 本身。
# 这里直接从 public/ 反查，避免脚本里再抄一份 key 导致两边不一致。
KEY="${INDEXNOW_KEY:-}"
if [ -z "$KEY" ]; then
  KEY=$(find public -maxdepth 1 -name '*.txt' -exec basename {} .txt \; 2>/dev/null \
    | grep -E '^[0-9a-fA-F]{8,128}$' | head -1 || true)
fi
if [ -z "$KEY" ]; then
  echo "✗ public/ 里找不到 IndexNow key 文件（<key>.txt，内容为 key 本身）"
  echo "  生成一个："
  echo "    K=\$(openssl rand -hex 16) && printf '%s' \"\$K\" > \"public/\$K.txt\""
  exit 1
fi
KEYLOC="https://$HOST/$KEY.txt"

# ── 2. 组 URL 列表 ─────────────────────────────────────────────────────
# Astro 的 sitemap-index.xml 只是外壳，里面指向 sitemap-0.xml。
# collect() 递归展开一层，兼容两种结构。
collect() {
  local body locs sub
  body=$(curl "${CURL_OPTS[@]}" -A "$UA" "$1") || return 1
  locs=$(printf '%s' "$body" | grep -oE '<loc>[^<]+' | sed 's/<loc>//' || true)
  if printf '%s' "$locs" | grep -qE '\.xml$'; then
    while IFS= read -r sub; do
      [ -n "$sub" ] && collect "$sub"
    done <<<"$locs"
  else
    printf '%s\n' "$locs"
  fi
}

urls=()
if [ "$#" -gt 0 ]; then
  for a in "$@"; do
    case "$a" in
      http*) urls+=("$a") ;;
      /*) urls+=("https://$HOST$a") ;;
      *) urls+=("https://$HOST/$a") ;;
    esac
  done
  echo "→ 推送指定 URL（${#urls[@]} 条）"
else
  echo "→ 从 https://$HOST/sitemap-index.xml 读取全部 URL ..."
  while IFS= read -r u; do
    [ -n "$u" ] && urls+=("$u")
  done < <(collect "https://$HOST/sitemap-index.xml")
fi

if [ "${#urls[@]}" -eq 0 ]; then
  echo "✗ 一条 URL 都没取到，中止（不向 IndexNow 发空请求）"
  exit 1
fi

# ── 3. 先确认 key 文件真的能公开访问 ───────────────────────────────────
# 这一步失败时提交会返回 403，错误信息很难看出是 key 的问题。
code=$(curl "${CURL_OPTS[@]}" -A "$UA" -o /dev/null -w '%{http_code}' "$KEYLOC")
if [ "$code" != "200" ]; then
  echo "✗ key 文件不可访问：$KEYLOC → HTTP $code"
  echo "  提交上去也会被拒。先确认它已经部署到线上。"
  exit 1
fi
echo "✓ key 文件可访问：$KEYLOC"

# ── 4. 提交 ────────────────────────────────────────────────────────────
list=$(printf '%s\n' "${urls[@]}" \
  | sed 's/\\/\\\\/g; s/"/\\"/g; s/^/"/; s/$/"/' \
  | paste -sd, -)

PAYLOAD=$(mktemp)
RESP=$(mktemp)
trap 'rm -f "$PAYLOAD" "$RESP"' EXIT

cat >"$PAYLOAD" <<JSON
{
  "host": "$HOST",
  "key": "$KEY",
  "keyLocation": "$KEYLOC",
  "urlList": [$list]
}
JSON

echo "→ 提交 ${#urls[@]} 条 URL 到 $ENDPOINT ..."
code=$(curl "${CURL_OPTS[@]}" -m 45 -o "$RESP" -w '%{http_code}' \
  -X POST "$ENDPOINT" \
  -H 'Content-Type: application/json; charset=utf-8' \
  -A "$UA" \
  --data-binary "@$PAYLOAD")

body=$(cat "$RESP")
case "$code" in
  200) echo "✓ HTTP 200 —— 已接受" ;;
  202) echo "✓ HTTP 202 —— 已接受，等待处理" ;;
  400) echo "✗ HTTP 400 —— 请求格式错误"; echo "$body" ;;
  403) echo "✗ HTTP 403 —— key 校验失败（key 文件内容或路径不对）"; echo "$body" ;;
  422) echo "✗ HTTP 422 —— URL 不属于该 host，或 key 与 host 不匹配"; echo "$body" ;;
  429) echo "⚠ HTTP 429 —— 推送过于频繁，等下再试（不要循环重试）"; echo "$body" ;;
  *) echo "✗ HTTP $code"; echo "$body" ;;
esac

if [ -n "$body" ] && [ "$code" != "200" ] && [ "$code" != "202" ]; then
  exit 1
fi
