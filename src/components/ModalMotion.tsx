'use client';

import { ReactNode, useEffect } from 'react';
import { Backdrop, Box, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

export const BoxTitulo = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  justifyItems: 'flex-start',
  minHeight: 40,
  padding: '8px 0 16px 0',
  gap: '16px',
  color: theme.palette.text.primary,
  ...theme.typography.subtitle1,
}));

export const CloseIconStyled = styled(CloseIcon, {
  shouldForwardProp: (prop) => prop !== "iconColor",
})<{iconColor?: string;}>(({ iconColor }) => ({
  color: iconColor,
  fontSize: "24px",
}));

interface ModalMotionProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string | number;
  height?: string | number;
  titulo?: string;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  backgroundColor: string;
  boxShadow?: string; 
  iconCloseColor?: string;
}

export default function ModalMotion({
  open,
  onClose,
  children,
  width,
  height = 'auto',
  titulo = '',
  closeOnBackdrop = false,
  closeOnEsc = true,
  showCloseButton = true,
  backgroundColor,
  boxShadow = "None",
  iconCloseColor = "black",
}: ModalMotionProps) {

  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, closeOnEsc, onClose]);

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Backdrop
          open={open}
          onClick={handleBackdropClick}
          sx={{
            zIndex: 1300,
            color: '#fff',
            padding: '16px',
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.25 }}
            style={{ width: '100%' }}
          >
            <Box
              display="flex"
              flexDirection="column"
              role="dialog"
              aria-modal="true"
              sx={{
                position: 'relative',
                bgcolor: backgroundColor,
                borderRadius: 2,
                padding: '8px 20px 20px 20px',
                margin: '0 auto',
                width: {
                  xs: 'calc(100% - 32px)',
                  sm: '360px',
                  md: width ?? '360px',
                  lg: width ?? '500px',
                  xl: width ?? '500px',
                },
                height,
                maxHeight: '90vh',
                overflowY: 'auto',                
                boxShadow: boxShadow,
              }}
            >
              {(titulo || showCloseButton) && (
                <BoxTitulo>
                  <Box component="div">{titulo}</Box>

                  {showCloseButton && (
                    <IconButton onClick={onClose} aria-label="Fechar modal">
                      <CloseIconStyled iconColor={iconCloseColor}/>
                    </IconButton>
                  )}
                </BoxTitulo>
              )}

              {children}
            </Box>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}