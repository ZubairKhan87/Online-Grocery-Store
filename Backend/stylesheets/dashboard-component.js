import React from 'react';
import { Box, H2, Text, Illustration, Grid, Card, Button } from '@admin-bro/design-system';

const Dashboard = () => {
  return (
    <Box>
      <Box className="dashboard-welcome">
        <H2>Welcome to FreshMart Admin Dashboard</H2>
        <Text>Manage your grocery store's products, orders, and customers from one place.</Text>
      </Box>
      
      <Grid>
        <Grid.Col width={[1, 1/2, 1/4]}>
          <Card className="admin-dashboard-card">
            <Text textAlign="center">Today's Orders</Text>
            <Text className="admin-stats-number" textAlign="center">24</Text>
            <Box mt="lg" textAlign="center">
              <Button variant="contained" size="sm">View Orders</Button>
            </Box>
          </Card>
        </Grid.Col>
        
        <Grid.Col width={[1, 1/2, 1/4]}>
          <Card className="admin-dashboard-card">
            <Text textAlign="center">Total Products</Text>
            <Text className="admin-stats-number" textAlign="center">386</Text>
            <Box mt="lg" textAlign="center">
              <Button variant="contained" size="sm">Manage Products</Button>
            </Box>
          </Card>
        </Grid.Col>
        
        <Grid.Col width={[1, 1/2, 1/4]}>
          <Card className="admin-dashboard-card">
            <Text textAlign="center">Low Stock Items</Text>
            <Text className="admin-stats-number" textAlign="center">12</Text>
            <Box mt="lg" textAlign="center">
              <Button variant="contained" size="sm">Check Inventory</Button>
            </Box>
          </Card>
        </Grid.Col>
        
        <Grid.Col width={[1, 1/2, 1/4]}>
          <Card className="admin-dashboard-card">
            <Text textAlign="center">Revenue</Text>
            <Text className="admin-stats-number" textAlign="center">$4,256</Text>
            <Box mt="lg" textAlign="center">
              <Button variant="contained" size="sm">View Analytics</Button>
            </Box>
          </Card>
        </Grid.Col>
      </Grid>
      
      <Grid mt="xl">
        <Grid.Col width={[1, 1/2]}>
          <Card className="admin-dashboard-card">
            <Box flex flexDirection="row" justifyContent="space-between">
              <H2>Recent Orders</H2>
              <Button variant="text">View All</Button>
            </Box>
            <Box mt="lg">
              {/* Recent orders table would go here */}
            </Box>
          </Card>
        </Grid.Col>
        
        <Grid.Col width={[1, 1/2]}>
          <Card className="admin-dashboard-card">
            <Box flex flexDirection="row" justifyContent="space-between">
              <H2>Popular Products</H2>
              <Button variant="text">View All</Button>
            </Box>
            <Box mt="lg">
              {/* Popular products list would go here */}
            </Box>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default Dashboard;