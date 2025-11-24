import { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { OKRsList } from './components/OKRs/OKRsList';
import { Timeline } from './components/Timeline/Timeline';
import { Portfolio } from './components/Portfolio/Portfolio';
import { useDemoData } from './hooks/useDemoData';

type Page = 'dashboard' | 'okrs' | 'timeline' | 'portfolio';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  // Load demo data on first load
  useDemoData();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'okrs':
        return <OKRsList />;
      case 'timeline':
        return <Timeline />;
      case 'portfolio':
        return <Portfolio />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
