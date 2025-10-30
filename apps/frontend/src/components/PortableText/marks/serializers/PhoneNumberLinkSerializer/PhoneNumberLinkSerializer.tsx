import { PhoneOutgoing } from 'lucide-react';
import { link } from './PhoneNumberLinkSerializer.css.ts';
import type { ReactNode } from 'react';

interface Props {
  value?: {
    phoneNumber?: string;
  };
  children: ReactNode;
}

export const PhoneNumberLinkSerializer = ({ value, children }: Props) => {
  if (!value?.phoneNumber) {
    console.log('Missing phone number in PhoneNumberLinkSerializer');
    return <>{children}</>;
  }
  if (value.phoneNumber)
    return (
      <a className={link} href={`tel:${value.phoneNumber}`}>
        {children}
        <PhoneOutgoing />
      </a>
    );
};
