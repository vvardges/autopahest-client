// src/hooks/useFillDown.js
import { useEffect, useRef, useState } from "react"

export function useFillDown({ columns, initialRows, totalRows = 20 }) {
  // Build an empty row with all columns present
  const makeEmptyRow = (index) => {
    const obj = {}
    for (const col of columns) {
      if (col === "index") obj[col] = index
      else obj[col] = ""
    }
    return obj
  }

  // Keep a fixed number of rows in state so we can fill into them
  const [rows, setRows] = useState(() => {
    const arr = [...initialRows]
    for (let i = arr.length; i < totalRows; i++) {
      arr.push(makeEmptyRow(i + 1))
    }
    return arr
  })

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

  // Apply fill on mouseup and clean up
  useEffect(() => {
    const onMouseUp = () => {
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
            if (column !== "index") {
              next[i][column] = value
            }
          }
          return next
        })
      }
      setDrag({ active: false, column: null, startRow: null, hoverRow: null, value: null })
      document.body.style.userSelect = ""
    }

    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [])

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

  const onRowEnter = (rowIndex) => () => {
    if (!dragRef.current.active) return
    setDrag((d) => ({ ...d, hoverRow: rowIndex }))
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

  const showHandle = (col) => col !== "index" && col !== "Actions"

  const fillHandleStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 16,
    height: 16,
    borderRadius: 3,
    border: "1px solid rgba(255,255,255,0.3)",
    color: "inherit",
    fontSize: 12,
    cursor: "ns-resize",
    opacity: 0.7,
    userSelect: "none",
  }

  return {
    rows,
    setRows,
    startFill,
    onRowEnter,
    isRowInSelection,
    showHandle,
    fillHandleStyle,
  }
}
