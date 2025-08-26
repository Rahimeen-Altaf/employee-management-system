import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployee, clearCurrentEmployee } from '../redux/features/employeeSlice';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Home as HomeIcon,
  ContactPhone as ContactPhoneIcon,
} from '@mui/icons-material';

const EmployeeDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentEmployee, loading, error } = useSelector(state => state.employees);

  useEffect(() => {
    if (id) {
      dispatch(getEmployee(id));
    }
    return () => {
      dispatch(clearCurrentEmployee());
    };
  }, [dispatch, id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'terminated':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !currentEmployee) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          {error || 'Employee not found'}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/employees')}
          sx={{ mt: 2 }}
        >
          Back to Employees
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Employee Details
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard/employees')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/dashboard/edit-employee/${currentEmployee.id}`)}
          >
            Edit
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Employee ID
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentEmployee.employeeId}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    First Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentEmployee.user?.firstName}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Last Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentEmployee.user?.lastName}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Date of Birth
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(currentEmployee.dateOfBirth)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={currentEmployee.status}
                    color={getStatusColor(currentEmployee.status)}
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                <ContactPhoneIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <EmailIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                    Email
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentEmployee.user?.email}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <PhoneIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                    Phone
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentEmployee.user?.phone}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <HomeIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                    Address
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentEmployee.address || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Work Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Work Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                    Department
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentEmployee.department}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Position
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentEmployee.position}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <MoneyIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                    Salary
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatCurrency(currentEmployee.salary)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                    Hire Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(currentEmployee.hireDate)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Emergency Contact */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                <ContactPhoneIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Emergency Contact
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Contact Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentEmployee.emergencyContact || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Contact Phone
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentEmployee.emergencyPhone || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeDetails;