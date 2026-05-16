'use client';

import { useState } from "react";
import { Box, IconButton, Stack, styled, Typography, useTheme } from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

export const AnteriorIcon = styled(ArrowCircleLeftIcon, {
  shouldForwardProp: (prop) => prop !== "iconColor",
})<{ iconColor?: string }>(({ iconColor }) => ({
  color: iconColor,
  fontSize: "24px",
}));

export const ProximoIcon = styled(ArrowCircleRightIcon, {
  shouldForwardProp: (prop) => prop !== "iconColor",
})<{ iconColor?: string }>(({ iconColor }) => ({
  color: iconColor,
  fontSize: "24px",
}));

export type VisualizadorPdfBaseProps = {
  fileUrl: string;
  width?: string;
  height?: string;
  iconColor?: string;
  scale?: number;
};

export function VisualizadorPdfBase({
  fileUrl,
  width = "100%",
  height = "480px",
  iconColor = "black",
  scale = 1.5,
}: VisualizadorPdfBaseProps) {
  const theme = useTheme();

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  return (
    <Box
      sx={{
        width,
        height,
      }}
    >
      <Stack
        direction="row"
        spacing="16px"
        alignItems="center"
        justifyContent="center"
        padding="16px"
        width="100%"
      >
        <IconButton
          aria-label="botao anterior"
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
        >
          <AnteriorIcon iconColor={iconColor} />
        </IconButton>

        <Typography variant="caption" color={theme.palette.text.primary}>
          Página {pageNumber} de {numPages || "..."}
        </Typography>

        <IconButton
          aria-label="botao proximo"
          disabled={!numPages || pageNumber >= numPages}
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
        >
          <ProximoIcon iconColor={iconColor} />
        </IconButton>
      </Stack>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          overflow: "auto",
          height: `calc(${height} - 64px)`,
          width: "100%",
        }}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setPageNumber(1);
          }}
          loading={<Typography>Carregando documento...</Typography>}
          error={<Typography>Não foi possível carregar o documento.</Typography>}
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            scale={scale}
          />
        </Document>
      </Box>
    </Box>
  );
}