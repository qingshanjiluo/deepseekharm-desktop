/**
 * SVG Icon Library for DeepSeek Harness Desktop
 * Ported from the original web version's icon set
 */

interface IconProps {
  size?: number
  className?: string
}

/** New Chat */
export const IconNewChat = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 0.32C3.76 0.32 0.32 3.76 0.32 8C0.32 9.18 0.59 10.29 1.06 11.29L1.35 11.9L2.57 11.32L2.28 10.71C1.89 9.89 1.67 8.97 1.67 8C1.67 4.51 4.51 1.67 8 1.67C11.49 1.67 14.33 4.51 14.33 8C14.33 11.49 11.49 14.33 8 14.33C7.28 14.33 6.76 14.28 6.3 14.15C5.84 14.02 5.4 13.81 4.89 13.45C4.13 12.92 3.04 12.73 2.14 13.3L2.13 13.31L1.35 13.85L1.8 15.19L2.86 14.44C3.19 14.23 3.68 14.25 4.11 14.55C4.73 14.98 5.3 15.27 5.94 15.45C6.57 15.62 7.23 15.68 8 15.68C12.24 15.68 15.68 12.24 15.68 8C15.68 3.76 12.24 0.32 8 0.32ZM7.32 4.83V7.33H4.83V8.67H7.32V11.17H8.67V8.67H11.17V7.33H8.67V4.83H7.32Z"
      fill="currentColor"
    />
  </svg>
)

/** Search */
export const IconSearch = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M11.89 6.65C11.89 3.73 9.53 1.36 6.62 1.36C3.71 1.36 1.35 3.73 1.35 6.65C1.35 9.57 3.71 11.94 6.62 11.94C9.53 11.94 11.89 9.57 11.89 6.65ZM13.25 6.65C13.25 10.32 10.28 13.29 6.62 13.29C2.97 13.29 0 10.32 0 6.65C0 2.98 2.97 0 6.62 0C10.28 0 13.25 2.98 13.25 6.65Z"
      fill="currentColor"
    />
    <path
      d="M16 15.04L15.04 16L11.53 12.47L12.49 11.51L16 15.04Z"
      fill="currentColor"
    />
  </svg>
)

/** Settings */
export const IconSettings = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6C6.9 6 6 6.9 6 8C6 9.1 6.9 10 8 10ZM8 11C9.66 11 11 9.66 11 8C11 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 5.5C13.87 5.13 13.65 4.73 13.4 4.4C13.34 4.32 13.3 4.3 13.18 4.29C12.65 4.24 12.12 4.31 11.58 4.26C11.1 4.22 10.7 4.02 10.4 3.66C10.04 3.21 9.8 2.71 9.47 2.27C9.41 2.18 9.36 2.15 9.24 2.14C8.68 2.08 8.08 2.08 7.52 2.14C7.4 2.15 7.36 2.18 7.3 2.27C6.96 2.71 6.72 3.21 6.36 3.66C6.06 4.02 5.66 4.22 5.18 4.26C4.64 4.31 4.11 4.24 3.58 4.29C3.46 4.3 3.42 4.32 3.36 4.4C3.11 4.73 2.89 5.13 2.76 5.5C2.69 5.66 2.69 5.73 2.76 5.89C2.99 6.45 3.35 6.95 3.62 7.52C3.88 8.07 3.88 8.64 3.62 9.19C3.35 9.75 2.99 10.25 2.76 10.81C2.69 10.97 2.69 11.04 2.76 11.2C2.89 11.57 3.11 11.97 3.36 12.3C3.42 12.38 3.46 12.4 3.58 12.41C4.11 12.46 4.64 12.39 5.18 12.44C5.66 12.48 6.06 12.68 6.36 13.04C6.72 13.49 6.96 13.99 7.3 14.43C7.36 14.52 7.4 14.55 7.52 14.56C8.08 14.62 8.68 14.62 9.24 14.56C9.36 14.55 9.41 14.52 9.47 14.43C9.81 13.99 10.04 13.49 10.4 13.04C10.7 12.68 11.1 12.48 11.58 12.44C12.12 12.39 12.65 12.46 13.18 12.41C13.3 12.4 13.34 12.38 13.4 12.3C13.65 11.97 13.87 11.57 14 11.2C14.07 11.04 14.07 10.97 14 10.81C13.77 10.25 13.41 9.75 13.14 9.19C12.88 8.64 12.88 8.07 13.14 7.52C13.41 6.95 13.77 6.45 14 5.89C14.07 5.73 14.07 5.66 14 5.5ZM14.8 6.4C14.6 6.82 14.3 7.19 14.1 7.61C14.05 7.72 14.05 7.76 14.1 7.87C14.3 8.29 14.6 8.66 14.8 9.08C15 9.5 15 9.93 14.8 10.35C14.59 10.81 14.31 11.28 14.01 11.68C13.75 12.02 13.75 12.41 14.01 12.75C14.31 13.15 14.59 13.62 14.8 14.08C15 14.5 15 14.93 14.8 15.35C14.6 15.77 14.3 16.14 14.1 16.56C14.05 16.67 14.05 16.71 14.1 16.82C14.3 17.24 14.6 17.61 14.8 18.03C15 18.45 15 18.88 14.8 19.3C14.59 19.76 14.31 20.23 14.01 20.63C13.75 20.97 13.75 21.36 14.01 21.7C14.31 22.1 14.59 22.57 14.8 23.03C15 23.45 15 23.88 14.8 24.3C14.6 24.72 14.3 25.09 14.1 25.51C14.05 25.62 14.05 25.66 14.1 25.77C14.3 26.19 14.6 26.56 14.8 26.98C15 27.4 15 27.83 14.8 28.25"
      fill="currentColor"
    />
  </svg>
)

