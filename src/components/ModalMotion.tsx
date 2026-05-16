'use client';

import { ReactNode, useEffect } from 'react';
import { Backdrop, Box, CSSObject, IconButton, styled, TypographyVariant, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import { fbbackground, fbborderRadius, fbboxShadow, fbcolor, fbpadding } from '@/constant';
import { PipelineSolucoesTypographyTokens } from '@pipelinesolucoes/theme';

export const BoxTitulo = styled(Box, {
  shouldForwardProp: (prop) => !["variant", "color", "align", 'padding'].includes(prop as string),
 }
)<{typo?: CSSObject | PipelineSolucoesTypographyTokens; color: string; align: string; padding: string; }>
(({ theme, typo, color, align, padding} ) => ({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  justifyItems: align,
  minHeight: 40,
  padding: padding,
  gap: '16px',
  color: color,
  ...(typo ?? {}),
}));

export const CloseIconStyled = styled(CloseIcon, {
  shouldForwardProp: (prop) => prop !== "iconColor",
})<{iconColor?: string;}>(({ iconColor }) => ({
  color: iconColor,
  fontSize: "24px",
}));

interface ModalMotionProps {  
  width?: string | number;
  height?: string | number;
  
  backgroundColor?: string;
  backgroundImage?: string;

  boxShadow?: string; 
  borderRadius?: string;
    
  titulo?: string;
  variantTitulo?: TypographyVariant;
  colorTitulo?: string;
  alignTitulo?: string;  
  paddingTitulo?: string;

  iconCloseColor?: string; 
  
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  open: boolean;
  onClose: () => void;  

  children: ReactNode;
}

/**
 * Modal com animação de entrada/saída utilizando Framer Motion e integração
 * com tokens do Design System Pipeline Soluções.
 *
 * Principais funcionalidades:
 * - Exibição controlada via prop `open`
 * - Fechamento por botão, tecla ESC e clique no backdrop
 * - Animação de abertura e fechamento com Framer Motion
 * - Suporte a imagem de fundo
 * - Customização visual via props e tokens do theme
 * - Responsividade integrada com Material UI
 * - Integração com tipografia do Material UI e Design System Pipeline
 *
 *
 * @param {boolean} open
 * Controla a visibilidade do modal.
 *
 * @param {() => void} onClose
 * Callback executado ao solicitar o fechamento do modal.
 *
 * @param {import('react').ReactNode} children
 * Conteúdo renderizado dentro do modal.
 *
 * @param {string | number} [width]
 * Largura do modal.
 *
 * Comportamento responsivo:
 * - `xs`: `calc(100% - 32px)`
 * - `sm`: `360px`
 * - `md+`: valor informado na prop ou fallback interno
 *
 * @param {string | number} [height]
 * Altura do modal.
 *
 * @param {string} [backgroundColor]
 * Cor de fundo do container principal.
 *
 * Ordem:
 * `backgroundColor`
 * → `theme.pipelinesolucoes.display.modal.background`
 * → `fbbackground`
 *
 * @param {string} [backgroundImage="None"]
 * URL da imagem de fundo aplicada ao modal.
 *
 * Quando informada:
 * - aplica `background-image`
 * - utiliza `background-size: contain`
 * - centraliza a imagem
 * - evita repetição
 *
 * @param {string} [boxShadow]
 * Sombra aplicada ao modal.
 *
 * Ordem:
 * `boxShadow`
 * → `theme.pipelinesolucoes.display.modal.boxShadow`
 * → `fbboxShadow`
 *
 * @param {string} [borderRadius]
 * Border radius aplicado ao modal.
 *
 * Ordem:
 * `borderRadius`
 * → `theme.pipelinesolucoes.display.modal.borderRadius`
 * → `fbborderRadius`
 *
 * @param {string} [titulo=""]
 * Texto exibido no cabeçalho do modal.
 *
 * O cabeçalho será renderizado quando:
 * - existir `titulo`
 * - ou `showCloseButton` for `true`
 *
 * @param {import('@mui/material').TypographyVariant} [variantTitulo]
 * Variante tipográfica do título baseada no Material UI.
 *
 * Ordem:
 * `theme.typography[variantTitulo]`
 * → `theme.pipelinesolucoes.display.modal.variantTitulo`
 * → `theme.typography.body1`
 *
 * @param {string} [colorTitulo]
 * Cor do texto do título.
 *
 * Ordem:
 * `colorTitulo`
 * → `theme.pipelinesolucoes.display.modal.colorTitulo`
 * → `fbcolor`
 *
 * @param {string} [alignTitulo="flex-start"]
 * Alinhamento horizontal do conteúdo do cabeçalho.
 *
 * Valor aplicado em:
 * `justifyItems`
 *
 * @param {string} [paddingTitulo]
 * Espaçamento interno da área do título.
 *
 * Ordem:
 * `paddingTitulo`
 * → `theme.pipelinesolucoes.display.modal.paddingTitulo`
 * → `"8px 0 16px 0"`
 *
 * @param {string} [iconCloseColor]
 * Cor do ícone de fechamento.
 *
 * Ordem:
 * `iconCloseColor`
 * → `theme.pipelinesolucoes.display.modal.iconCloseColor`
 * → `fbcolor`
 *
 * @param {boolean} [closeOnBackdrop=false]
 * Define se o modal deve ser fechado ao clicar no backdrop.
 *
 * @param {boolean} [closeOnEsc=true]
 * Define se o modal deve ser fechado ao pressionar a tecla `ESC`.
 *
 * O listener é registrado apenas quando:
 * - `open === true`
 * - `closeOnEsc === true`
 *
 * @param {boolean} [showCloseButton=true]
 * Controla a exibição do botão de fechamento no cabeçalho.
 *
 * ─────────────────────────────────────────────
 * Estilo / Aparência
 * ─────────────────────────────────────────────
 *
 * - Utiliza `Backdrop` do Material UI
 * - Animações com `AnimatePresence` e `motion.div`
 * - Layout interno baseado em Flexbox
 * - Suporte a imagem de fundo
 * - Scroll automático quando conteúdo excede altura máxima
 * - Altura máxima configurada em `90vh`
 *
 * ─────────────────────────────────────────────
 * Eventos
 * ─────────────────────────────────────────────
 *
 * Fechamento suportado por:
 * - botão de fechar
 * - tecla ESC
 * - clique no backdrop
 *
 * Todos os fluxos utilizam a callback `onClose`.
 *
 * ─────────────────────────────────────────────
 * Exemplo básico
 * ─────────────────────────────────────────────
 *
 * @example
 * ```tsx
 * <ModalMotion
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   titulo="Detalhes do usuário"
 *   width={500}
 * >
 *   <div>Conteúdo do modal</div>
 * </ModalMotion>
 * ```
 *
 * ─────────────────────────────────────────────
 * Exemplo com customização visual
 * ─────────────────────────────────────────────
 *
 * @example
 * ```tsx
 * <ModalMotion
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   titulo="Confirmação"
 *   variantTitulo="h6"
 *   backgroundColor="#FFFFFF"
 *   borderRadius="24px"
 *   boxShadow="0 8px 24px rgba(0,0,0,0.2)"
 *   iconCloseColor="#D32F2F"
 *   closeOnBackdrop
 * >
 *   <div>Deseja continuar?</div>
 * </ModalMotion>
 * ```
 *
 * ─────────────────────────────────────────────
 * Exemplo de configuração no theme Pipeline
 * ─────────────────────────────────────────────
 *
 * @example
 * ```ts
 * pipelinesolucoes: {
 *   display: {
 *     modal: {
 *       background: '#FFFFFF',
 *       borderRadius: '20px',
 *       boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
 *       colorTitulo: '#1F1F1F',
 *       iconCloseColor: '#5F6368',
 *       paddingTitulo: '8px 0 24px 0',
 *       variantTitulo: theme.typography.h6,
 *     }
 *   }
 * }
 * ```
 */

export default function ModalMotion({
  open,
  onClose,
  children,
  width,
  height,
  titulo = '',
  variantTitulo,
  colorTitulo,
  alignTitulo = "flex-start",
  paddingTitulo,
  closeOnBackdrop = false,
  closeOnEsc = true,
  showCloseButton = true,
  backgroundColor,
  boxShadow,
  iconCloseColor,
  backgroundImage = "None",
  borderRadius,
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

  const theme = useTheme();

  // props -> tokens -> fallback
  const modal = theme.pipelinesolucoes?.display?.modal;

  const bg = backgroundColor ?? modal?.background ?? fbbackground;    
  const br = borderRadius ?? modal?.borderRadius ?? fbborderRadius;
  const bs = boxShadow ?? modal?.boxShadow ?? fbboxShadow;

  const iconColor = iconCloseColor ?? modal?.iconCloseColor ?? fbcolor;
  
  const typoTitulo =
    (variantTitulo && theme.typography[variantTitulo]) ??
    modal?.variantTitulo ??
    theme.typography.body1;
  const pd = paddingTitulo ?? modal?.paddingTitulo ?? "8px 0 16px 0";  
  const ct = colorTitulo ?? modal?.colorTitulo ?? fbcolor;

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
                bgcolor: bg,
                backgroundImage: backgroundImage && backgroundImage !== "None"
                  ? `url(${backgroundImage})`
                  : "none",
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',   
                borderRadius: br,
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
                boxShadow: bs,
              }}
            >
              {(titulo || showCloseButton) && (
                <BoxTitulo typo={typoTitulo} color={ct} align={alignTitulo} padding={pd}>
                  <div>{titulo}</div>
                  {showCloseButton && (
                    <IconButton onClick={onClose} aria-label="Fechar modal">
                      <CloseIconStyled iconColor={iconColor}/>
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