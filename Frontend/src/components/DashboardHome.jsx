import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getEmployees } from '../redux/features/employeeSlice';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const DashboardHome = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { employees = [], loading, error } = useSelector(state => state.employees);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    departments: 0,
    recentHires: [],
  });
  const [componentError, setComponentError] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(getEmployees({ page: 1, limit: 100 }));
    }
  }, [dispatch, user?.role]);

  useEffect(() => {
    try {
      if (Array.isArray(employees) && employees.length > 0) {
        const activeEmployees = employees.filter(emp => emp?.status === 'active').length;
        const departments = [...new Set(employees.map(emp => emp?.department).filter(Boolean))].length;
        const recentHires = [...employees]
          .filter(emp => emp?.hireDate)
          .sort((a, b) => new Date(b.hireDate) - new Date(a.hireDate))
          .slice(0, 5);

        setStats({
          totalEmployees: employees.length,
          activeEmployees,
          departments,
          recentHires,
        });
      } else {
        setStats({
          totalEmployees: 0,
          activeEmployees: 0,
          departments: 0,
          recentHires: [],
        });
      }
    } catch (err) {
      console.error('Error processing employee data:', err);
      setComponentError('Error processing employee data');
      setStats({
        totalEmployees: 0,
        activeEmployees: 0,
        departments: 0,
        recentHires: [],
      });
    }
  }, [employees]);

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ bgcolor: `${color}.main`, mr: 2 }}>
            {icon}
          </Avatar>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
    } catch (err) {
      return 'N/A';
    }
  };

  if (error || componentError) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.firstName} {user?.lastName}!
        </Typography>
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography variant="h6" gutterBottom>
            Error Loading Dashboard
          </Typography>
          <Typography variant="body1">
            {error || componentError}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.firstName} {user?.lastName}!
      </Typography>
      
      <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
        {user?.role === 'admin' 
          ? 'Here\'s an overview of your employee management system.'
          : 'Welcome to the Employee Management System.'
        }
      </Typography>

      {user?.role === 'admin' ? (
        loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees}
              icon={<PeopleIcon />}
              color="primary"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Employees"
              value={stats.activeEmployees}
              icon={<TrendingUpIcon />}
              color="success"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Departments"
              value={stats.departments}
              icon={<BusinessIcon />}
              color="info"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Inactive/Terminated"
              value={stats.totalEmployees - stats.activeEmployees}
              icon={<PersonIcon />}
              color="warning"
            />
          </Grid>

          {/* Recent Hires */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Hires
              </Typography>
              <List>
                {stats.recentHires.map((employee) => (
                  <ListItem key={employee?.id || Math.random()}>
                    <ListItemAvatar>
                      <Avatar>
                        {employee?.user?.firstName?.charAt(0) || 'N'}{employee?.user?.lastName?.charAt(0) || 'A'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${employee?.user?.firstName || 'Unknown'} ${employee?.user?.lastName || 'Employee'}`}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {employee?.position || 'N/A'} - {employee?.department || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Hired: {employee?.hireDate ? formatDate(employee.hireDate) : 'N/A'}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip
                      label={employee?.status || 'unknown'}
                      color={employee?.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </ListItem>
                ))}
                {stats.recentHires.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No recent hires" />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>

          {/* Department Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Department Overview
              </Typography>
              <List>
                {[...new Set(employees.map(emp => emp?.department).filter(Boolean))].map((dept) => {
                  const deptCount = employees.filter(emp => emp?.department === dept).length;
                  return (
                    <ListItem key={dept || 'unknown'}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          <BusinessIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={dept || 'Unknown Department'}
                        secondary={`${deptCount} employee${deptCount !== 1 ? 's' : ''}`}
                      />
                    </ListItem>
                  );
                })}
                {(!Array.isArray(employees) || employees.length === 0) && (
                  <ListItem>
                    <ListItemText primary="No departments found" />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
        )
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Employee Portal
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Use the navigation menu to view your profile and access employee features.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default DashboardHome;