/** Panel Left (Sidebar toggle) */
export const IconPanelLeft = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.67 0.52C10.83 0.52 11.76 0.52 12.5 0.6C13.25 0.68 13.88 0.85 14.43 1.25C14.75 1.49 15.04 1.77 15.27 2.1C15.67 2.64 15.84 3.28 15.92 4.03C16 4.76 16 5.69 16 6.85V9.15C16 10.31 16 11.24 15.92 11.97C15.84 12.72 15.67 13.36 15.27 13.9C15.04 14.23 14.75 14.51 14.43 14.75C13.88 15.15 13.25 15.32 12.5 15.4C11.76 15.48 10.83 15.48 9.67 15.48H6.33C5.17 15.48 4.24 15.48 3.5 15.4C2.75 15.32 2.12 15.15 1.57 14.75C1.25 14.51 0.96 14.23 0.73 13.9C0.33 13.36 0.16 12.72 0.08 11.97C0 11.24 0 10.31 0 9.15V6.85C0 5.69 0 4.76 0.08 4.03C0.16 3.28 0.33 2.64 0.73 2.1C0.96 1.77 1.25 1.49 1.57 1.25C2.12 0.85 2.75 0.68 3.5 0.6C4.24 0.52 5.17 0.52 6.33 0.52H9.67ZM5.54 1.89V14.11C5.79 14.11 6.05 14.12 6.33 14.12H9.67C10.86 14.12 11.7 14.12 12.35 14.05C12.98 13.98 13.35 13.85 13.63 13.65C13.84 13.5 14.02 13.31 14.17 13.1C14.37 12.83 14.5 12.46 14.57 11.83C14.64 11.18 14.64 10.34 14.64 9.15V6.85C14.64 5.66 14.64 4.82 14.57 4.17C14.5 3.54 14.37 3.17 14.17 2.9C14.02 2.69 13.84 2.5 13.63 2.35C13.35 2.15 12.98 2.02 12.35 1.95C11.7 1.88 10.86 1.88 9.67 1.88H6.33C6.05 1.88 5.79 1.89 5.54 1.89ZM4.18 1.91C3.99 1.92 3.81 1.94 3.65 1.95C3.02 2.02 2.65 2.15 2.37 2.35C2.16 2.5 1.98 2.69 1.83 2.9C1.63 3.17 1.5 3.54 1.43 4.17C1.36 4.82 1.36 5.66 1.36 6.85V9.15C1.36 10.34 1.36 11.18 1.43 11.83C1.5 12.46 1.63 12.83 1.83 13.1C1.98 13.31 2.16 13.5 2.37 13.65C2.65 13.85 3.02 13.98 3.65 14.05C4.24 14.12 5.08 14.12 6.27 14.12H6.33V1.88H6.27C5.08 1.88 4.24 1.88 3.65 1.95C3.48 1.97 3.33 1.99 3.18 2.02L4.18 1.91Z"
      fill="currentColor"
    />
  </svg>
)

