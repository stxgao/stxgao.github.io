import {
  Alert,
  AlertColor,
  Box,
  Chip,
  Divider,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ReactElement, useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight, materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme, styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import DOMPurify from 'dompurify';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface MarkdownRendererProps {
  content: string;
  variant?: 'default' | 'compact';
  sanitize?: boolean;
}

export default function MarkdownRenderer({
  content,
  variant = 'default',
  sanitize = false,
}: MarkdownRendererProps) {
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === 'dark';
  const isCompact = variant === 'compact';

  const processedContent = useMemo(() => {
    if (sanitize) {
      return DOMPurify.sanitize(content);
    }
    return content;
  }, [content, sanitize]);

  const components: Components = useMemo(
    () => ({
      a: ({ href, children }) => (
        <Link href={href} target="_blank" underline="hover">
          {children}
        </Link>
      ),
      img: ({ src, alt }) => {
        if (!src) return null;
        const isShieldsBadge = src.includes('shields.io');
        const labelColor = isDarkTheme ? '2f363d' : 'f0f0f0';
        const color = isDarkTheme ? '58a6ff' : '0366d6';
        const logoColor = isDarkTheme ? 'ffffff' : '333333';

        const updatedSrc = isShieldsBadge
          ? src
              .replace('style=social', 'style=flat')
              .concat(`&labelColor=${labelColor}&color=${color}&logo=github&logoColor=${logoColor}`)
          : src;

        return <img src={updatedSrc} alt={alt} style={{ maxWidth: '100%' }} />;
      },
      table: ({ children }) => (
        <TableContainer component={Paper} sx={{ my: 2 }}>
          <Table size="small" aria-label="a dense table">
            {children}
          </Table>
        </TableContainer>
      ),
      th: ({ children, style }) => {
        if (style && style.textAlign === 'right') {
          return <StyledTableCell sx={{ textAlign: 'right' }}>{children}</StyledTableCell>;
        }
        return <StyledTableCell>{children}</StyledTableCell>;
      },
      td: ({ children, style }) => {
        if (style && style.textAlign === 'right') {
          return <StyledTableCell sx={{ textAlign: 'right' }}>{children}</StyledTableCell>;
        }
        return <StyledTableCell>{children}</StyledTableCell>;
      },
      tr: ({ children }) => <StyledTableRow>{children}</StyledTableRow>,
      thead: ({ children }) => <TableHead>{children}</TableHead>,
      tbody: ({ children }) => <TableBody>{children}</TableBody>,
      tfoot: ({ children }) => <TableFooter>{children}</TableFooter>,
      code: (props): ReactElement => {
        const { className, children, ...rest } = props;
        const codeString = String(children).replace(/\n$/, '');
        const match = /language-(\w+)/.exec(className || '');
        const inline = !match;

        if (inline && !className) {
          return (
            <Chip
              component="span"
              size="small"
              label={codeString}
              sx={{
                borderRadius: 1,
                height: 'auto',
                py: 0.2,
                fontSize: isCompact ? '0.75rem' : 'inherit',
                verticalAlign: 'middle',
              }}
            />
          );
        } else if (match) {
          const language = match[1];
          return (
            <SyntaxHighlighter
              language={language}
              style={isDarkTheme ? materialDark : materialLight}
              PreTag="div"
              showLineNumbers={true}
              customStyle={{
                fontSize: isCompact ? '0.75rem' : '0.875rem',
                margin: 0,
                padding: isCompact ? '0.5em' : '1em',
              }}
            >
              {codeString}
            </SyntaxHighlighter>
          );
        } else {
          return (
            <SyntaxHighlighter
              style={isDarkTheme ? materialDark : materialLight}
              PreTag="div"
              customStyle={{
                fontSize: isCompact ? '0.75rem' : '0.875rem',
                margin: 0,
                padding: isCompact ? '0.5em' : '1em',
              }}
            >
              {codeString}
            </SyntaxHighlighter>
          );
        }
      },
      h1: ({ children }) => (
        <>
          <Typography
            variant="h1"
            sx={{
              fontSize: isCompact ? '1.1rem' : '2em',
              display: 'block',
              marginBlockStart: isCompact ? '0.5em' : '0.67em',
              marginBlockEnd: '0.3em',
              fontWeight: 'bold',
              lineHeight: 1.25,
            }}
          >
            {children}
          </Typography>
          <Divider sx={{ mb: isCompact ? 1 : 2 }} />
        </>
      ),
      h2: ({ children }) => (
        <>
          <Typography
            variant="h2"
            sx={{
              fontSize: isCompact ? '1rem' : '1.5em',
              display: 'block',
              marginBlockStart: isCompact ? '0.5em' : '0.83em',
              marginBlockEnd: '0.3em',
              fontWeight: 'bold',
              lineHeight: 1.25,
            }}
          >
            {children}
          </Typography>
          <Divider sx={{ mb: isCompact ? 1 : 2 }} />
        </>
      ),
      blockquote: ({ children }) => (
        <Box
          sx={{
            borderLeft: 3,
            borderColor: 'divider',
            pl: 2,
            my: 1,
            fontStyle: 'italic',
            color: 'text.secondary',
          }}
        >
          <blockquote style={{ margin: 0 }}>{children}</blockquote>
        </Box>
      ),
      p: (props) => {
        const { children } = props;
        const childrenArray = Array.isArray(children) ? children : [children];
        const firstChild = childrenArray[0];

        // Custom alert logic (::: severity message :::)
        const isWarning =
          typeof firstChild === 'string' &&
          firstChild.includes(':::') &&
          childrenArray.slice(-1)[0]?.toString().includes(':::');

        if (isWarning) {
          const severityString = (firstChild as string).split(' ')[1] || 'info';
          const severity: AlertColor = ['error', 'warning', 'info', 'success'].includes(
            severityString,
          )
            ? (severityString as AlertColor)
            : 'info';

          return (
            <Box sx={{ my: 1 }}>
              <Alert severity={severity}>{childrenArray.slice(2, -1)}</Alert>
            </Box>
          );
        }

        /**
         * Check if children contain any block-level elements that shouldn't be inside a <p>.
         * react-markdown often wraps block components (like our custom code/table) in <p>
         * if they are not separated by enough newlines.
         */
        const hasBlockElement = childrenArray.some((child) => {
          if (child && typeof child === 'object' && 'type' in child) {
            const type = (child as any).type;
            // If it's a component or a tag that we know renders a div/table/etc.
            return (
              type === 'code' ||
              type === 'table' ||
              type === 'ul' ||
              type === 'ol' ||
              type === 'div' ||
              type === 'blockquote'
            );
          }
          return false;
        });

        return (
          <Typography
            variant="body1"
            component={hasBlockElement ? 'div' : 'p'}
            sx={{
              m: 0,
              mb: isCompact ? 1 : 2,
              fontSize: isCompact ? '0.875rem' : 'inherit',
              lineHeight: 1.6,
              '&:last-child': { mb: 0 },
            }}
          >
            {children}
          </Typography>
        );
      },
      ul: ({ children }) =>
        isCompact ? (
          <Box component="ul" sx={{ m: 0, mb: 1, pl: 2, fontSize: '0.875rem' }}>
            {children}
          </Box>
        ) : (
          <ul>{children}</ul>
        ),
      ol: ({ children }) =>
        isCompact ? (
          <Box component="ol" sx={{ m: 0, mb: 1, pl: 2, fontSize: '0.875rem' }}>
            {children}
          </Box>
        ) : (
          <ol>{children}</ol>
        ),
      li: ({ children }) => (
        <Box component="li" sx={{ mb: isCompact ? 0.5 : 0 }}>
          {children}
        </Box>
      ),
      hr: () => <Divider sx={{ my: isCompact ? 1 : 2, opacity: isCompact ? 0.5 : 1 }} />,
    }),
    [isDarkTheme, isCompact],
  );

  return (
    <ReactMarkdown
      children={processedContent}
      components={components}
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeRaw]}
    />
  );
}
