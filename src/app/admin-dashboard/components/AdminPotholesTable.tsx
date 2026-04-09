'use client';

import { useState, useCallback } from 'react';
import { SeverityBadge, StatusBadge } from '@/components/ui/SeverityBadge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { CheckCircle, XCircle, Trash2, Eye, ChevronDown, ChevronUp, ArrowUpDown, Search, Filter, Download, RefreshCw, Wrench, AlertTriangle,  } from 'lucide-react';
import { toast } from 'sonner';

type Severity = 'Dangerous' | 'Moderate' | 'Minor';
type PotholeStatus = 'Detected' | 'Reported' | 'Under Review' | 'Repair Scheduled' | 'Repaired' | 'Closed' | 'Rejected';

interface AdminPothole {
  id: string;
  reportedBy: string;
  latitude: number;
  longitude: number;
  severity: Severity;
  confidence: number;
  status: PotholeStatus;
  department: string | null;
  complaintId: string | null;
  videoSource: string;
  detectedAt: string;
  lastUpdated: string;
  frameNo: number;
  bboxArea: number;
  imageUrl: string;
}

// Backend integration: GET /api/admin/reports
const MOCK_ADMIN_POTHOLES: AdminPothole[] = [
  { id: 'PTH-011', reportedBy: 'Priya Sharma', latitude: 21.2581, longitude: 81.6362, severity: 'Dangerous', confidence: 0.93, status: 'Reported', department: 'PWD Raipur', complaintId: 'CMP-0047', videoSource: 'sector4_bypass.mp4', detectedAt: '2026-03-13T10:24:00', lastUpdated: '2026-03-13T10:24:00', frameNo: 398, bboxArea: 8760, imageUrl: '' },
  { id: 'PTH-010', reportedBy: 'Arjun Mishra', latitude: 21.2574, longitude: 81.6355, severity: 'Moderate', confidence: 0.79, status: 'Under Review', department: 'Municipal Corp.', complaintId: 'CMP-0046', videoSource: 'main_road_raipur.mp4', detectedAt: '2026-03-12T16:47:00', lastUpdated: '2026-03-13T08:15:00', frameNo: 356, bboxArea: 3290, imageUrl: '' },
  { id: 'PTH-009', reportedBy: 'Sunita Yadav', latitude: 21.2568, longitude: 81.6348, severity: 'Minor', confidence: 0.68, status: 'Closed', department: 'Municipal Corp.', complaintId: 'CMP-0039', videoSource: 'main_road_raipur.mp4', detectedAt: '2026-03-05T13:10:00', lastUpdated: '2026-03-10T10:00:00', frameNo: 312, bboxArea: 1230, imageUrl: '' },
  { id: 'PTH-008', reportedBy: 'Arjun Mishra', latitude: 21.2561, longitude: 81.6341, severity: 'Moderate', confidence: 0.85, status: 'Repaired', department: 'NHAI', complaintId: 'CMP-0038', videoSource: 'main_road_raipur.mp4', detectedAt: '2026-03-04T10:00:00', lastUpdated: '2026-03-12T15:30:00', frameNo: 289, bboxArea: 4680, imageUrl: '' },
  { id: 'PTH-007', reportedBy: 'Rahul Sahu', latitude: 21.2553, longitude: 81.6332, severity: 'Dangerous', confidence: 0.91, status: 'Reported', department: 'PWD Raipur', complaintId: 'CMP-0045', videoSource: 'main_road_raipur.mp4', detectedAt: '2026-03-11T09:30:00', lastUpdated: '2026-03-12T14:22:00', frameNo: 247, bboxArea: 7890, imageUrl: '' },
  { id: 'PTH-006', reportedBy: 'Priya Sharma', latitude: 21.2546, longitude: 81.6325, severity: 'Minor', confidence: 0.72, status: 'Detected', department: null, complaintId: null, videoSource: 'road_survey_nh30.mp4', detectedAt: '2026-03-13T09:41:00', lastUpdated: '2026-03-13T09:41:00', frameNo: 203, bboxArea: 1450, imageUrl: '' },
  { id: 'PTH-005', reportedBy: 'Kavita Dewangan', latitude: 21.2539, longitude: 81.6319, severity: 'Moderate', confidence: 0.81, status: 'Repair Scheduled', department: 'NHAI', complaintId: 'CMP-0044', videoSource: 'road_survey_nh30.mp4', detectedAt: '2026-03-10T14:15:00', lastUpdated: '2026-03-12T09:45:00', frameNo: 178, bboxArea: 3760, imageUrl: '' },
  { id: 'PTH-004', reportedBy: 'Priya Sharma', latitude: 21.2531, longitude: 81.6311, severity: 'Dangerous', confidence: 0.96, status: 'Under Review', department: 'PWD Raipur', complaintId: 'CMP-0043', videoSource: 'road_survey_nh30.mp4', detectedAt: '2026-03-09T11:20:00', lastUpdated: '2026-03-11T16:30:00', frameNo: 134, bboxArea: 9140, imageUrl: '' },
  { id: 'PTH-003', reportedBy: 'Rahul Sahu', latitude: 21.2524, longitude: 81.6305, severity: 'Minor', confidence: 0.76, status: 'Detected', department: null, complaintId: null, videoSource: 'road_survey_nh30.mp4', detectedAt: '2026-03-13T09:49:00', lastUpdated: '2026-03-13T09:49:00', frameNo: 98, bboxArea: 1890, imageUrl: '' },
  { id: 'PTH-002', reportedBy: 'Arjun Mishra', latitude: 21.2518, longitude: 81.6298, severity: 'Moderate', confidence: 0.87, status: 'Under Review', department: 'Municipal Corp.', complaintId: 'CMP-0042', videoSource: 'road_survey_nh30.mp4', detectedAt: '2026-03-12T16:47:00', lastUpdated: '2026-03-13T08:20:00', frameNo: 61, bboxArea: 4210, imageUrl: '' },
  { id: 'PTH-001', reportedBy: 'Priya Sharma', latitude: 21.2513, longitude: 81.6293, severity: 'Dangerous', confidence: 0.94, status: 'Reported', department: 'PWD Raipur', complaintId: 'CMP-0041', videoSource: 'road_survey_nh30.mp4', detectedAt: '2026-03-08T08:45:00', lastUpdated: '2026-03-08T08:45:00', frameNo: 24, bboxArea: 8420, imageUrl: '' },
  { id: 'PTH-012', reportedBy: 'Kavita Dewangan', latitude: 21.2590, longitude: 81.6370, severity: 'Dangerous', confidence: 0.89, status: 'Detected', department: null, complaintId: null, videoSource: 'nh30_extension.mp4', detectedAt: '2026-03-13T14:10:00', lastUpdated: '2026-03-13T14:10:00', frameNo: 441, bboxArea: 7650, imageUrl: '' },
];

