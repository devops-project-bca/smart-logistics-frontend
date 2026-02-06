import { useCallback, useEffect, useMemo, useState } from "react";
import { ShipmentAPI } from "./api";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Box,
  Button,
  TextField,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RefreshIcon from "@mui/icons-material/Refresh";

const emptyForm = {
  trackingNumber: "",
  senderName: "",
  receiverName: "",
  pickupCity: "",
  dropCity: "",
  status: "CREATED",
  vehicleNumber: "",
  expectedDeliveryDate: "",
};

function statusChipProps(status) {
  switch (status) {
    case "DELIVERED":
      return { color: "success" };
    case "IN_TRANSIT":
      return { color: "info" };
    case "CANCELLED":
      return { color: "error" };
    default:
      return { color: "default" };
  }
}

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success",
  });

  /* ✅ notify memoized */
  const notify = useCallback((msg, severity = "success") => {
    setSnack({ open: true, msg, severity });
  }, []);

  const closeSnack = () =>
    setSnack((s) => ({ ...s, open: false }));

  /* ✅ load memoized & clean deps */
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ShipmentAPI.list();
      setRows(res.data || []);
    } catch {
      notify("Failed to load shipments", "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  /* ✅ useEffect dependency FIXED */
  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditId(row.id);
    setForm({ ...row });
    setOpen(true);
  };

  const closeDialog = () => {
    if (!saving) setOpen(false);
  };

  const handleChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    try {
      setSaving(true);
      if (editId) {
        await ShipmentAPI.update(editId, form);
        notify("Shipment updated");
      } else {
        await ShipmentAPI.create(form);
        notify("Shipment created");
      }
      setOpen(false);
      load();
    } catch {
      notify("Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete shipment?")) return;
    try {
      await ShipmentAPI.remove(id);
      notify("Shipment deleted");
      load();
    } catch {
      notify("Delete failed", "error");
    }
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <LocalShippingIcon sx={{ mr: 1 }} />
          <Typography sx={{ flexGrow: 1 }}>
            Smart Logistics Transport System
          </Typography>
          <IconButton color="inherit" onClick={load}>
            <RefreshIcon />
          </IconButton>
          <Button color="inherit" onClick={openCreate} startIcon={<AddIcon />}>
            New Shipment
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tracking</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.trackingNumber}</TableCell>
                    <TableCell>
                      <Chip label={r.status} {...statusChipProps(r.status)} />
                    </TableCell>
                    <TableCell>
                      {r.pickupCity} → {r.dropCity}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => openEdit(r)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => remove(r.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Container>

      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>{editId ? "Edit" : "Create"} Shipment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tracking Number"
            value={form.trackingNumber}
            onChange={handleChange("trackingNumber")}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={save} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={2500} onClose={closeSnack}>
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}
