import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4001";

function App() {
  const [filters, setFilters] = useState({ 
    industry: [], 
    sub_industry: [], 
    job_title: [], 
    sub_role: [], 
    metro: [], 
    region: [],
    company: []
  });
  const [selected, setSelected] = useState({});
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [apiStatus, setApiStatus] = useState("🔴");

  // Check API health on mount
  useEffect(() => { 
    checkHealth();
  }, []);

  // Fetch filters when API is healthy
  useEffect(() => { 
    if (apiStatus === "🟢") {
      fetchFilters();
    }
  }, [apiStatus]);

  // Fetch contacts when filters or page change
  useEffect(() => { 
    if (apiStatus === "🟢") {
      fetchContacts(); 
    }
  }, [selected, page, apiStatus]);

  const checkHealth = async () => {
    try {
      const res = await axios.get(`${API_URL}/health`);
      setApiStatus(res.data.status === "OK" ? "🟢" : "🔴");
    } catch (error) {
      setApiStatus("🔴");
      console.error("API Health check failed:", error);
    }
  };

  const fetchFilters = async () => {
    try {
      const res = await axios.get(`${API_URL}/filters`);
      setFilters(res.data.data || res.data);
    } catch (error) {
      console.error("Error fetching filters:", error);
      setApiStatus("🔴");
    }
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/contacts`, { 
        params: { ...selected, page, limit: 50 } 
      });
      const data = res.data.data || res.data;
      setContacts(data.rows || data);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalRecords(data.pagination?.totalRecords || data.length || 0);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setApiStatus("🔴");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (field, value) => { 
    setSelected(prev => ({ ...prev, [field]: value || "" })); 
    setPage(1); 
  };

  const resetFilters = () => {
    setSelected({});
    setPage(1);
  };

  const refreshData = () => {
    checkHealth();
    fetchFilters();
  };

  const exportCSV = async () => {
    try {
      const res = await axios.get(`${API_URL}/export-csv`, {
        params: selected,
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a"); 
      link.href = url; 
      link.setAttribute("download", `contacts_${new Date().toISOString().split('T')[0]}.csv`); 
      document.body.appendChild(link); 
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Error exporting CSV: " + error.message);
    }
  };

  const exportExcel = async () => {
    try {
      const res = await axios.get(`${API_URL}/export-excel`, {
        params: selected
      });
      const data = res.data.data || res.data;
      const worksheet = window.XLSX.utils.json_to_sheet(data.records || data);
      const workbook = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
      window.XLSX.writeFile(workbook, data.filename || "contacts_export.xlsx");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Error exporting Excel: " + error.message);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: 'Arial, sans-serif' }}>
      {/* Filters Sidebar */}
      <div style={{ 
        width: "300px", 
        padding: "20px", 
        borderRight: "1px solid #ddd",
        backgroundColor: "#f5f5f5",
        overflowY: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "#333" }}>🔍 Filters</h3>
          <span title="API Status" style={{ fontSize: "18px" }}>{apiStatus}</span>
        </div>
        
        {Object.keys(filters).map(key => (
          <div key={key} style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              fontSize: "14px",
              color: "#555",
              textTransform: "capitalize"
            }}>
              {key.replace(/_/g, ' ')}
            </label>
            <select 
              value={selected[key] || ""}
              onChange={e => handleSelect(key, e.target.value)}
              style={{ 
                width: "100%", 
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
                backgroundColor: "white"
              }}
            >
              <option value="">All {key.replace(/_/g, ' ')}</option>
              {filters[key] && filters[key].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
            <div style={{ fontSize: "12px", color: "#888", textAlign: "right", marginTop: "4px" }}>
              {filters[key]?.length || 0} available
            </div>
          </div>
        ))}
        
        <button 
          onClick={resetFilters}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "10px"
          }}
        >
          Reset All Filters
        </button>

        <button 
          onClick={refreshData}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          🔄 Refresh Data
        </button>
      </div>
      
      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ color: "#333", margin: 0 }}>📊 Contacts Dashboard</h2>
          <div>
            <button 
              onClick={exportCSV}
              style={{
                padding: "10px 15px",
                backgroundColor: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                marginRight: "10px"
              }}
            >
              📥 Export CSV
            </button>
            <button 
              onClick={exportExcel}
              style={{
                padding: "10px 15px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              📊 Export Excel
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ 
          backgroundColor: "#e9ecef", 
          padding: "15px", 
          borderRadius: "4px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <div>
            <strong>Total Records:</strong> {totalRecords.toLocaleString()}
          </div>
          <div>
            <strong>Current Page:</strong> {page} of {totalPages}
          </div>
          <div>
            <strong>Displaying:</strong> {contacts.length} records
          </div>
        </div>
        
        {loading && (
          <div style={{ 
            textAlign: "center", 
            padding: "20px", 
            color: "#666",
            fontSize: "16px" 
          }}>
            ⏳ Loading contacts...
          </div>
        )}
        
        {/* Contacts Table */}
        {!loading && contacts.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              minWidth: "800px"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#4b6cb7", color: "white" }}>
                  {contacts[0] && Object.keys(contacts[0]).map(key => (
                    <th key={key} style={{ 
                      padding: "12px", 
                      textAlign: "left", 
                      border: "1px solid #ddd",
                      textTransform: "capitalize",
                      fontSize: "14px"
                    }}>
                      {key.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, index) => (
                  <tr 
                    key={contact.id || index}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e6f0ff"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#f8f9fa" : "white"}
                  >
                    {Object.values(contact).map((value, cellIndex) => (
                      <td key={cellIndex} style={{ 
                        padding: "12px", 
                        border: "1px solid #ddd",
                        fontSize: "14px"
                      }}>
                        {value || ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && contacts.length === 0 && (
          <div style={{ 
            textAlign: "center", 
            padding: "40px", 
            color: "#666",
            fontSize: "16px" 
          }}>
            {apiStatus === "🔴" ? "❌ Cannot connect to server" : "📋 No contacts found. Try adjusting your filters."}
          </div>
        )}
        
        {/* Pagination */}
        {!loading && contacts.length > 0 && totalPages > 1 && (
          <div style={{ 
            marginTop: "20px", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            gap: "10px"
          }}>
            <button 
              onClick={() => setPage(p => Math.max(1, p-1))}
              disabled={page === 1}
              style={{
                padding: "8px 16px",
                backgroundColor: page === 1 ? "#ccc" : "#4b6cb7",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: page === 1 ? "not-allowed" : "pointer",
                fontSize: "14px"
              }}
            >
              ← Previous
            </button>
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>
              Page {page} of {totalPages}
            </span>
            <button 
              onClick={() => setPage(p => p+1)}
              disabled={page >= totalPages}
              style={{
                padding: "8px 16px",
                backgroundColor: page >= totalPages ? "#ccc" : "#4b6cb7",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: page >= totalPages ? "not-allowed" : "pointer",
                fontSize: "14px"
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;