// src/hooks/useFillDown.js
import { useEffect, useRef, useState } from "react"

import { Column } from "@/types";

export function useFillDown({ columns, initialRows, totalRows = 20 }) {

  // Drag-fill state
  const [drag, setDrag] = useState({
    active: false,
    column: null,
    startRow: null,
    hoverRow: null,
    value: null,
  })
  const dragRef = useRef(drag)
  dragRef.current = drag

  const onMouseUp = () => {
    console.log("aa")
    const { active, column, startRow, hoverRow, value } = dragRef.current
    if (!active) return

    if (
      typeof startRow === "number" &&
            typeof hoverRow === "number" &&
            column &&
            value !== null &&
            hoverRow > startRow
    ) {
      setRows((prev) => {
        const next = prev.map((r) => ({ ...r }))
        for (let i = startRow + 1; i <= hoverRow; i++) {
          next[i][column] = value
          if (column === "models" || column === "bodies") {
            next[i].manufacturer = next[startRow].manufacturer;
          }
          if(column === "bodies") {
            next[i].models = next[startRow].models;
          }
        }
        return next
      })
    }
    setDrag({ active: false, column: null, startRow: null, hoverRow: null, value: null })
    document.body.style.userSelect = ""
  }

  const startFill = (col, rowIndex) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    const value = rows[rowIndex]?.[col] ?? ""
    setDrag({
      active: true,
      column: col,
      startRow: rowIndex,
      hoverRow: rowIndex,
      value,
    })
    document.body.style.userSelect = "none"
  }

  const onRowEnter = (rowIndex) => {
    console.log(rowIndex)
    //if (!dragRef.current.active) return
    //setDrag((d) => ({ ...d, hoverRow: rowIndex }))
  }

  const isFilling = drag.active && typeof drag.hoverRow === "number"
  const minSel = isFilling ? Math.min(drag.startRow, drag.hoverRow) : null
  const maxSel = isFilling ? Math.max(drag.startRow, drag.hoverRow) : null

  const isRowInSelection = (rowIdx) =>
    isFilling &&
    typeof minSel === "number" &&
    typeof maxSel === "number" &&
    rowIdx >= minSel &&
    rowIdx <= maxSel

  const isCellInSelection = (rowIdx, col) =>
    isRowInSelection(rowIdx) && col === drag.column

  const showHandle = (col: Column) => col !== "index" && col !== "publish" && col !== "actions"

  return {
    startFill,
    onRowEnter,
    isRowInSelection,
    isCellInSelection,
    showHandle,
    onMouseUp,
  }
}
