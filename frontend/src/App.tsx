import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { JobRegister } from './components/jobs/JobRegister';
import { JobDetailView } from './components/jobs/JobDetailView';
import { JobFormModal } from './components/jobs/JobFormModal';
import { MasterDataView } from './components/masters/MasterDataView';
import { ReportsView } from './components/reports/ReportsView';
import { DocumentsView } from './components/documents/DocumentsView';
import { AuditView } from './components/audit/AuditView';
import { LoginScreen } from './components/auth/LoginScreen';
import { Job } from './types';

const MainAppContent: React.FC = () => {
  const { jobs, isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const openJobCount = jobs.filter(j => j.status !== 'CLOSED').length;

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleCloseJobDetail = () => {
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-teal-50/30 flex flex-col font-sans w-full max-w-full overflow-x-hidden">
      {/* Top Navbar with Mobile Menu toggle */}
      <Navbar 
        onOpenNewJob={() => setIsNewJobModalOpen(true)} 
        onToggleMobileMenu={() => setIsMobileSidebarOpen(prev => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative w-full max-w-full">
        
        {/* Left Sidebar (Desktop + Mobile Drawer) */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setSelectedJob(null); // Return to list if switching tab
            setActiveTab(tab);
          }} 
          openJobCount={openJobCount} 
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Center Panel */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 pb-6 w-full max-w-full">
          {selectedJob ? (
            <JobDetailView 
              job={selectedJob} 
              onBack={handleCloseJobDetail} 
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard 
                  onOpenNewJob={() => setIsNewJobModalOpen(true)} 
                  onSelectJob={handleSelectJob}
                  onViewAllJobs={() => setActiveTab('jobs')}
                />
              )}

              {activeTab === 'jobs' && (
                <JobRegister 
                  onSelectJob={handleSelectJob} 
                  onOpenNewJob={() => setIsNewJobModalOpen(true)} 
                />
              )}

              {activeTab === 'customers' && <MasterDataView type="customers" />}
              {activeTab === 'shippers' && <MasterDataView type="shippers" />}
              {activeTab === 'consignees' && <MasterDataView type="consignees" />}
              {activeTab === 'vendors' && <MasterDataView type="vendors" />}
              {activeTab === 'ports' && <MasterDataView type="ports" />}
              {activeTab === 'reports' && <ReportsView />}
              {activeTab === 'documents' && <DocumentsView />}
              {activeTab === 'audit' && <AuditView />}
            </>
          )}
        </main>
      </div>

      {/* Quick Job Creation Modal */}
      <JobFormModal 
        isOpen={isNewJobModalOpen} 
        onClose={() => setIsNewJobModalOpen(false)} 
        onJobCreated={(newJob) => {
          setSelectedJob(newJob);
        }} 
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
