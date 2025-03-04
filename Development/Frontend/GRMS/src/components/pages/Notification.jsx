import React from 'react';
import withAuth from '../withAuth';

function Notification() {
  return (
    <div>Notification</div>
  )
}

export default withAuth(Notification);