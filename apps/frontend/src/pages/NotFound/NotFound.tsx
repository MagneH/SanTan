import { Link } from '@tanstack/react-router';
import { ArrowLeft, Home } from 'lucide-react';
import { buttonContainer, buttonGhost, buttonPrimary, container, description, title } from './NotFound.css.ts';

export function NotFoundPage() {
  return (
    <div className={container}>
      <h1 className={title}>404</h1>
      <p className={description}>Beklager, denne siden finnes ikke.</p>
      <div className={buttonContainer}>
        <Link to="/" className={buttonPrimary} aria-label="Gå til forsiden">
          <Home size={20} />
          Gå til forsiden
        </Link>
        <button onClick={() => window.history.back()} className={buttonGhost} aria-label="Gå tilbake forrige side">
          <ArrowLeft size={20} />
          Gå tilbake
        </button>
      </div>
    </div>
  );
}
