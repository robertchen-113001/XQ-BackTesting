export default function SystemSettingsSection({ form, onChange }) {
  return (
    <div style={s.row}>
      <label style={s.checkLabel}>
        <input type="checkbox" checked={form.enablePrint}
          onChange={e => onChange('enablePrint', e.target.checked)} style={{ marginRight: 6 }} />
        啟動腳本內 Print 指令
      </label>
    </div>
  )
}

const s = {
  row: { display: 'flex', alignItems: 'center' },
  checkLabel: { fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text)' },
}