/** Ellipsis (More) */
export const IconEllipsis = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M4.55 8C4.55 8.64 4.04 9.15 3.4 9.15C2.77 9.15 2.25 8.64 2.25 8C2.25 7.36 2.77 6.85 3.4 6.85C4.04 6.85 4.55 7.36 4.55 8Z"
      fill="currentColor"
    />
    <path
      d="M9.15 8C9.15 8.64 8.63 9.15 8 9.15C7.36 9.15 6.85 8.64 6.85 8C6.85 7.36 7.36 6.85 8 6.85C8.63 6.85 9.15 7.36 9.15 8Z"
      fill="currentColor"
    />
    <path
      d="M13.75 8C13.75 8.64 13.23 9.15 12.6 9.15C11.96 9.15 11.45 8.64 11.45 8C11.45 7.36 11.96 6.85 12.6 6.85C13.23 6.85 13.75 7.36 13.75 8Z"
      fill="currentColor"
    />
  </svg>
)

/** Plus */
export const IconPlus = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M8.64 1.5V7.35H14.5V8.65H8.64V14.5H7.34V8.65H1.5V7.35H7.34V1.5H8.64Z"
      fill="currentColor"
    />
  </svg>
)

/** Check */
export const IconCheck = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M15.05 3.93L8.5 12.38C8.26 12.69 8.05 12.96 7.85 13.17C7.64 13.38 7.39 13.58 7.04 13.67C6.86 13.72 6.68 13.73 6.49 13.72C6.14 13.69 5.85 13.54 5.61 13.36C5.38 13.19 5.13 12.96 4.84 12.7L1.03 9.21L1.97 8.19L5.78 11.67C6.09 11.95 6.28 12.12 6.43 12.24C6.5 12.29 6.55 12.31 6.57 12.33C6.59 12.33 6.6 12.33 6.6 12.33C6.63 12.34 6.67 12.33 6.7 12.33C6.7 12.33 6.7 12.33 6.7 12.32C6.71 12.32 6.71 12.32 6.72 12.31C6.75 12.3 6.79 12.26 6.85 12.2C6.98 12.07 7.14 11.86 7.4 11.53L13.95 3.07L15.05 3.93Z"
      fill="currentColor"
    />
  </svg>
)

/** Chevron Down */
export const IconChevronDown = ({ size = 14, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 14 14" fill="none">
    <path
      d="M11.85 5.5L11.42 5.92L8.7 8.65C8.44 8.91 8.22 9.13 8.01 9.3C7.8 9.47 7.56 9.62 7.25 9.67C7.08 9.69 6.92 9.69 6.75 9.67C6.44 9.62 6.2 9.47 5.99 9.3C5.78 9.13 5.56 8.91 5.3 8.65L2.58 5.92L2.15 5.5L3 4.65L3.42 5.08L6.15 7.8C6.43 8.08 6.6 8.25 6.74 8.36C6.87 8.47 6.92 8.48 6.94 8.48C6.98 8.49 7.02 8.49 7.06 8.48C7.08 8.48 7.13 8.47 7.26 8.36C7.4 8.25 7.57 8.08 7.85 7.8L10.58 5.08L11 4.65L11.85 5.5Z"
      fill="currentColor"
    />
  </svg>
)

/** Chevron Left */
export const IconChevronLeft = ({ size = 14, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 14 14" fill="none">
    <path
      d="M8.5 2.15L8.08 2.58L5.35 5.3C5.09 5.56 4.87 5.78 4.7 5.99C4.53 6.2 4.38 6.44 4.33 6.75C4.31 6.92 4.31 7.08 4.33 7.25C4.38 7.56 4.53 7.8 4.7 8.01C4.87 8.22 5.09 8.44 5.35 8.7L8.08 11.42L8.5 11.85L9.35 11L8.92 10.58L6.2 7.85C5.92 7.57 5.75 7.4 5.64 7.26C5.53 7.13 5.52 7.08 5.52 7.06C5.51 7.02 5.51 6.98 5.52 6.94C5.52 6.92 5.53 6.87 5.64 6.74C5.75 6.6 5.92 6.43 6.2 6.15L8.92 3.42L9.35 3L8.5 2.15Z"
      fill="currentColor"
    />
  </svg>
)

/** Chevron Right */
export const IconChevronRight = ({ size = 14, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 14 14" fill="none">
    <path
      d="M5.5 2.15L5.92 2.58L8.65 5.3C8.91 5.56 9.13 5.78 9.3 5.99C9.47 6.2 9.62 6.44 9.67 6.75C9.69 6.92 9.69 7.08 9.67 7.25C9.62 7.56 9.47 7.8 9.3 8.01C9.13 8.22 8.91 8.44 8.65 8.7L5.92 11.42L5.5 11.85L4.65 11L5.08 10.58L7.8 7.85C8.08 7.57 8.25 7.4 8.36 7.26C8.47 7.13 8.48 7.08 8.48 7.06C8.49 7.02 8.49 6.98 8.48 6.94C8.48 6.92 8.47 6.87 8.36 6.74C8.25 6.6 8.08 6.43 7.8 6.15L5.08 3.42L4.65 3L5.5 2.15Z"
      fill="currentColor"
    />
  </svg>
)

/** Copy */
export const IconCopy = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M4 2C2.9 2 2 2.9 2 4V10C2 11.1 2.9 12 4 12H5V10H4V4H10V5H12V4C12 2.9 11.1 2 10 2H4ZM6 6C4.9 6 4 6.9 4 8V14C4 15.1 4.9 16 6 16H12C13.1 16 14 15.1 14 14V8C14 6.9 13.1 6 12 6H6ZM6 8H12V14H6V8Z"
      fill="currentColor"
    />
  </svg>
)

/** Thumbs Up */
export const IconThumbsUp = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M4 7H2C1.45 7 1 7.45 1 8V14C1 14.55 1.45 15 2 15H4V7ZM6 15H11.5C12.1 15 12.6 14.6 12.7 14L14.5 7C14.6 6.6 14.5 6.2 14.2 5.9C13.9 5.6 13.5 5.5 13.1 5.5H9.5L10.2 2.2C10.3 1.7 10 1.2 9.6 1C9.4 0.9 9.2 0.9 9 0.9L6 7V15Z"
      fill="currentColor"
    />
  </svg>
)

/** Thumbs Down */
export const IconThumbsDown = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M4 9H2C1.45 9 1 8.55 1 8V2C1 1.45 1.45 1 2 1H4V9ZM6 1H11.5C12.1 1 12.6 1.4 12.7 2L14.5 9C14.6 9.4 14.5 9.8 14.2 10.1C13.9 10.4 13.5 10.5 13.1 10.5H9.5L10.2 13.8C10.3 14.3 10 14.8 9.6 15C9.4 15.1 9.2 15.1 9 15.1L6 9V1Z"
      fill="currentColor"
    />
  </svg>
)

