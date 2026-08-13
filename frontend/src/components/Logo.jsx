function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 20 C25 15, 29 12, 34 12 L70 12 C75 12, 78 15, 78 20 L78 55 C60 48, 40 48, 25 55 Z"
        stroke="#f2f2f7" strokeWidth="4" strokeLinejoin="round" fill="none" />
      <rect x="34" y="22" width="10" height="34" rx="2" fill="#f2f2f7" />
      <rect x="47" y="22" width="10" height="34" rx="2" fill="#f2f2f7" />
      <rect x="60" y="26" width="10" height="30" rx="2" fill="#7c6cff" transform="rotate(8 65 41)" />
      <path d="M25 55 C40 48, 60 48, 78 55 L78 60 C60 53, 40 53, 25 60 Z" fill="#7c6cff" opacity="0.3" />
    </svg>
  )
}

export default Logo