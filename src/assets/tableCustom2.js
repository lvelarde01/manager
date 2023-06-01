import React, { useState } from 'react';

function Table({ columns, rows, actions }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Número de filas por página

  // Calcular el índice de la última fila en la página actual
  const indexOfLastRow = currentPage * rowsPerPage;
  // Calcular el índice de la primera fila en la página actual
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  // Obtener las filas de la página actual
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

  // Manejar la selección/deselección de una fila
  const handleRowSelection = (event, row) => {
    const selectedRowIds = [...selectedRows];
    if (event.target.checked) {
      selectedRowIds.push(row.id);
    } else {
      const index = selectedRowIds.indexOf(row.id);
      if (index !== -1) {
        selectedRowIds.splice(index, 1);
      }
    }
    setSelectedRows(selectedRowIds);
  };

  // Cambiar a la página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Cambiar a la página siguiente
  const goToNextPage = () => {
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            {columns.map(column => (
              <th key={column}>{column}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currentRows.map(row => (
            <tr key={row.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={event => handleRowSelection(event, row)}
                />
              </td>
              {Object.values(row).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
              {actions && (
                <td>
                  {actions.map((action, index) => (
                    <button key={index} onClick={() => action.onClick(row)}>
                      {action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={goToPreviousPage}>Previous</button>
        <button onClick={goToNextPage}>Next</button>
      </div>
    </div>
  );
}

export default Table;
