import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import { ErrorBoundary, registerTranslations } from 'common';
import { GlobalContext, useGlobalContextValue } from 'context';
import { TopBarWithBeamer } from 'common/top-bar/top-bar';
import { HomepageNotices } from 'homepage/notices';
import { HomepageSections } from './components/homepage-sections';
import { createStore } from './store/store';

function App(): JSX.Element {
  const [isStoreInitialized, setIsStoreInitialized] = useState(false);
  useEffect(() => {
    createStore();
    setIsStoreInitialized(true);
  }, []);
  return (
    <GlobalContext.Provider value={useGlobalContextValue(window)}>
      <TopBarWithBeamer />
      <HomepageNotices />
      {isStoreInitialized ? <HomepageSections /> : null}
    </GlobalContext.Provider>
  );
}

const container = document.getElementById('mailpoet_homepage_container');
if (container) {
  registerTranslations();
  const root = createRoot(container);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>,
  );
}