/** Refresh (Regenerate) */
export const IconRefresh = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C11.74 16 14.86 13.45 15.78 10H13.65C12.79 12.37 10.57 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.93 2 11.64 2.93 12.68 4.38L9 8H16V1L13.65 2.35Z"
      fill="currentColor"
    />
  </svg>
)

/** Share */
export const IconShare = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M12 1C11.17 1 10.5 1.67 10.5 2.5C10.5 2.62 10.51 2.74 10.54 2.85L6.77 5.09C6.19 4.42 5.34 4 4.38 4C2.52 4 1 5.52 1 7.38C1 9.24 2.52 10.76 4.38 10.76C5.34 10.76 6.19 10.34 6.77 9.67L10.54 11.91C10.51 12.02 10.5 12.14 10.5 12.26C10.5 13.09 11.17 13.76 12 13.76C12.83 13.76 13.5 13.09 13.5 12.26C13.5 11.43 12.83 10.76 12 10.76C11.04 10.76 10.19 11.18 9.61 11.85L5.84 9.61C5.87 9.5 5.88 9.38 5.88 9.26C5.88 9.14 5.87 9.02 5.84 8.91L9.61 6.67C10.19 7.34 11.04 7.76 12 7.76C12.83 7.76 13.5 7.09 13.5 6.26C13.5 5.43 12.83 4.76 12 4.76C11.04 4.76 10.19 5.18 9.61 5.85L5.84 3.61C5.87 3.5 5.88 3.38 5.88 3.26C5.88 2.43 6.55 1.76 7.38 1.76H12V1Z"
      fill="currentColor"
    />
  </svg>
)

/** Edit (Pencil) */
export const IconEdit = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M11.83 1.5L14.5 4.17L5 13.67H2.33V11L11.83 1.5ZM10.5 4.17L11.83 5.5L4 13.33V11L10.5 4.17Z"
      fill="currentColor"
    />
  </svg>
)

/** Trash (Delete) */
export const IconTrash = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M5 2V1C5 0.45 5.45 0 6 0H10C10.55 0 11 0.45 11 1V2H14V4H2V2H5ZM3 5H13L12.23 14C12.21 14.55 11.76 15 11.2 15H4.8C4.24 15 3.79 14.55 3.77 14L3 5ZM6 7V13H7.5V7H6ZM8.5 7V13H10V7H8.5Z"
      fill="currentColor"
    />
  </svg>
)

