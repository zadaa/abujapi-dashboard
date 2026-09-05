import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import KpiCards from './components/KpiCards';
import ChartsSection from './components/ChartsSection';
import FilterBar from './components/FilterBar';
import DataTable from './components/DataTable';
import DetailModal from './components/DetailModal';
import ExcelUploader from './components/ExcelUploader';
import PasswordGate from './components/PasswordGate';
import InitialUploadGate from './components/InitialUploadGate';
import { generateInitialData } from './data/initialData';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('abujapi_auth') === 'true';
  });

  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showUploader, setShowUploader] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedJabatan, setSelectedJabatan] = useState('');

  const handleAuthenticate = () => {
    sessionStorage.setItem('abujapi_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('abujapi_auth');
    setIsAuthenticated(false);
  };

  const handleDataLoaded = (loadedData, name) => {
    if (loadedData && Array.isArray(loadedData)) {
      setData(loadedData);
      setFileName(name || 'Uploaded File');
      setIsDataLoaded(true);
      setShowUploader(false);
      handleResetFilters();
    }
  };

  const handleUseDemoData = () => {
    const initial = generateInitialData(6000);
    setData(initial);
    setFileName('Demo Dataset (6,000 Rows)');
    setIsDataLoaded(true);
    handleResetFilters();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedProvince('');
    setSelectedCity('');
    setSelectedStatus('');
    setSelectedJabatan('');
  };

  // Filter Logic across all fields
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.filter(item => {
      if (!item) return false;

      // Global Search
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesQuery = Object.values(item).some(val => 
          val && val.toString().toLowerCase().includes(query)
        );
        if (!matchesQuery) return false;
      }

      // Province Filter
      if (selectedProvince && (item.provinsi_name || '').toString().trim() !== selectedProvince) {
        return false;
      }

      // City Filter
      if (selectedCity && (item.kota_name || '').toString().trim() !== selectedCity) {
        return false;
      }

      // Status Filter
      if (selectedStatus && (item.badan_usaha_status || '').toString().trim() !== selectedStatus) {
        return false;
      }

      // Jabatan Filter
      if (selectedJabatan && (item.jabatan_name || '').toString().trim() !== selectedJabatan) {
        return false;
      }

      return true;
    });
  }, [data, searchTerm, selectedProvince, selectedCity, selectedStatus, selectedJabatan]);

  // Screen 1: Password Gate
  if (!isAuthenticated) {
    return <PasswordGate onAuthenticate={handleAuthenticate} defaultPassword="madoo123" />;
  }

  // Screen 2: Initial Excel File Upload Gate
  if (!isDataLoaded) {
    return (
      <InitialUploadGate
        onDataLoaded={handleDataLoaded}
        onUseDemoData={handleUseDemoData}
      />
    );
  }

  // Screen 3: Full Executive Dashboard & Workspace
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0b0f17] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Header */}
      <Header
        totalRecords={data.length}
        fileName={fileName}
        onFileUpload={(file) => {
          setFileName(file.name);
          setShowUploader(true);
        }}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onLogout={handleLogout}
        onChangeFile={() => setIsDataLoaded(false)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
        
        {/* Optional Re-uploader Drawer */}
        {showUploader && (
          <ExcelUploader onDataLoaded={handleDataLoaded} />
        )}

        {/* Top KPI Cards */}
        <KpiCards data={filteredData} />

        {/* Interactive Charts (Provinsi & Status) */}
        <ChartsSection
          data={filteredData}
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        {/* Filter Controls Bar */}
        <FilterBar
          data={data}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedJabatan={selectedJabatan}
          setSelectedJabatan={setSelectedJabatan}
          onReset={handleResetFilters}
        />

        {/* Paginated Data Table */}
        <DataTable
          data={filteredData}
          onSelectEntity={(entity) => setSelectedEntity(entity)}
        />

      </main>

      {/* Detail Slide-over Modal */}
      {selectedEntity && (
        <DetailModal
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        <p>ABUJAPI Corporate Intelligence Dashboard • Data Perusahaan & Badan Usaha Indonesia</p>
      </footer>

    </div>
  );
}
