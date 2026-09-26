export default function ErrorText({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="m-0 text-[13px] text-danger-text">
      {children}
    </p>
  );
}
