import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat } from 'ol/proj';
import { Style, Stroke, Fill } from 'ol/style';
import { FeatureLike } from 'ol/Feature';
import { Geometry } from 'ol/geom';
import Feature from 'ol/Feature';
import { getRailwayColor } from '../utils/railwayColor';
import { PopupData } from '../types/railway';

/**
 * GeoJSONファイルをfetchし、EPSG:4326→EPSG:3857へ変換してフィーチャを返す。
 * VectorSourceのurl+format方式ではGeoJSON内のCRS宣言（EPSG:6668）が
 * 干渉するため、fetchで直接読み込む方式を採用する。
 * @param url - GeoJSONファイルのURL
 * @param source - フィーチャを追加するVectorSource
 */
const loadGeoJSON = (url: string, source: VectorSource): void => {
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
      return res.json();
    })
    .then((data: unknown) => {
      const features = new GeoJSON().readFeatures(data, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }) as Feature<Geometry>[];
      source.addFeatures(features);
    })
    .catch((err: unknown) => console.error('GeoJSON読み込みエラー:', err));
};

/**
 * OpenLayersの地図を初期化するカスタムフック
 * @param mapRef - 地図をマウントするDOM要素のref
 */
export const useMap = (mapRef: React.RefObject<HTMLDivElement | null>) => {
  const mapInstanceRef = useRef<Map | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [popupData, setPopupData] = useState<PopupData>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // dev・本番どちらもbase配下（/tokyo-railway-gis/）からpublicファイルが提供される
    const basePath = import.meta.env.BASE_URL;

    // 地理院タイルレイヤー（最下層）- 背景として目立たないよう透明度を設定
    const tileLayer = new TileLayer({
      source: new XYZ({
        url: 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
        attributions: '© 国土地理院',
      }),
      opacity: 0.5,
    });

    // 市区町村境界ソース・レイヤー
    const municipalitySource = new VectorSource();
    loadGeoJSON(`${basePath}data/tokyo_municipality.geojson`, municipalitySource);
    const municipalityLayer = new VectorLayer({
      source: municipalitySource,
      style: new Style({
        fill: new Fill({ color: 'rgba(180, 180, 180, 0.3)' }),
        stroke: new Stroke({ color: 'rgba(120, 120, 120, 0.8)', width: 1 }),
      }),
    });

    // 鉄道路線ソース・レイヤー
    const railwaySource = new VectorSource();
    loadGeoJSON(`${basePath}data/tokyo_railway.geojson`, railwaySource);
    const railwayLayer = new VectorLayer({
      source: railwaySource,
      style: (feature: FeatureLike) => {
        const operatorName = (feature.get('N02_004') as string) ?? '';
        const routeName = (feature.get('N02_003') as string) ?? '';
        return new Style({
          stroke: new Stroke({
            color: getRailwayColor(operatorName, routeName),
            width: 2,
          }),
        });
      },
    });

    // 駅ソース・レイヤー（路線より太い線分・会社によらず一律グレー）
    const stationSource = new VectorSource();
    loadGeoJSON(`${basePath}data/tokyo_station.geojson`, stationSource);
    const stationLayer = new VectorLayer({
      source: stationSource,
      style: new Style({
        stroke: new Stroke({
          color: '#888888',
          width: 5,
        }),
      }),
    });

    // 地図初期化
    const mapInstance = new Map({
      target: mapRef.current,
      layers: [tileLayer, municipalityLayer, railwayLayer, stationLayer],
      view: new View({
        center: fromLonLat([139.6917, 35.6895]), // 東京都庁
        zoom: 12,
      }),
    });

    mapInstanceRef.current = mapInstance;
    setMap(mapInstance);

    // 路線クリックイベント
    mapInstance.on('click', (event) => {
      let found = false;
      // hitTolerance: クリック位置から何ピクセル以内のフィーチャを対象にするか
      mapInstance.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        if (found) return;
        if (layer === railwayLayer) {
          const routeName = (feature.get('N02_003') as string) ?? '';
          const operatorName = (feature.get('N02_004') as string) ?? '';
          const coord = event.coordinate as [number, number];
          setPopupData({ type: 'railway', routeName, operatorName, coordinate: coord });
          found = true;
        }
      }, { hitTolerance: 8 });
      if (!found) {
        setPopupData(null);
      }
    });

    // 駅ホバーイベント
    mapInstance.on('pointermove', (event) => {
      let found = false;
      mapInstance.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        if (found) return;
        if (layer === stationLayer) {
          const stationName = feature.get('N02_005') as string;
          if (stationName) {
            const routeName = (feature.get('N02_003') as string) ?? '';
            const coord = event.coordinate as [number, number];
            setPopupData({ type: 'station', stationName, routeName, coordinate: coord });
            found = true;
          }
        }
      });
      if (!found) {
        setPopupData((prev) => (prev?.type === 'station' ? null : prev));
      }

      // カーソルスタイル変更
      const hit = mapInstance.hasFeatureAtPixel(event.pixel);
      mapInstance.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    return () => {
      mapInstance.setTarget(undefined);
      mapInstanceRef.current = null;
      setMap(null);
    };
  }, [mapRef]);

  return { map, popupData, setPopupData };
};
