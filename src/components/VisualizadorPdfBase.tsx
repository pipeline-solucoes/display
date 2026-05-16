'use client';

import { useState } from "react";
import { Box, IconButton, Stack, styled, Typography, useTheme } from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

export const AnteriorIcon = styled(ArrowCircleLeftIcon, {
  shouldForwardProp: (prop) => prop !== "iconColor",
})<{iconColor?: string;}>(({ iconColor }) => ({
  color: iconColor,
  fontSize: "24px",
}));

export const ProximoIcon = styled(ArrowCircleRightIcon, {
  shouldForwardProp: (prop) => prop !== "iconColor",
})<{iconColor?: string;}>(({ iconColor }) => ({
  color: iconColor,
  fontSize: "24px",
}));


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export type VisualizadorPdfBaseProps = {
  fileUrl: string;
  width?: string;
  height?: string;
  iconColor?: string;
};

export function VisualizadorPdfBase({ 
  fileUrl, 
  width = '100%', 
  height = "480px", 
  iconColor = "black" }: VisualizadorPdfBaseProps) {

  const theme = useTheme();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  return (
    <Box
      sx={{
        width: width,
        height: height,       
      }}
    >
      <Stack
        direction="row"
        spacing="16px"
        alignItems="center"
        justifyContent="center"
        padding="16px"   
        width = "100%"
      >        
        <IconButton 
          aria-label="botao anterior" 
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((prev) => prev - 1)}>
          <AnteriorIcon iconColor={iconColor}/>
        </IconButton>

        <Typography variant="caption" color={theme.palette.text.primary}>
          Página {pageNumber} de {numPages || "..."}
        </Typography>

        <IconButton 
          aria-label="botao proximo"
          disabled={pageNumber >= numPages} 
          onClick={() => setPageNumber((prev) => prev + 1)}>
          <ProximoIcon iconColor={iconColor}/>
        </IconButton>       
      </Stack>

      
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          overflow: "auto",
          height: `calc(${height} - 40px)`,
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
            scale={1.5}
          />          
        </Document>
      </Box>
    </Box>
  );
}