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
import { 
  LayoutDashboard, 
  Layers, 
  PlusCircle, 
  BarChart3, 
  Menu 
} from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar with Mobile Menu toggle */}
      <Navbar 
        onOpenNewJob={() => setIsNewJobModalOpen(true)} 
        onToggleMobileMenu={() => setIsMobileSidebarOpen(prev => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
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
        <main className="flex-1 overflow-y-auto bg-slate-50 pb-20 md:pb-6">
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

      {/* Mobile Bottom Navigation Bar for 1-Tap Access */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around py-2 px-1 text-slate-400 shadow-lg">
        <button
          onClick={() => {
            setSelectedJob(null);
            setActiveTab('dashboard');
          }}
          className={`flex flex-col items-center gap-0.5 p-1 rounded transition ${
            activeTab === 'dashboard' && !selectedJob ? 'text-blue-400 font-bold' : 'hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          onClick={() => {
            setSelectedJob(null);
            setActiveTab('jobs');
          }}
          className={`flex flex-col items-center gap-0.5 p-1 rounded transition relative ${
            activeTab === 'jobs' && !selectedJob ? 'text-blue-400 font-bold' : 'hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px]">Jobs ({openJobCount})</span>
        </button>

        {/* Center Quick Add Job Button */}
        <button
          onClick={() => setIsNewJobModalOpen(true)}
          className="flex flex-col items-center -mt-4 bg-blue-600 text-white p-2 rounded-full shadow-lg shadow-blue-600/40 active:scale-95 transition"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            setSelectedJob(null);
            setActiveTab('reports');
          }}
          className={`flex flex-col items-center gap-0.5 p-1 rounded transition ${
            activeTab === 'reports' && !selectedJob ? 'text-blue-400 font-bold' : 'hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px]">Reports</span>
        </button>

        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1 rounded hover:text-white transition"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[10px]">More Menu</span>
        </button>
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
