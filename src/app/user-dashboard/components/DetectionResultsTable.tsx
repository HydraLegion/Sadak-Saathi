'use client';

import { useState } from 'react';
import { SeverityBadge, StatusBadge } from '@/components/ui/SeverityBadge';
import { Eye, FileText, ChevronDown, ChevronUp, ArrowUpDown, ExternalLink } from 'lucide-react';

interface PotholeRecord {
  id: string;
  frameNo: number;
  timestamp: string;
  latitude: number;
  longitude: number;
  severity: 'Dangerous' | 'Moderate' | 'Minor';
  confidence: number;
  bboxArea: number;
  status: 'Detected' | 'Reported' | 'Under Review' | 'Repair Scheduled' | 'Repaired' | 'Closed' | 'Rejected';
  complaintId: string | null;
  videoSource: string;
}

// Mock data — Backend integration: GET /api/potholes?user_id=current
const MOCK_POTHOLES: PotholeRecord[] = [
  { id: 'PTH-001', frameNo: 24, timestamp: '00:00:12', latitude: 21.2513, longitude: 81.6293, severity: 'Dangerous', confidence: 0.94, bboxArea: 8420, status: 'Reported', complaintId: 'CMP-0041', videoSource: 'road_survey_nh30.mp4' },
  { id: 'PTH-002', frameNo: 61, timestamp: '00:00:30', latitude: 21.2518, longitude: 81.6298, severity: 'Moderate', confidence: 0.87, bboxArea: 4210, status: 'Under Review', complaintId: 'CMP-0042', videoSource: 'road_survey_nh30.mp4' },
  { id: 'PTH-003', frameNo: 98, timestamp: '00:00:49', latitude: 21.2524, longitude: 81.6305, severity: 'Minor', confidence: 0.76, bboxArea: 1890, status: 'Detected', complaintId: null, videoSource: 'road_survey_nh30.mp4' },
  { id: 'PTH-004', frameNo: 134, timestamp: '00:01:07', latitude: 21.2531, longitude: 81.6311, severity: 'Dangerous', confidence: 0.96, bboxArea: 9140, status: 'Reported', complaintId: 'CMP-0043', videoSource: 'road_survey_nh30.mp4' },
  { id: 'PTH-005', frameNo: 178, timestamp: '00:01:29', latitude: 21.2539, longitude: 81.6319, severity: 'Moderate', confidence: 0.81, bboxArea: 3760, status: 'Repair Scheduled', complaintId: 'CMP-0044', videoSource: 'road_survey_nh30.mp4' },
  { id: 'PTH-006', frameNo: 203, timestamp: '00:01:41', latitude: 21.2546, longitude: 81.6325, severity: 'Minor', confidence: 0.72, bboxArea: 1450, status: 'Detected', complaintId: null, videoSource: 'road_survey_nh30.mp4' },
  { id: 'PTH-007', frameNo: 247, timestamp: '00:02:03', latitude: 21.2553, longitude: 81.6332, severity: 'Dangerous', confidence: 0.91, bboxArea: 7890, status: 'Reported', complaintId: 'CMP-0045', videoSource: 'main_road_raipur.mp4' },
  { id: 'PTH-008', frameNo: 289, timestamp: '00:02:24', latitude: 21.2561, longitude: 81.6341, severity: 'Moderate', confidence: 0.85, bboxArea: 4680, status: 'Repaired', complaintId: 'CMP-0038', videoSource: 'main_road_raipur.mp4' },
  { id: 'PTH-009', frameNo: 312, timestamp: '00:02:36', latitude: 21.2568, longitude: 81.6348, severity: 'Minor', confidence: 0.68, bboxArea: 1230, status: 'Closed', complaintId: 'CMP-0039', videoSource: 'main_road_raipur.mp4' },
  { id: 'PTH-010', frameNo: 356, timestamp: '00:02:58', latitude: 21.2574, longitude: 81.6355, severity: 'Moderate', confidence: 0.79, bboxArea: 3290, status: 'Under Review', complaintId: 'CMP-0046', videoSource: 'main_road_raipur.mp4' },
  { id: 'PTH-011', frameNo: 398, timestamp: '00:03:19', latitude: 21.2581, longitude: 81.6362, severity: 'Dangerous', confidence: 0.93, bboxArea: 8760, status: 'Reported', complaintId: 'CMP-0047', videoSource: 'sector4_bypass.mp4' },
];

type SortField = 'id' | 'severity' | 'confidence' | 'status' | 'timestamp';
type SortDir = 'asc' | 'desc';

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 90 ? 'bg-success' : pct >= 75 ? 'bg-warning' : 'bg-muted';
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono font-500 text-text-secondary w-8 text-right">{pct}%</span>
    </div>
  );
}

