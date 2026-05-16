// components/VisualizadorPdf.tsx
"use client";

import dynamic from "next/dynamic";
import { Box, Typography } from "@mui/material";
import { VisualizadorPdfBaseProps } from "./VisualizadorPdfBase";


const VisualizadorPdf = dynamic<VisualizadorPdfBaseProps>(
  () =>
    import("./VisualizadorPdfBase").then((mod) => mod.VisualizadorPdfBase),
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          width: "100%",
          height: "480px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Carregando documento...</Typography>
      </Box>
    ),
  }
);

export { VisualizadorPdf };
export default VisualizadorPdf;