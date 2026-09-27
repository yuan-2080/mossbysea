#!/bin/bash
# 发布前敏感词扫描。词表放在 scripts/leak-words.txt（不进仓库）。
# 用法：npm run check:leak
set -uo pipefail
cd "$(dirname "$0")/.."
WORDS="scripts/leak-words.txt"

if [ ! -f "$WORDS" ]; then
  echo "缺少词表 $WORDS —— 见 scripts/leak-words.example.txt"
  exit 1
fi

hits=0
while IFS= read -r w; do
  [ -z "$w" ] && continue
  case "$w" in \#*) continue ;; esac
  found=$(grep -rn --fixed-strings "$w" src/content src/pages 2>/dev/null)
  if [ -n "$found" ]; then
    echo "✗ 命中：$w"
    echo "$found" | sed 's/^/    /'
    hits=$((hits+1))
  fi
done < "$WORDS"

if [ "$hits" -eq 0 ]; then
  echo "✓ 无命中，可以发布"
  exit 0
fi
echo ""
echo "共 $hits 个词命中，处理后再发布。"
exit 1
