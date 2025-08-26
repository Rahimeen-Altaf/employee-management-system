import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyProfile } from '../redux/features/employeeSlice';
import {
  Box,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Alert,
} from '@mui/material';
import {
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

const EmployeeProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { employeeProfile, loading, error } = useSelector(state => state.employees);

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

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
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
    } catch (err) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
        <Alert severity="error">
          Unable to load profile information.
        </Alert>
      </Box>
    );
  }

  // Check if employee record exists
  const hasEmployeeRecord = employeeProfile && !error;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>

      {!hasEmployeeRecord && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Your employee profile has not been created yet. Contact your administrator to set up your work details.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Personal Information - Always show from user data */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    First Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {user.firstName}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Last Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {user.lastName}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <EmailIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                    Email
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {user.email}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    <PhoneIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                    Phone
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {user.phone}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Role
                  </Typography>
                  <Chip
                    label={user.role}
                    color={user.role === 'admin' ? 'primary' : 'default'}
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Work Information - Only show if employee record exists */}
        {hasEmployeeRecord && (
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
                      Employee ID
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {employeeProfile.employeeId}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                      Department
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {employeeProfile.department}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Position
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {employeeProfile.position}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                      Hire Date
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formatDate(employeeProfile.hireDate)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Status
                    </Typography>
                    <Chip
                      label={employeeProfile.status || 'active'}
                      color={getStatusColor(employeeProfile.status || 'active')}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Additional Employee Details - Only show if employee record exists and has additional data */}
        {hasEmployeeRecord && (employeeProfile.salary || employeeProfile.address || employeeProfile.dateOfBirth || employeeProfile.emergencyContact) && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  <ContactPhoneIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Additional Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  {employeeProfile.salary && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">
                        <MoneyIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                        Salary
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {formatCurrency(employeeProfile.salary)}
                      </Typography>
                    </Grid>
                  )}
                  
                  {employeeProfile.address && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">
                        <HomeIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                        Address
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {employeeProfile.address}
                      </Typography>
                    </Grid>
                  )}
                  
                  {employeeProfile.dateOfBirth && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Date of Birth
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {formatDate(employeeProfile.dateOfBirth)}
                      </Typography>
                    </Grid>
                  )}
                  
                  {employeeProfile.emergencyContact && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Emergency Contact
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {employeeProfile.emergencyContact}
                        {employeeProfile.emergencyPhone && ` - ${employeeProfile.emergencyPhone}`}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default EmployeeProfile;