/** Download */
export const IconDownload = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 0C8.55 0 9 0.45 9 1V10.59L12.29 7.29C12.68 6.9 13.32 6.9 13.71 7.29C14.1 7.68 14.1 8.32 13.71 8.71L8.71 13.71C8.32 14.1 7.68 14.1 7.29 13.71L2.29 8.71C1.9 8.32 1.9 7.68 2.29 7.29C2.68 6.9 3.32 6.9 3.71 7.29L7 10.59V1C7 0.45 7.45 0 8 0ZM2 14C1.45 14 1 14.45 1 15V16H15V15C15 14.45 14.55 14 14 14H2Z"
      fill="currentColor"
    />
  </svg>
)

/** Globe (Language) */
export const IconGlobe = ({ size = 14, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 14 14" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 0.35C10.67 0.35 13.65 3.33 13.65 7C13.65 10.67 10.67 13.65 7 13.65C3.33 13.65 0.35 10.67 0.35 7C0.35 3.33 3.33 0.35 7 0.35ZM5.45 7.6C5.49 8.98 5.71 10.19 6.02 11.08C6.2 11.59 6.4 11.96 6.6 12.19C6.8 12.42 6.93 12.45 7 12.45C7.07 12.45 7.21 12.42 7.4 12.19C7.6 11.96 7.8 11.59 7.98 11.08C8.29 10.19 8.51 8.98 8.55 7.6H5.45ZM1.58 7.6C1.81 9.7 3.24 11.45 5.17 12.14C5.07 11.93 4.98 11.71 4.9 11.48C4.53 10.44 4.3 9.08 4.25 7.6H1.58ZM9.75 7.6C9.7 9.08 9.47 10.44 9.1 11.48C9.02 11.71 8.93 11.93 8.83 12.14C10.76 11.45 12.19 9.7 12.42 7.6H9.75ZM5.17 1.86C3.24 2.55 1.81 4.3 1.58 6.4H4.25C4.3 4.92 4.53 3.56 4.9 2.52C4.98 2.29 5.07 2.07 5.17 1.86ZM7 1.55C6.93 1.55 6.8 1.58 6.6 1.81C6.4 2.04 6.2 2.41 6.02 2.92C5.71 3.81 5.49 5.02 5.45 6.4H8.55C8.51 5.02 8.29 3.81 7.98 2.92C7.8 2.41 7.6 2.04 7.4 1.81C7.21 1.58 7.07 1.55 7 1.55ZM8.83 1.86C8.93 2.07 9.02 2.29 9.1 2.52C9.47 3.56 9.7 4.92 9.75 6.4H12.42C12.19 4.3 10.76 2.55 8.83 1.86Z"
      fill="currentColor"
    />
  </svg>
)

/** Moon (Dark theme) */
export const IconMoon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M14 8.5C14 11.54 11.54 14 8.5 14C6.36 14 4.49 12.75 3.58 10.92C3.22 10.19 3.03 9.37 3.03 8.5C3.03 5.46 5.49 3 8.53 3C9.37 3 10.19 3.19 10.92 3.55C12.75 4.46 14 6.33 14 8.5ZM12.54 8.11C12.54 5.79 10.67 3.92 8.35 3.92C7.89 3.92 7.44 4 7.01 4.1C8.35 5.03 9.2 6.55 9.2 8.27C9.2 9.99 8.35 11.51 7.01 12.44C7.44 12.54 7.89 12.63 8.35 12.63C10.67 12.63 12.54 10.76 12.54 8.11Z"
      fill="currentColor"
    />
  </svg>
)

