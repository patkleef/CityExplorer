import React from 'react';
import ReactDOM from 'react-dom';
import VisitorApp from './visitor/visitor-app.tsx';
import AdminApp from './admin/admin-app.tsx';

if(document.getElementById('app-visitor') !== null) {
    ReactDOM.render(<VisitorApp />, document.getElementById('app-visitor'));
}
else if(document.getElementById('app-admin') !== null) {
    ReactDOM.render(<AdminApp />, document.getElementById('app-admin'));
}
