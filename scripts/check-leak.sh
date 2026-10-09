#!/bin/bash
# 发布前自查：敏感词 + 隐私快检。
# 词表放在 scripts/leak-words.txt（不进仓库，已 gitignore）。
# 用法：npm run check:leak
set -uo pipefail
cd "$(dirname "$0")/.."
WORDS="scripts/leak-words.txt"

if [ ! -f "$WORDS" ]; then
  echo "缺少词表 $WORDS —— 见 scripts/leak-words.example.txt"
  exit 1
fi

fail=0

# ═══ 第一部分：敏感词扫描（词表驱动，固定字符串匹配）═══
# 只扫**会渲染上线的内容**（页面/组件/布局）。README 和 scripts 是运营文档，
# 不是发布物，用内容词表扫它们只会产生噪音。
# 注意排除词表本身，否则它会命中自己。
echo "── 敏感词 ──"
hits=0
while IFS= read -r w; do
  [ -z "$w" ] && continue
  case "$w" in \#*) continue ;; esac
  found=$(grep -rn --fixed-strings --exclude="leak-words.txt" "$w" \
    src/content src/pages src/components src/layouts 2>/dev/null)
  if [ -n "$found" ]; then
    echo "✗ 命中：$w"
    echo "$found" | sed 's/^/    /'
    hits=$((hits+1))
  fi
done < "$WORDS"

if [ "$hits" -eq 0 ]; then
  echo "✓ 无命中"
else
  echo ""
  echo "共 $hits 个词命中，处理后再发布。"
  fail=1
fi

echo ""

# ═══ 第二部分：隐私快检（规则驱动，不依赖词表）═══
echo "── 隐私快检 ──"

# 1. 绝对本地路径（/Users/名字/ 会暴露系统用户名；已脱敏的 /Users/... 放行）。
#    排除本脚本自身，否则模式字符串会命中自己。
p=$(git grep -n "/Users/" -- . ':(exclude)scripts/check-leak.sh' 2>/dev/null | grep -v "/Users/\.\.\." || true)
if [ -n "$p" ]; then
  echo "✗ 本地绝对路径："
  echo "$p" | sed 's/^/    /'
  fail=1
else
  echo "✓ 无本地绝对路径"
fi

# 2. 常见密钥格式
k=$(git grep -nIE "sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY" -- . 2>/dev/null || true)
if [ -n "$k" ]; then
  echo "✗ 疑似密钥："
  echo "$k" | sed 's/^/    /'
  fail=1
else
  echo "✓ 无疑似密钥"
fi

# 3. 凭据类文件是否被跟踪
f=$(git ls-files | grep -iE "\.env$|\.pem$|id_rsa|id_ed25519|secret|credential" || true)
if [ -n "$f" ]; then
  echo "✗ 凭据类文件被跟踪："
  echo "$f" | sed 's/^/    /'
  fail=1
else
  echo "✓ 无凭据类文件"
fi

# 4. 提交身份（GitHub 上公开可见；不应是个人邮箱/真名）
email=$(git config user.email || true)
case "$email" in
  *@users.noreply.github.com|*mossbysea.com)
    echo "✓ 提交身份：$(git config user.name) <$email>" ;;
  "")
    echo "✗ 未设置 git user.email" ; fail=1 ;;
  *)
    echo "✗ 提交身份疑似个人邮箱：<$email> —— 改成域名邮箱或 noreply 地址"
    fail=1 ;;
esac

# 5. 图片无法被文本扫描 —— 必须人工过目。
#    截图是最大的泄漏面：终端提示符（用户名@主机名）、窗口标题、
#    通知横幅、浏览器标签页、Dock、菜单栏，都在图里。
imgs=$(git ls-files src/assets/posts 2>/dev/null || true)
if [ -n "$imgs" ]; then
  echo "⚠ 以下图片文本扫描覆盖不到，发布前逐张过目："
  echo "$imgs" | sed 's/^/    /'
  echo "    检查项：用户名/主机名 · 窗口标题 · 通知与标签页 · 收藏栏 · 文件名"
fi

echo ""
if [ "$fail" -eq 0 ]; then
  echo "✓ 自查通过，可以发布"
  exit 0
fi
echo "✗ 自查未通过，处理后发布。"
exit 1
