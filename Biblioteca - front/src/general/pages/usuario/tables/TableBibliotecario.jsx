import GenericTable from "@/components/GenericTable";

export function TableBibliotecario({
  data = [],
  onView,
  onEdit,
  onArchive,
  onDelete,
}) {
  const columns = [
    {
      id: "codigo",
      header: "Código",
      cell: (row) => (
        <span className="record-code">
          BIBL25{String(row.bibliotecario?.cod_b ?? "").padStart(2, "0")}
        </span>
      ),
    },
    {
      id: "dni",
      header: "DNI",
      cell: (row) => <span className="record-code">{row.persona?.dni}</span>,
    },
    {
      id: "nombre",
      header: "Nombre",
      cell: (row) => (
        <div className="user-table-cell">
          <strong>
            {`${row.persona?.nombre || ""} ${row.persona?.apellido || ""}`.trim()}
          </strong>
          <small>{row.usuario?.email || row.usuario?.username || "—"}</small>
        </div>
      ),
      cellClass: "collection-person",
    },
    {
      id: "telefono",
      header: "Teléfono",
      cell: (row) => row.persona?.telefono,
    },

    {
      id: "rol",
      header: "Rol",
      cell: () => <span className="collection-kind">Bibliotecario</span>,
    },
  ];
  return (
    <div className="collection-table users-table">
      <GenericTable
        columns={columns}
        data={data}
        rowKey={(row) => row.bibliotecario?.cod_b}
        onView={onView}
        onEdit={onEdit}
        onArchive={onArchive}
        onDelete={onDelete}
        showArchiveAction={false}
        showDeleteAction
      />
    </div>
  );
}
