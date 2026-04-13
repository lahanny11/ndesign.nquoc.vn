// Allow CSS side-effect imports (used in app/layout.tsx)
declare module '*.css' {
  const styles: { [className: string]: string }
  export default styles
}
