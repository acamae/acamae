import PrivateHeader from '@ui/components/PrivateHeader';
import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';


const MainLayout: React.FC = () => {
  return (
    <>
      <PrivateHeader />
      <Container className="py-4">
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;