export default function DetectionResultsTable() {
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [perPage] = useState(8);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filtered = MOCK_POTHOLES
    .filter((p) => {
      if (filterSeverity !== 'all' && p.severity !== filterSeverity) return false;
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.id.toLowerCase().includes(q) ||
          p.videoSource.toLowerCase().includes(q) ||
          String(p.latitude).includes(q) ||
          String(p.longitude).includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === 'confidence') cmp = a.confidence - b.confidence;
      else if (sortField === 'severity') cmp = a.severity.localeCompare(b.severity);
      else if (sortField === 'status') cmp = a.status.localeCompare(b.status);
      else if (sortField === 'timestamp') cmp = a.timestamp.localeCompare(b.timestamp);
      else cmp = a.id.localeCompare(b.id);
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="text-muted-foreground/50" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-primary" />
      : <ChevronDown size={12} className="text-primary" />;
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-5 border-b border-border/60">
        <div className="flex-1">
          <h2 className="text-base font-600 text-text">Detection Results</h2>
          <p className="text-xs text-muted-foreground">{filtered.length} potholes across all your videos</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search by ID, location…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field h-8 text-xs w-44"
          />
          <select
            value={filterSeverity}
            onChange={(e) => { setFilterSeverity(e.target.value); setPage(1); }}
            className="input-field h-8 text-xs w-32"
          >
            <option value="all">All Severity</option>
            <option value="Dangerous">Dangerous</option>
            <option value="Moderate">Moderate</option>
            <option value="Minor">Minor</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="input-field h-8 text-xs w-36"
          >
            <option value="all">All Status</option>
            <option value="Detected">Detected</option>
            <option value="Reported">Reported</option>
            <option value="Under Review">Under Review</option>
            <option value="Repair Scheduled">Repair Scheduled</option>
            <option value="Repaired">Repaired</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border/40">
              {[
                { label: 'Pothole ID', field: 'id' as SortField, width: 'w-24' },
                { label: 'Timestamp', field: 'timestamp' as SortField, width: 'w-24' },
                { label: 'Coordinates', field: null, width: 'w-40' },
                { label: 'Severity', field: 'severity' as SortField, width: 'w-28' },
                { label: 'Confidence', field: 'confidence' as SortField, width: 'w-32' },
                { label: 'BBox Area', field: null, width: 'w-20' },
                { label: 'Status', field: 'status' as SortField, width: 'w-36' },
                { label: 'Complaint', field: null, width: 'w-28' },
                { label: '', field: null, width: 'w-20' },
              ].map((col) => (
                <th
                  key={col.label}
                  className={`text-left px-4 py-3 stat-label ${col.width} ${col.field ? 'cursor-pointer select-none hover:text-text transition-colors' : ''}`}
                  onClick={() => col.field && handleSort(col.field)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.field && <SortIcon field={col.field} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-surface-elevated flex items-center justify-center">
                      <Eye size={22} className="text-muted-foreground" />
                    </div>
                    <p className="text-sm font-500 text-text/70">No potholes match your filters</p>
                    <p className="text-xs text-muted-foreground">Try adjusting severity or status filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`border-b border-border/30 hover:bg-surface-elevated/50 transition-colors group ${idx % 2 === 0 ? '' : 'bg-surface-elevated/20'}`}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-500 text-primary">{row.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-text-secondary">{row.timestamp}</span>
                    <p className="text-[10px] text-muted-foreground">Frame #{row.frameNo}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs text-text-secondary leading-relaxed">
                      <span className="text-info">{row.latitude.toFixed(4)}</span>
                      {', '}
                      <span className="text-info">{row.longitude.toFixed(4)}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">{row.videoSource}</p>
                  </td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={row.severity} />
                  </td>
                  <td className="px-4 py-3">
                    <ConfidenceBar value={row.confidence} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-text-secondary">{row.bboxArea.toLocaleString()}</span>
                    <p className="text-[10px] text-muted-foreground">px²</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    {row.complaintId ? (
                      <span className="font-mono text-xs font-500 text-info">{row.complaintId}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Not filed</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1.5 rounded-lg hover:bg-info/15 text-muted-foreground hover:text-info transition-colors"
                        title="View on map"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg hover:bg-primary/15 text-muted-foreground hover:text-primary transition-colors"
                        title="View complaint"
                      >
                        <FileText size={14} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg hover:bg-surface-elevated text-muted-foreground hover:text-text transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-border/40">
        <p className="text-xs text-muted-foreground">
          Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length} potholes
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-surface-elevated text-muted-foreground hover:text-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-7 text-xs rounded-lg transition-colors ${
                p === page
                  ? 'bg-primary text-white font-600' :'border border-border hover:bg-surface-elevated text-muted-foreground hover:text-text'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-surface-elevated text-muted-foreground hover:text-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}