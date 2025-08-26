import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createEmployee, updateEmployee, getEmployee, clearError, clearCurrentEmployee } from '../redux/features/employeeSlice';
import axios from 'axios';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  Home as HomeIcon,
  ContactPhone as ContactPhoneIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const EmployeeForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    userId: '',
    employeeId: '',
    department: '',
    position: '',
    salary: '',
    hireDate: '',
    address: '',
    dateOfBirth: '',
    emergencyContact: '',
    emergencyPhone: '',
    status: 'active',
  });

  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentEmployee, loading, error } = useSelector(state => state.employees);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(getEmployee(id));
    } else {
      // Fetch users without employee records for new employee creation
      fetchAvailableUsers();
    }
    return () => {
      dispatch(clearCurrentEmployee());
    };
  }, [dispatch, id, isEdit]);

  const fetchAvailableUsers = async () => {
    try {
      setLoadingUsers(true);
      setUserError('');
      const response = await axios.get('http://localhost:3000/api/employees/users-without-employee-records', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableUsers(response.data.data.users || []);
    } catch (error) {
      console.error('Error fetching available users:', error);
      setUserError('Failed to load available users. Please try again.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isEdit && currentEmployee) {
      setFormData({
        userId: currentEmployee.userId || '',
        employeeId: currentEmployee.employeeId || '',
        department: currentEmployee.department || '',
        position: currentEmployee.position || '',
        salary: currentEmployee.salary || '',
        hireDate: currentEmployee.hireDate || '',
        address: currentEmployee.address || '',
        dateOfBirth: currentEmployee.dateOfBirth || '',
        emergencyContact: currentEmployee.emergencyContact || '',
        emergencyPhone: currentEmployee.emergencyPhone || '',
        status: currentEmployee.status || 'active',
      });
      setSelectedUser(currentEmployee.user);
    }
  }, [currentEmployee, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'userId') {
      const user = availableUsers.find(u => u.id === parseInt(value));
      setSelectedUser(user);
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEdit) {
        await dispatch(updateEmployee({ id, employeeData: formData })).unwrap();
      } else {
        await dispatch(createEmployee(formData)).unwrap();
      }
      navigate('/dashboard/employees');
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/employees');
  };

  if (loading && isEdit && !currentEmployee) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? 'Edit Employee' : 'Add New Employee'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* User Selection - Only for new employees */}
            {!isEdit && (
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Select User</InputLabel>
                  <Select
                    name="userId"
                    value={formData.userId}
                    label="Select User"
                    onChange={handleChange}
                    disabled={loadingUsers}
                  >
                    {loadingUsers ? (
                      <MenuItem disabled>
                        Loading users...
                      </MenuItem>
                    ) : availableUsers.length === 0 ? (
                      <MenuItem disabled>
                        No users available (all users already have employee profiles)
                      </MenuItem>
                    ) : (
                      availableUsers.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
                {userError && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {userError}
                  </Typography>
                )}
                {!loadingUsers && availableUsers.length === 0 && !userError && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    All registered users already have employee profiles. New users need to register first.
                  </Typography>
                )}
              </Grid>
            )}

            {/* Selected User Info Display */}
            {selectedUser && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Selected User Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" color="textSecondary" component="span">
                          Name:
                        </Typography>
                        <Typography variant="body1" component="div">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" color="textSecondary" component="span">
                          Email:
                        </Typography>
                        <Typography variant="body1" component="div">
                          {selectedUser.email}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" color="textSecondary" component="span">
                          Phone:
                        </Typography>
                        <Typography variant="body1" component="div">
                          {selectedUser.phone}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" color="textSecondary" component="span">
                          Role:
                        </Typography>
                        <Typography variant="body1" component="div">
                          {selectedUser.role}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="employeeId"
                label="Employee ID"
                value={formData.employeeId}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="terminated">Terminated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="department"
                label="Department"
                value={formData.department}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="position"
                label="Position"
                value={formData.position}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="salary"
                label="Salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="hireDate"
                label="Hire Date"
                type="date"
                value={formData.hireDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="emergencyContact"
                label="Emergency Contact"
                value={formData.emergencyContact}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="emergencyPhone"
                label="Emergency Phone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ContactPhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address"
                label="Address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : (isEdit ? 'Update' : 'Create')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmployeeForm;