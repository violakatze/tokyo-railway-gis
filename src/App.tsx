import { MapView } from './components/MapView';

/** アプリケーションのルートコンポーネント */
export const App = () => {
  return <MapView />;
};

export default App; // Viteデフォルトのmain.tsxがdefault importを使うため例外的に許可
