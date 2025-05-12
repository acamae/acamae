import PublicHeader from '@ui/components/PublicHeader';
import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';


const PublicLayout: React.FC = () => {
  return (
    <>
      <PublicHeader />
      <Container className="py-4">
        <Outlet />
      </Container>
    </>
  );
};

export default PublicLayout;