/** Sun (Light theme) */
export const IconSun = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1C8.55 1 9 1.45 9 2V3C9 3.55 8.55 4 8 4C7.45 4 7 3.55 7 3V2C7 1.45 7.45 1 8 1ZM8 12C10.21 12 12 10.21 12 8C12 5.79 10.21 4 8 4C5.79 4 4 5.79 4 8C4 10.21 5.79 12 8 12ZM8 6C9.1 6 10 6.9 10 8C10 9.1 9.1 10 8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6ZM13 8C13 7.45 12.55 7 12 7H11C10.45 7 10 7.45 10 8C10 8.55 10.45 9 11 9H12C12.55 9 13 8.55 13 8ZM5 8C5 7.45 4.55 7 4 7H3C2.45 7 2 7.45 2 8C2 8.55 2.45 9 3 9H4C4.55 9 5 8.55 5 8ZM11.54 3.03L12.25 2.32C12.64 1.93 12.64 1.3 12.25 0.91C11.86 0.52 11.23 0.52 10.84 0.91L10.13 1.62C9.74 2.01 9.74 2.64 10.13 3.03C10.52 3.42 11.15 3.42 11.54 3.03ZM3.03 11.54C2.64 11.15 2.64 10.52 3.03 10.13L3.74 9.42C4.13 9.03 4.76 9.03 5.15 9.42C5.54 9.81 5.54 10.44 5.15 10.83L4.44 11.54C4.05 11.93 3.42 11.93 3.03 11.54ZM10.84 14.63C11.23 15.02 11.86 15.02 12.25 14.63C12.64 14.24 12.64 13.61 12.25 13.22L11.54 12.51C11.15 12.12 10.52 12.12 10.13 12.51C9.74 12.9 9.74 13.53 10.13 13.92L10.84 14.63ZM5.15 3.03C5.54 3.42 5.54 4.05 5.15 4.44L4.44 5.15C4.05 5.54 3.42 5.54 3.03 5.15C2.64 4.76 2.64 4.13 3.03 3.74L3.74 3.03C4.13 2.64 4.76 2.64 5.15 3.03Z"
      fill="currentColor"
    />
  </svg>
)

/** Monitor (System theme) */
export const IconMonitor = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M1 2C1 1.45 1.45 1 2 1H14C14.55 1 15 1.45 15 2V10C15 10.55 14.55 11 14 11H2C1.45 11 1 10.55 1 10V2ZM3 13H13V12H3V13ZM4 14H12C12.55 14 13 14.45 13 15V16H3V15C3 14.45 3.45 14 4 14Z"
      fill="currentColor"
    />
  </svg>
)

/** Send */
export const IconSend = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M1.5 14.5L15.5 8L1.5 1.5V6.5L11 8L1.5 9.5V14.5Z"
      fill="currentColor"
    />
  </svg>
)

/** Stop */
export const IconStop = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <rect x="3" y="3" width="10" height="10" rx="2" fill="currentColor"/>
  </svg>
)

/** File (Document) */
export const IconFile = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M9 1H4C3.45 1 3 1.45 3 2V14C3 14.55 3.45 15 4 15H12C12.55 15 13 14.55 13 14V6L9 1ZM9 1.5L12.5 5H10C9.45 5 9 4.55 9 4V1.5Z"
      fill="currentColor"
    />
  </svg>
)

/** Image */
export const IconImage = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M14 1H2C1.45 1 1 1.45 1 2V14C1 14.55 1.45 15 2 15H14C14.55 15 15 14.55 15 14V2C15 1.45 14.55 1 14 1ZM13 13H3V3H13V13ZM5.5 6C6.05 6 6.5 6.45 6.5 7C6.5 7.55 6.05 8 5.5 8C4.95 8 4.5 7.55 4.5 7C4.5 6.45 4.95 6 5.5 6ZM12 12L9.5 8.5L7.5 11L6 9.5L3 13H12V12Z"
      fill="currentColor"
    />
  </svg>
)

/** Code */
export const IconCode = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M5.5 4L1 8L5.5 12L7 10.5L3.5 8L7 5.5L5.5 4ZM10.5 4L9 5.5L12.5 8L9 10.5L10.5 12L15 8L10.5 4Z"
      fill="currentColor"
    />
  </svg>
)

/** Calendar */
export const IconCalendar = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M5 1V3H4C3.45 3 3 3.45 3 4V14C3 14.55 3.45 15 4 15H12C12.55 15 13 14.55 13 14V4C13 3.45 12.55 3 12 3H11V1H9V3H7V1H5ZM5 5H11V7H5V5ZM5 9H11V11H5V9Z"
      fill="currentColor"
    />
  </svg>
)

/** Clock */
export const IconClock = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1C4.13 1 1 4.13 1 8C1 11.87 4.13 15 8 15C11.87 15 15 11.87 15 8C15 4.13 11.87 1 8 1ZM8 13C5.24 13 3 10.76 3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13ZM8.5 4.5H7V9L10.25 11.25L11 10.02L8.5 8.25V4.5Z"
      fill="currentColor"
    />
  </svg>
)

/** Folder */
export const IconFolder = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M2 3C2 2.45 2.45 2 3 2H6L8 4H13C13.55 4 14 4.45 14 5V13C14 13.55 13.55 14 13 14H3C2.45 14 2 13.55 2 13V3Z"
      fill="currentColor"
    />
  </svg>
)

