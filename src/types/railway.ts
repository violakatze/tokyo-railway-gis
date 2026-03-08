/** 鉄道フィーチャのプロパティ型 */
export type RailwayProperties = {
  N02_001: string; // 鉄道区分
  N02_002: string; // 事業者種別
  N02_003: string; // 路線名
  N02_004: string; // 運営会社名
  N02_005?: string; // 駅名（駅フィーチャのみ）
};

/** ポップアップに表示するデータ型 */
export type PopupData =
  | {
      type: 'railway';
      routeName: string; // 路線名
      operatorName: string; // 運営会社名
      coordinate: [number, number];
    }
  | {
      type: 'station';
      stationName: string; // 駅名
      routeName: string; // 路線名
      coordinate: [number, number];
    }
  | null;
