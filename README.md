# Organization Pages Starter (JP)

これは **GitHub 組織** 用の GitHub Pages スターターです。

## 手順（最短）

1. 組織で新規リポジトリを作成（**Public**）
2. リポジトリ名を **`ORGNAME.github.io`** にする（ORGNAME は組織のID）
3. このフォルダの中身をアップロード（`index.html` など）
4. リポジトリの **Settings > Pages** で
   - Build and deployment: **Deploy from a branch**
   - Branch: `main` / Folder: `/ (root)` → **Save**
5. 数分後、`https://ORGNAME.github.io/` で表示されます

## プロジェクトサイトも使う場合

- 別リポジトリで Pages を有効化 → URL は `https://ORGNAME.github.io/リポジトリ名/`

## よくあるハマり

- リポジトリ名の綴りが **`ORGNAME.github.io`** と一致していない
- `index.html` がルート直下に無い
- 相対パスではなく `/about.html` のように先頭 `/` を付けてリンクしてしまう（プロジェクトサイトで壊れる）