const STATUS_OPTIONS: PotholeStatus[] = ['Detected', 'Reported', 'Under Review', 'Repair Scheduled', 'Repaired', 'Closed', 'Rejected'];

type SortField = 'id' | 'severity' | 'confidence' | 'status' | 'detectedAt';
type SortDir = 'asc' | 'desc';

function StatusDropdown({
  current,
  potholeId,
  onChange,
}: {
  current: PotholeStatus;
  potholeId: string;
  onChange: (id: string, status: PotholeStatus) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="flex items-center gap-1 group"
      >
        <StatusBadge status={current} size="sm" />
        <ChevronDown size={10} className="text-muted-foreground group-hover:text-text transition-colors" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-30 card-elevated shadow-elevated min-w-[160px] py-1 border border-border rounded-xl overflow-hidden">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={(e) => {
                e.stopPropagation();
                onChange(potholeId, s);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-surface-elevated transition-colors flex items-center gap-2 ${s === current ? 'text-primary bg-primary/5' : 'text-text-secondary'}`}
            >
              {s === current && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
              {s !== current && <span className="w-1.5 h-1.5 flex-shrink-0" />}
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPotholesTable() {
  const [data, setData] = useState<AdminPothole[]>(MOCK_ADMIN_POTHOLES);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('detectedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [perPage] = useState(8);
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    setSortField(field);
    setSortDir(sortField === field && sortDir === 'asc' ? 'desc' : 'asc');
  };

  const handleStatusChange = useCallback((id: string, newStatus: PotholeStatus) => {
    // Backend integration: POST /api/admin/update-status { pothole_id, status }
    setData((prev) => prev.map((p) => p.id === id ? { ...p, status: newStatus, lastUpdated: new Date().toISOString() } : p));
    toast.success(`${id} status updated to "${newStatus}"`);
  }, []);

  const handleApprove = (id: string) => {
    handleStatusChange(id, 'Under Review');
  };

  const handleMarkRepaired = (id: string) => {
    handleStatusChange(id, 'Repaired');
  };

  const handleReject = (id: string) => {
    handleStatusChange(id, 'Rejected');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    // Backend integration: DELETE /api/admin/reports/:id
    await new Promise((r) => setTimeout(r, 800));
    if (deleteTarget) {
      setData((prev) => prev.filter((p) => p.id !== deleteTarget));
      toast.success(`Report ${deleteTarget} deleted`);
    }
    setDeleteTarget(null);
    setIsDeleting(false);
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    // Backend integration: DELETE /api/admin/reports/bulk { ids: [...] }
    await new Promise((r) => setTimeout(r, 1000));
    setData((prev) => prev.filter((p) => !selected.has(p.id)));
    toast.success(`${selected.size} reports deleted`);
    setSelected(new Set());
    setBulkDeleteOpen(false);
    setIsDeleting(false);
  };

  const handleBulkApprove = () => {
    // Backend integration: POST /api/admin/reports/bulk-approve { ids: [...] }
    setData((prev) =>
      prev.map((p) => selected.has(p.id) ? { ...p, status: 'Under Review' as PotholeStatus } : p)
    );
    toast.success(`${selected.size} reports approved`);
    setSelected(new Set());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setRefreshing(false);
    toast.success('Reports refreshed');
  };

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((p) => p.id)));
    }
  };

  const filtered = data
    .filter((p) => {
      if (filterSeverity !== 'all' && p.severity !== filterSeverity) return false;
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.id.toLowerCase().includes(q) ||
          p.reportedBy.toLowerCase().includes(q) ||
          (p.department?.toLowerCase().includes(q) ?? false) ||
          (p.complaintId?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === 'confidence') cmp = a.confidence - b.confidence;
      else if (sortField === 'severity') cmp = a.severity.localeCompare(b.severity);
      else if (sortField === 'status') cmp = a.status.localeCompare(b.status);
      else if (sortField === 'detectedAt') cmp = a.detectedAt.localeCompare(b.detectedAt);
      else cmp = a.id.localeCompare(b.id);
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={11} className="text-muted-foreground/40" />;
    return sortDir === 'asc'
      ? <ChevronUp size={11} className="text-primary" />
      : <ChevronDown size={11} className="text-primary" />;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) +
      ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <>
      <div className="card">
        {/* Table header */}
        <div className="flex flex-col gap-3 p-5 border-b border-border/60">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-600 text-text">All Pothole Reports</h2>
              <p className="text-xs text-muted-foreground">{filtered.length} reports · city-wide</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-lg hover:bg-surface-elevated text-muted-foreground hover:text-text transition-colors"
                title="Refresh reports"
              >
                <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              </button>
              <button
                className="btn-ghost text-xs py-1.5 px-3"
                onClick={() => toast.info('Exporting CSV…')}
              >
                <Download size={14} />
                Export
              </button>
            </div>
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ID, reporter, department…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="input-field h-8 text-xs pl-8"
              />
            </div>
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
              className="input-field h-8 text-xs w-40"
            >
              <option value="all">All Status</option>
              <option value="Detected">Detected</option>
              <option value="Reported">Reported</option>
              <option value="Under Review">Under Review</option>
              <option value="Repair Scheduled">Repair Scheduled</option>
              <option value="Repaired">Repaired</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="flex items-center gap-1 text-xs text-muted-foreground border-l border-border/40 pl-2">
              <Filter size={12} />
              {filtered.length} results
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-border/40">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === paginated.length && paginated.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-border bg-surface-elevated accent-primary cursor-pointer"
                    aria-label="Select all rows"
                  />
                </th>
                {[
                  { label: 'ID', field: 'id' as SortField },
                  { label: 'Reporter', field: null },
                  { label: 'Coordinates', field: null },
                  { label: 'Severity', field: 'severity' as SortField },
                  { label: 'Confidence', field: 'confidence' as SortField },
                  { label: 'Status', field: 'status' as SortField },
                  { label: 'Department', field: null },
                  { label: 'Complaint', field: null },
                  { label: 'Detected', field: 'detectedAt' as SortField },
                  { label: 'Actions', field: null },
                ].map((col) => (
                  <th
                    key={col.label}
                    className={`text-left px-3 py-3 stat-label ${col.field ? 'cursor-pointer select-none hover:text-text transition-colors' : ''}`}
                    onClick={() => col.field && handleSort(col.field)}
                  >
                    <div className="flex items-center gap-1">
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
                  <td colSpan={11} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-surface-elevated flex items-center justify-center">
                        <AlertTriangle size={22} className="text-muted-foreground" />
                      </div>
                      <p className="text-sm font-500 text-text/70">No pothole reports match your filters</p>
                      <p className="text-xs text-muted-foreground">Adjust severity or status filters to see results</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((row, idx) => {
                  const isSelected = selected.has(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-border/30 transition-colors group ${
                        isSelected
                          ? 'bg-primary/5 border-primary/20'
                          : idx % 2 === 0
                          ? 'hover:bg-surface-elevated/50' :'bg-surface-elevated/20 hover:bg-surface-elevated/50'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(row.id)}
                          className="w-4 h-4 rounded border-border bg-surface-elevated accent-primary cursor-pointer"
                          aria-label={`Select ${row.id}`}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-mono text-xs font-600 text-primary">{row.id}</span>
                        {row.severity === 'Dangerous' && row.status === 'Detected' && (
                          <span className="ml-1 w-1.5 h-1.5 rounded-full bg-destructive inline-block animate-pulse" title="Unreviewed dangerous pothole" />
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-xs font-500 text-text">{row.reportedBy}</p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{row.videoSource}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-mono text-xs text-info block">
                          {row.latitude.toFixed(4)}, {row.longitude.toFixed(4)}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">Frame #{row.frameNo}</span>
                      </td>
                      <td className="px-3 py-3">
                        <SeverityBadge severity={row.severity} />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5 min-w-[80px]">
                          <div className="flex-1 h-1.5 rounded-full bg-surface overflow-hidden">
                            <div
                              className={`h-full rounded-full ${row.confidence >= 0.9 ? 'bg-success' : row.confidence >= 0.75 ? 'bg-warning' : 'bg-muted'}`}
                              style={{ width: `${Math.round(row.confidence * 100)}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-500 text-text-secondary">
                            {Math.round(row.confidence * 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <StatusDropdown
                          current={row.status}
                          potholeId={row.id}
                          onChange={handleStatusChange}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-xs text-text-secondary truncate max-w-[110px]">
                          {row.department ?? <span className="text-muted-foreground italic">Unassigned</span>}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        {row.complaintId ? (
                          <span className="font-mono text-xs text-info">{row.complaintId}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">None</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div>
                          <p className="text-[11px] text-text-secondary font-mono">{formatDate(row.detectedAt)}</p>
                          {row.lastUpdated !== row.detectedAt && (
                            <p className="text-[10px] text-muted-foreground">upd {formatDate(row.lastUpdated)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleApprove(row.id)}
                            className="p-1.5 rounded-lg hover:bg-success/15 text-muted-foreground hover:text-success transition-colors"
                            title="Approve report"
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button
                            onClick={() => handleMarkRepaired(row.id)}
                            className="p-1.5 rounded-lg hover:bg-info/15 text-muted-foreground hover:text-info transition-colors"
                            title="Mark as repaired"
                          >
                            <Wrench size={14} />
                          </button>
                          <button
                            onClick={() => handleReject(row.id)}
                            className="p-1.5 rounded-lg hover:bg-warning/15 text-muted-foreground hover:text-warning transition-colors"
                            title="Reject as false report"
                          >
                            <XCircle size={14} />
                          </button>
                          <button
                            onClick={() => toast.info(`Viewing ${row.id} detail`)}
                            className="p-1.5 rounded-lg hover:bg-surface-elevated text-muted-foreground hover:text-text transition-colors"
                            title="View detail"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(row.id)}
                            className="p-1.5 rounded-lg hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors"
                            title="Delete report — this cannot be undone"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-surface-elevated text-muted-foreground hover:text-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
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

      {/* Bulk action bar — slides up when rows selected */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 ease-in-out ${
          selected.size > 0 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-6 pb-4">
          <div className="card border-primary/30 bg-surface/95 backdrop-blur-sm p-4 flex items-center gap-4 shadow-elevated">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-700 text-primary">{selected.size}</span>
              </div>
              <span className="text-sm font-500 text-text">
                {selected.size} report{selected.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleBulkApprove}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-success/15 border border-success/30 text-success hover:bg-success/25 transition-colors font-500"
              >
                <CheckCircle size={14} />
                Approve All
              </button>
              <button
                onClick={() => setBulkDeleteOpen(true)}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive hover:bg-destructive/25 transition-colors font-500"
              >
                <Trash2 size={14} />
                Delete Selected
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="text-xs px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-text hover:bg-surface-elevated transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Single delete confirm */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete pothole report"
        description={`This will permanently delete report ${deleteTarget} and its associated complaint. This action cannot be undone.`}
        confirmLabel="Delete Report"
        variant="destructive"
        isLoading={isDeleting}
      />

      {/* Bulk delete confirm */}
      <ConfirmModal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title={`Delete ${selected.size} reports`}
        description={`You are about to permanently delete ${selected.size} pothole reports and their associated complaints. This cannot be undone.`}
        confirmLabel={`Delete ${selected.size} Reports`}
        variant="destructive"
        isLoading={isDeleting}
      />
    </>
  );
}