import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import KpiCards from './components/KpiCards';
import ChartsSection from './components/ChartsSection';
import FilterBar from './components/FilterBar';
import DataTable from './components/DataTable';
import DetailModal from './components/DetailModal';
import ExcelUploader from './components/ExcelUploader';
import { generateInitialData } from './data/initialData';

export default function App() {
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState('data perusahaan abujapi.xls');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showUploader, setShowUploader] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedJabatan, setSelectedJabatan] = useState('');

  // Initial Load with 6,000 dataset
  useEffect(() => {
    const initial = generateInitialData(6000);
    setData(initial);
  }, []);

  const handleFileUpload = (file) => {
    // Process file upload directly in Header or Uploader
    setFileName(file.name);
    setShowUploader(false);
  };

  const handleDataLoadedFromUploader = (loadedData, name) => {
    if (loadedData && Array.isArray(loadedData)) {
      // Normalize object keys if needed
      setData(loadedData);
      setFileName(name);
      // Reset active filters
      handleResetFilters();
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedProvince('');
    setSelectedCity('');
    setSelectedStatus('');
    setSelectedJabatan('');
  };

  // Filter Logic across all 18 fields
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Global Search
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesQuery = Object.values(item).some(val => 
          val && val.toString().toLowerCase().includes(query)
        );
        if (!matchesQuery) return false;
      }

      // Province Filter
      if (selectedProvince && (item.provinsi_name || '').trim() !== selectedProvince) {
        return false;
      }

      // City Filter
      if (selectedCity && (item.kota_name || '').trim() !== selectedCity) {
        return false;
      }

      // Status Filter
      if (selectedStatus && (item.badan_usaha_status || '').trim() !== selectedStatus) {
        return false;
      }

      // Jabatan Filter
      if (selectedJabatan && (item.jabatan_name || '').trim() !== selectedJabatan) {
        return false;
      }

      return true;
    });
  }, [data, searchTerm, selectedProvince, selectedCity, selectedStatus, selectedJabatan]);

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
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
        
        {/* Optional Drag & Drop Zone */}
        {showUploader && (
          <ExcelUploader onDataLoaded={handleDataLoadedFromUploader} />
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
