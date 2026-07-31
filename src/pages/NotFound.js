import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

function NotFound() {
  return (
    <div className="page-center">
      <div className="card auth-card notfound">
        <Logo />
        <h1>404</h1>
        <p className="subtitle">This page doesn't add up.</p>
        <Link to="/" className="btn-primary" style={{ display: 'block' }}>
          Back to CalcHub
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
