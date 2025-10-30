import { Link } from '@tanstack/react-router';

import { useState } from 'react';
import { Home, Menu, X } from 'lucide-react';
import {
  activeNavigationLink,
  aside,
  asideButtonContainer,
  asideClosed,
  asideHeader,
  asideOpen,
  button,
  closeMenuButton,
  header,
  menuAndTitleContainer,
  navigationContainer,
  navigationLink,
  navigationLinkTitle,
  title,
} from './Header.css.ts';

export default function Header() {
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);

  return (
    <>
      <header className={header}>
        <div className={menuAndTitleContainer}>
          <button onClick={() => setIsOpen(true)} className={button} aria-label="Open menu">
            <Menu size={24} />
          </button>
          <h1 className={title}>
            <Link to="/">Pensjonsbloggen</Link>
          </h1>
        </div>
      </header>

      <aside className={typeof isOpen === 'undefined' ? aside : isOpen ? asideOpen : asideClosed}>
        <div className={asideButtonContainer}>
          <h2 className={asideHeader}>Navigasjon</h2>
          <button onClick={() => setIsOpen(false)} className={closeMenuButton} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <nav className={navigationContainer}>
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={navigationLink}
            activeProps={{
              className: activeNavigationLink,
            }}
          >
            <Home size={20} />
            <span className={navigationLinkTitle}>Hjem</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
