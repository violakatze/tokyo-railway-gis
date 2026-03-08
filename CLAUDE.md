# 東京都鉄道GISアプリ - プロジェクト概要

## アプリの概要
OpenLayersを使って東京都の鉄道路線を地図上に表示し、路線をクリックすると路線名・運営会社名がポップアップ表示されるWebアプリ。GitHub Pagesで公開する静的アプリ。

---

## 技術スタック

| 技術 | 用途 |
|------|------|
| React + TypeScript | UIフレームワーク |
| Vite | ビルドツール |
| OpenLayers | 地図描画ライブラリ |
| Material UI (MUI) | UIコンポーネントライブラリ |
| GeoJSON | 地図データ形式 |
| GitHub Pages | ホスティング |
| pnpm | パッケージマネージャー |

DBやバックエンドサーバーは不要。完全静的アプリ。

---

## レイヤー構成（下から順）

| 順序 | レイヤー | 説明 |
|------|----------|------|
| 1（最下層） | 地理院タイル（淡色） | 外部サーバーから取得。海・川・地名が薄く表示される |
| 2 | 東京都市区町村境界（GeoJSON） | グレーで塗りつぶし・ボーダー表示。目立ちすぎないよう透明度を設定 |
| 3（最上層） | 東京都鉄道路線（GeoJSON） | 事業者ごとに色を変えた路線。クリックで路線名ポップアップ表示 |

---

## 地図の初期表示・操作

- **中心座標**: 東京都庁（経度: 139.6917, 緯度: 35.6895）
- **ズームレベル**: 12
- **マウスホイール**: ズームイン・ズームアウト可能

---

## スタイリング

### 市区町村境界
- 塗りつぶし色: グレー（半透明）
- 線色: グレー（やや濃いめ）
- 見づらい場合は後から調整

### 鉄道路線
- 事業者（N02_004）ごとに異なる色を割り当てる
- 路線の太さはデフォルト（調整可）

---

## ポップアップ仕様

- **表示タイミング**: 鉄道路線フィーチャをクリックしたとき
- **表示内容**: 路線名（N02_003）・運営会社名（N02_004）
- **表示位置**: クリックした座標付近
- **非表示**: 路線以外の場所をクリックしたら閉じる
- **実装**: OpenLayers の Overlay を使用、スタイルはMUIコンポーネントで構成

---

## クリックで路線名表示の実装方針

```
- map.on('click', ...) でクリックイベントを取得
- map.forEachFeatureAtPixel() でクリック位置のフィーチャを取得
- feature.get('N02_003') で路線名、feature.get('N02_004') で運営会社名を取得
- OpenLayersの Overlay を使ってポップアップ表示
- 路線以外をクリックしたらポップアップを閉じる
```

---

## データ源

| データ | 提供元 | URL |
|--------|--------|-----|
| 鉄道路線（東京都） | 国土数値情報 | https://nlftp.mlit.go.jp/ksj/ |
| 市区町村境界（東京都） | 国土数値情報 | https://nlftp.mlit.go.jp/ksj/ |
| 地理院タイル（淡色） | 国土地理院 | タイルURL指定で自動取得 |

### 国土数値情報からのダウンロード手順
1. https://nlftp.mlit.go.jp/ksj/ にアクセス
2. 「鉄道」→ 東京都を選択してダウンロード（GeoJSON形式）
3. 「行政区域」→ 東京都を選択してダウンロード（GeoJSON形式）
4. Shapefile形式しかない場合は mapshaper（https://mapshaper.org）でGeoJSONに変換

### GeoJSONの属性（鉄道データ）

| 属性名 | 内容 |
|--------|------|
| N02_001 | 鉄道区分（新幹線・在来線など） |
| N02_002 | 事業者種別 |
| N02_003 | 路線名 |
| N02_004 | 運営会社名 |

---

## 地理院タイルURL

```
https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png
```

---

## プロジェクト構成

```
tokyo-railway-gis/
├── public/
│   └── data/
│       ├── tokyo_municipality.geojson
│       └── tokyo_railway.geojson
├── src/
│   ├── components/
│   │   ├── MapView.tsx       # 地図本体
│   │   └── Popup.tsx         # ポップアップUI（MUIコンポーネント）
│   ├── hooks/
│   │   └── useMap.ts         # OpenLayers初期化・イベント処理
│   └── App.tsx
├── vite.config.ts
└── package.json
```

---

## TypeScriptコーディング規約

### 型の厳格さ
- `strict: true` を有効にする
- `any` 型は禁止。代わりに `unknown` を使用する

### 型定義
- `interface` より `type` を優先する

### 命名規則

| 対象 | 規則 | 例 |
|------|------|----|
| 変数・関数名 | camelCase | `railwayLayer`, `handleClick` |
| コンポーネント名・型名 | PascalCase | `MapView`, `PopupProps` |
| コンポーネントファイル | PascalCase.tsx | `MapView.tsx` |
| その他ファイル | camelCase.ts | `useMap.ts` |

### import
- パスエイリアス（`@/...`）は使用しない。相対パスで記述する
- import順: 外部ライブラリ → 内部モジュール（空行で区切る）

```ts
// 外部ライブラリ
import Map from 'ol/Map';
import { Box } from '@mui/material';

// 内部モジュール
import { Popup } from './Popup';
import { useMap } from '../hooks/useMap';
```

### コメント
- コメントは日本語で記述する
- 公開APIにはJSDocコメントを付ける

```ts
/**
 * OpenLayersの地図を初期化するカスタムフック
 * @param target - 地図をマウントするDOM要素のID
 */
export const useMap = (target: string) => { ... };
```

### export
- named export を使用する（`export default` は使わない）

```ts
// 良い
export const MapView = () => { ... };

// 悪い
export default MapView;
```

### Linter / Formatter
- ESLint + Prettier を使用する
- 特別なルールの追加なし（標準設定に従う）

---

## テスト方針

### テストの種類

| 種類 | ツール | 対象 |
|------|--------|------|
| ユニットテスト | Vitest | フック・ユーティリティ関数・ロジック |
| E2Eテスト | Playwright | ブラウザ上での地図操作・ポップアップ表示など |

### テストファイルの配置
- ユニットテスト: `src/__tests__/` 以下にまとめる
- E2Eテスト: `e2e/` ディレクトリにまとめる

```
tokyo-railway-gis/
├── src/
│   ├── __tests__/
│   │   ├── useMap.test.ts
│   │   └── ...
├── e2e/
│   ├── map.spec.ts
│   └── ...
```

### カバレッジ
- Vitestのカバレッジ機能（`@vitest/coverage-v8`）で計測する
- 目標カバレッジ率の指定なし

### モック方針
- OpenLayers・`fetch`など外部依存はモックに置き換える
- モックで置き換えられない場合は実際のものを使用する

### CI（GitHub Actions）
- `main` ブランチへのPush時にユニットテスト・E2Eテストを自動実行する
- ワークフローファイル: `.github/workflows/test.yml`

---

## GitHub Pagesへの公開手順

1. `vite.config.ts` に `base: '/tokyo-railway-gis/'` を設定
2. `gh-pages` パッケージを使用
3. `pnpm run deploy` でデプロイ

```ts
// vite.config.ts
export default defineConfig({
  base: '/tokyo-railway-gis/',
  // ...
})
```
