/** JR東日本の路線カラー（路線名で判定） */
const JR_EAST_COLORS: Record<string, string> = {
  山手線: '#9ACD32',
  京浜東北線: '#00A0DE',
  根岸線: '#00A0DE',
  中央本線: '#F15A22',
  中央線: '#F15A22',
  総武本線: '#F8B500',
  総武線: '#F8B500',
  埼京線: '#007E41',
  川越線: '#007E41',
  横浜線: '#7DC241',
  南武線: '#F8D231',
  鶴見線: '#D9AE2F',
  武蔵野線: '#F68C1E',
  横須賀線: '#0068B7',
  東海道本線: '#F15A22',
  東海道線: '#F15A22',
  常磐線: '#007E41',
  東北本線: '#F15A22',
  宇都宮線: '#F15A22',
  高崎線: '#F15A22',
  上越新幹線: '#E85298',
  東北新幹線: '#E85298',
  北陸新幹線: '#E85298',
};

/** JR東海の路線カラー（路線名で判定） */
const JR_CENTRAL_COLORS: Record<string, string> = {
  東海道新幹線: '#0072BC',
};

/** 東京地下鉄（東京メトロ）の路線カラー（路線名で判定） */
const TOKYO_METRO_COLORS: Record<string, string> = {
  銀座線: '#F9922E',
  丸ノ内線: '#E60012',
  日比谷線: '#B5B5AC',
  東西線: '#009BBF',
  千代田線: '#00BB85',
  有楽町線: '#C1A000',
  半蔵門線: '#8F4099',
  南北線: '#00AC9B',
  副都心線: '#9B7B51',
};

/** 都営地下鉄・都営交通の路線カラー（路線名で判定） */
const TOEI_COLORS: Record<string, string> = {
  浅草線: '#E5171F',
  三田線: '#0079C2',
  新宿線: '#6CBB5A',
  大江戸線: '#D31F8C',
  荒川線: '#F15A22',
  日暮里舎人ライナー: '#B01C85',
};

/** 私鉄・その他の会社カラー（事業者名で判定） */
const COMPANY_COLORS: Record<string, string> = {
  東急電鉄: '#E60012',
  小田急電鉄: '#0066B3',
  京王電鉄: '#0063A5',
  西武鉄道: '#FFD700',
  東武鉄道: '#0E7BC2',
  京急電鉄: '#E5171F',
  京成電鉄: '#E5171F',
  新京成電鉄: '#FF69B4',
  北総鉄道: '#E5171F',
  相模鉄道: '#003288',
  ゆりかもめ: '#009FE3',
  東京モノレール: '#0099CC',
  東京臨海高速鉄道: '#005BAC',
  多摩都市モノレール: '#E3007F',
  つくばエクスプレス: '#00529C',
  埼玉高速鉄道: '#E80011',
  横浜市: '#007DC3',
  横浜高速鉄道: '#007DC3',
};

/**
 * 事業者名・路線名から路線カラーを返す。
 * JR・地下鉄は路線ごとのイメージカラー、私鉄は企業カラー。
 * @param operatorName - 事業者名（N02_004）
 * @param routeName - 路線名（N02_003）
 */
export const getRailwayColor = (operatorName: string, routeName: string): string => {
  // JR東日本（事業者名: 東日本旅客鉄道）→ 路線カラー
  if (operatorName.includes('東日本旅客鉄道')) {
    for (const [key, color] of Object.entries(JR_EAST_COLORS)) {
      if (routeName.includes(key)) return color;
    }
    return '#F15A22'; // JR東日本デフォルト
  }

  // JR東海（事業者名: 東海旅客鉄道）→ 路線カラー
  if (operatorName.includes('東海旅客鉄道')) {
    for (const [key, color] of Object.entries(JR_CENTRAL_COLORS)) {
      if (routeName.includes(key)) return color;
    }
    return '#0072BC'; // JR東海デフォルト
  }

  // 東京地下鉄（東京メトロ）→ 路線カラー
  if (operatorName.includes('東京地下鉄')) {
    for (const [key, color] of Object.entries(TOKYO_METRO_COLORS)) {
      if (routeName.includes(key)) return color;
    }
    return '#149848'; // 東京メトロデフォルト
  }

  // 東京都（都営）→ 路線カラー
  if (operatorName === '東京都') {
    for (const [key, color] of Object.entries(TOEI_COLORS)) {
      if (routeName.includes(key)) return color;
    }
    return '#800080'; // 都営デフォルト
  }

  // 私鉄・その他 → 会社カラー
  for (const [key, color] of Object.entries(COMPANY_COLORS)) {
    if (operatorName.includes(key)) return color;
  }

  return '#888888'; // デフォルト
};
