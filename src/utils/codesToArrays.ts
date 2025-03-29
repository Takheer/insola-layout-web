import {edgeValues} from "~/components/Russpeel/consts";

export const edgeCodesToEdges = {
  5: [edgeValues.THIN, edgeValues.THICK],
  4: [edgeValues.THIN, edgeValues.THIN],
  3: [edgeValues.THIN, edgeValues.NO],
  2: [edgeValues.THICK, edgeValues.THICK],
  1: [edgeValues.NO, edgeValues.THICK],
  0: [edgeValues.NO, edgeValues.NO],
}

export const slotCodesToSlots = {
  2: [1, 1],
  1: [1, 0],
  0: [0, 0],
}