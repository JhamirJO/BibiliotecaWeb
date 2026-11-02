import { useMemo } from "react";
import { useSelector } from "react-redux";
import PublicationTable from "./PublicationTable";
const EMPTY = [];
export function TablePub({ data = [], onView, onEdit, onArchive }) {
  const books = useSelector((state) => state.libro?.libro || EMPTY);
  const articles = useSelector((state) => state.articulo?.articulo || EMPTY);
  const theses = useSelector((state) => state.tesis?.tesis || EMPTY);
  const rows = useMemo(() => {
    const entries = new Map(
      [...books, ...articles, ...theses].map((row) => [
        String(row.publicacion?.id_pub),
        row,
      ]),
    );
    return data.map((pub) => ({
      ...entries.get(String(pub.id_pub)),
      publicacion: pub,
    }));
  }, [data, books, articles, theses]);
  return (
    <PublicationTable
      data={rows}
      onView={onView}
      onEdit={onEdit}
      onArchive={onArchive}
    />
  );
}
