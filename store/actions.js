import { canvasActionType } from "./slices/canvasSlice";
import { drawingActionType } from "./slices/drawingSlice";
import { editorActionType } from "./slices/editorSlice";
import { historyActionType } from "./slices/historySlice";
import { UiControllerActionType } from "./slices/UiControllerSlice";

export const ActionType = {
    UiController: UiControllerActionType,
    history: historyActionType,
    canvas: canvasActionType,
    drawing: drawingActionType,
    editor: editorActionType,
}