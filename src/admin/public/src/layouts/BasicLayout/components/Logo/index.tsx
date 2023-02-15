import * as React from 'react';
import { Link } from 'ice';
import styles from './index.module.css';

export interface ILogoProps {
  image?: string;
  text?: string;
  url?: string;
}

export default function Logo({ image, text, url }: ILogoProps) {
  return (
    <div className="logo">
      <Link to={url || '/'} className={styles.logo}>
        {image && <img src={image} alt="logo" style={{ width: 128, height: 20 }} />}
        <span>{text}</span>
      </Link>
    </div>
  );
}
