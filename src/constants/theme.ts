export const colors = {
  blue: '#1455D9',
  blueDark: '#0B347D',
  blueSoft: '#EAF1FF',
  yellow: '#FFD447',
  yellowSoft: '#FFF6CC',
  white: '#FFFFFF',
  ink: '#111827',
  muted: '#64748B',
  line: '#E2E8F0',
  surface: '#F8FAFC',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const typography = {
  title: 30,
  subtitle: 20,
  body: 15,
  small: 12,
  label: 13,
} as const;

export const shadow = {
  shadowColor: '#0B347D',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 18,
  elevation: 3,
} as const;
