export default function RecordFields({ items = [] }) {
  return (
    <dl className="record-fields">
      {items.map(({ label, value }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>
            {value === undefined || value === null || value === ""
              ? "—"
              : value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
