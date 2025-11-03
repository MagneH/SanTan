import { featureCard, featureDescription, featureGrid, featureIcon, featureTitle, heroContent, heroDescription, heroSection, heroSubtitle, heroTitle, logo, logoContainer, logoSeparator, logosRow } from '../Home.css.ts';
import { TanStackLogo } from '@/components/Logos/TanStackLogo.tsx';
import { SanityLogo } from '@/components/Logos/SanityLogo.tsx';
import PortableText from '@/components/PortableText/PortableText.tsx';

interface HeroSectionProps {
  title?: string | null;
  subTitle?: string | null;
  description?: any | null; // PortableText eller null
}

const FEATURES = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Server-side rendering with instant client-side navigation' },
  { icon: '👁️', title: 'Live Preview', desc: 'Real-time content updates with Sanity\'s visual editing' },
  { icon: '🎨', title: 'Beautiful UI', desc: 'Clean, modern design inspired by Apple\'s aesthetics' },
  { icon: '📱', title: 'Fully Responsive', desc: 'Perfect experience on any device, any screen size' },
];

export function HeroSection({ title, subTitle, description }: HeroSectionProps) {
  console.log(JSON.stringify(description));
  return (
    <section className={heroSection}>
      <div className={heroContent}>
        <h1 className={heroTitle}>{title}</h1>
        {subTitle && <p className={heroSubtitle}>{subTitle}</p>}
        {description && (
          <div className={heroDescription}>
            <PortableText value={description} />
          </div>
        )}
        <div className={logoContainer}>
          <div className={logosRow}>
            <TanStackLogo height={40} className={logo} />
            <span className={logoSeparator}>×</span>
            <SanityLogo height={40} className={logo} />
          </div>
        </div>
        <div className={featureGrid}>
          {FEATURES.map(f => (
            <div className={featureCard} key={f.title}>
              <div className={featureIcon}>{f.icon}</div>
              <h3 className={featureTitle}>{f.title}</h3>
              <p className={featureDescription}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
