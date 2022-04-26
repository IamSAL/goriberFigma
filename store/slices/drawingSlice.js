import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    tool: "",
    config: {
        strokeWidth: 1,
        strokeColor: "#000",
        radius: 0,
    },
}

export const drawingSlice = createSlice({
    name: "drawing",
    initialState: initialState,
    reducers: {
        set: (state, action) => {
            const { drawingOptions, canvas } = action.payload
            if (canvas) {
                let prev = state;
                canvas.isDrawingMode = drawingOptions.status;
                if (drawingOptions.tool == "move") {
                    canvas.selection = true;
                } else if (drawingOptions.tool == "pencil") {
                    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas, "PencilBrush", {});
                }
                else {
                    canvas.selection = false;
                }
                return {
                    ...prev,
                    editor: {
                        ...prev.editor,
                        drawingMode: { ...prev.editor.drawingMode, ...drawingOptions },
                        panMode: drawingOptions.tool ? false : prev.editor.panMode,
                    },
                };

            }
        }
    }
})

const { set } = drawingSlice.actions

export const drawingActionType = { set }

export default drawingSlice.reducer;