/** Save */
export const IconSave = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M13.35 4.35L11.65 2.65C11.46 2.46 11.2 2.35 10.93 2.35H4C3.45 2.35 3 2.8 3 3.35V13C3 13.55 3.45 14 4 14H12C12.55 14 13 13.55 13 13V5.07C13 4.8 12.89 4.54 12.7 4.35H13.35ZM8 12.65C6.76 12.65 5.75 11.64 5.75 10.4C5.75 9.16 6.76 8.15 8 8.15C9.24 8.15 10.25 9.16 10.25 10.4C10.25 11.64 9.24 12.65 8 12.65ZM5 5.35H11V7H5V5.35Z"
      fill="currentColor"
    />
  </svg>
)

/** Warning (Triangle) */
export const IconWarning = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1L1 14H15L8 1ZM8 3.5L13 13H3L8 3.5ZM7.25 6.25V9.75H8.75V6.25H7.25ZM7.25 10.5V12.25H8.75V10.5H7.25Z"
      fill="currentColor"
    />
  </svg>
)

/** Info (Circle) */
export const IconInfo = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1C4.13 1 1 4.13 1 8C1 11.87 4.13 15 8 15C11.87 15 15 11.87 15 8C15 4.13 11.87 1 8 1ZM8.5 12H7.5V7H8.5V12ZM8.5 6H7.5V4.5H8.5V6Z"
      fill="currentColor"
    />
  </svg>
)

/** Close (X) */
export const IconClose = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M12.59 4L8 8.59L3.41 4L2 5.41L6.59 10L2 14.59L3.41 16L8 11.41L12.59 16L14 14.59L9.41 10L14 5.41L12.59 4Z"
      fill="currentColor"
    />
  </svg>
)

/** Menu (Hamburger) */
export const IconMenu = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M2 3H14V4.5H2V3ZM2 7.25H14V8.75H2V7.25ZM2 11.5H14V13H2V11.5Z"
      fill="currentColor"
    />
  </svg>
)

/** Filter */
export const IconFilter = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M1 2H15L9.5 8.5V13L6.5 15V8.5L1 2Z"
      fill="currentColor"
    />
  </svg>
)

/** Sort */
export const IconSort = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M4 1V14L7 11L10 14V1H4ZM6 3V10.5L7 9.5L8 10.5V3H6ZM12 1V14L15 11L18 14V1H12ZM14 3V10.5L15 9.5L16 10.5V3H14Z"
      fill="currentColor"
    />
  </svg>
)

/** Link */
export const IconLink = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M6.5 8C6.5 7.59 6.84 7.25 7.25 7.25H10.75C11.16 7.25 11.5 7.59 11.5 8V11.5C11.5 11.91 11.16 12.25 10.75 12.25C10.34 12.25 10 11.91 10 11.5V8.75H7.25V11.5C7.25 12.6 8.15 13.5 9.25 13.5H10.75C12.13 13.5 13.25 12.38 13.25 10.99V8C13.25 6.62 12.13 5.5 10.75 5.5H7.25C5.87 5.5 4.75 6.62 4.75 8C4.75 9.38 5.87 10.5 7.25 10.5H10V9.25H7.25C6.84 9.25 6.5 8.91 6.5 8.5V8ZM2.5 3.5H5.25C5.66 3.5 6 3.84 6 4.25V7H7.25V4.25C7.25 3.15 6.35 2.25 5.25 2.25H2.5C1.12 2.25 0 3.37 0 4.75V7.99C0 9.37 1.12 10.5 2.5 10.5H4V9.25H2.5C1.81 9.25 1.25 8.69 1.25 8V4.75C1.25 4.06 1.81 3.5 2.5 3.5Z"
      fill="currentColor"
    />
  </svg>
)

/** Zap (Lightning) */
export const IconZap = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M9 1L3 9H7L6 15L13 7H9L9 1Z"
      fill="currentColor"
    />
  </svg>
)

/** CPU (Processor) */
export const IconCPU = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M5 1C4.45 1 4 1.45 4 2V4H2C1.45 4 1 4.45 1 5V11C1 11.55 1.45 12 2 12H4V14C4 14.55 4.45 15 5 15H11C11.55 15 12 14.55 12 14V12H14C14.55 12 15 11.55 15 11V5C15 4.45 14.55 4 14 4H12V2C12 1.45 11.55 1 11 1H5ZM6 6H10V10H6V6Z"
      fill="currentColor"
    />
  </svg>
)

