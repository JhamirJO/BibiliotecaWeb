import GenericTable from "@/components/GenericTable";
import EstadoPill from "@/components/EstadoPill";

export function TableLector({
  data = [],
  onView,
  onEdit,
  onArchive,
  onDelete,
}) {
  const columns = [
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
      id: "direccion",
      header: "Dirección",
      cell: (row) => row.lector?.direccion,
      cellClass: "collection-address",
    },
    {
      id: "rol",
      header: "Rol",
      cell: () => <span className="collection-kind">Lector</span>,
    },
    {
      id: "estado",
      header: "Estado",
      cell: (row) => <EstadoPill estado={row.lector?.estado} />,
    },
  ];
  return (
    <div className="collection-table users-table">
      <GenericTable
        columns={columns}
        data={data}
        rowKey={(row) => row.lector?.cod_l}
        onView={onView}
        onEdit={onEdit}
        onArchive={onArchive}
        onDelete={onDelete}
        showArchiveAction={true}
        showDeleteAction
      />
    </div>
  );
}
