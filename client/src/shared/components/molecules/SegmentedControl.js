import { ToggleButton } from "../atoms";

export default function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-field">
      {options.map((o) => (
        <ToggleButton key={o.value} variant="segment" active={value === o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </ToggleButton>
      ))}
    </div>
  );
}