/** Memory (RAM) */
export const IconMemory = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M2 4H14V12H2V4ZM4 6V8H6V6H4ZM7 6V8H9V6H7ZM10 6V8H12V6H10ZM4 9V11H6V9H4ZM7 9V11H9V9H7ZM10 9V11H12V9H10Z"
      fill="currentColor"
    />
  </svg>
)

/** Database */
export const IconDatabase = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1C5.24 1 3 2.34 3 4V12C3 13.66 5.24 15 8 15C10.76 15 13 13.66 13 12V4C13 2.34 10.76 1 8 1ZM5 4C5 3.17 6.34 2.5 8 2.5C9.66 2.5 11 3.17 11 4C11 4.83 9.66 5.5 8 5.5C6.34 5.5 5 4.83 5 4ZM11 6.5C11 7.33 9.66 8 8 8C6.34 8 5 7.33 5 6.5V5.75C5.6 6.25 6.75 6.5 8 6.5C9.25 6.5 10.4 6.25 11 5.75V6.5ZM11 8.25V9C11 9.83 9.66 10.5 8 10.5C6.34 10.5 5 9.83 5 9V8.25C5.6 8.75 6.75 9 8 9C9.25 9 10.4 8.75 11 8.25ZM5 10.75V11.5C5 12.33 6.34 13 8 13C9.66 13 11 12.33 11 11.5V10.75C10.4 11.25 9.25 11.5 8 11.5C6.75 11.5 5.6 11.25 5 10.75Z"
      fill="currentColor"
    />
  </svg>
)

/** Cloud */
export const IconCloud = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M12.5 8C12.5 6.07 10.93 4.5 9 4.5C8.41 4.5 7.86 4.65 7.38 4.92C6.79 4.34 5.97 4 5.1 4C3.39 4 2 5.39 2 7.1C2 7.34 2.03 7.57 2.08 7.8C1.43 8.18 1 8.89 1 9.7C1 10.8 1.9 11.7 3 11.7H12C13.38 11.7 14.5 10.58 14.5 9.2C14.5 7.94 13.6 6.87 12.37 6.69C12.46 7.11 12.5 7.55 12.5 8Z"
      fill="currentColor"
    />
  </svg>
)

/** Shield (Security) */
export const IconShield = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1L2 3.5V7.5C2 10.8 4.56 13.9 8 14.75C11.44 13.9 14 10.8 14 7.5V3.5L8 1ZM7.25 11.5L4.5 8.75L5.56 7.69L7.25 9.38L10.44 6.19L11.5 7.25L7.25 11.5Z"
      fill="currentColor"
    />
  </svg>
)

/** Lock (Password) */
export const IconLock = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M12 6V5C12 2.79 10.21 1 8 1C5.79 1 4 2.79 4 5V6H3C2.45 6 2 6.45 2 7V13C2 13.55 2.45 14 3 14H13C13.55 14 14 13.55 14 13V7C14 6.45 13.55 6 13 6H12ZM8 10C7.45 10 7 9.55 7 9C7 8.45 7.45 8 8 8C8.55 8 9 8.45 9 9C9 9.55 8.55 10 8 10ZM10 6H6V5C6 3.9 6.9 3 8 3C9.1 3 10 3.9 10 5V6Z"
      fill="currentColor"
    />
  </svg>
)

/** Unlock */
export const IconUnlock = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M10 6V5C10 3.9 9.1 3 8 3C6.9 3 6 3.9 6 5V6H5C4.45 6 4 6.45 4 7V13C4 13.55 4.45 14 5 14H11C11.55 14 12 13.55 12 13V7C12 6.45 11.55 6 11 6H10ZM8 10C7.45 10 7 9.55 7 9C7 8.45 7.45 8 8 8C8.55 8 9 8.45 9 9C9 9.55 8.55 10 8 10Z"
      fill="currentColor"
    />
  </svg>
)

/** Key */
export const IconKey = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none">
    <path
      d="M10.5 1C9.39 1 8.5 1.89 8.5 3C8.5 3.24 8.54 3.47 8.62 3.69L3.29 8.14L2 6.85V10L3.29 11.29L10 4.54C10.22 4.62 10.45 4.66 10.69 4.66C11.8 4.66 12.69 3.77 12.69 2.66C12.69 1.55 11.8 0.66 10.69 0.66H10.5V1ZM10.69 2.16C11.11 2.16 11.19 2.72 10.69 2.66C10.19 2.6 10.27 2.04 10.69 2.16ZM13.5 12.5L11.5 14.5L9.5 12.5L8.5 13.5L10.5 15.5L13.5 12.5Z"
      fill="currentColor"
    />
  </svg>
)
