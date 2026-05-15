import { Box, Typography, keyframes, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import { VscChevronDown, VscChevronRight, VscLightbulb, VscLoading } from 'react-icons/vsc';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

interface ThoughtBlockProps {
  thought: string;
  isComplete: boolean;
  forceExpand?: boolean;
}

export default function ThoughtBlock({
  thought,
  isComplete,
  forceExpand = false,
}: ThoughtBlockProps) {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(forceExpand);
  const hasThoughts = thought.trim().length > 0;

  // If forceExpand changes (e.g. from AIAssistant), update local state
  useEffect(() => {
    if (forceExpand) {
      setIsExpanded(true);
    }
  }, [forceExpand]);

  return (
    <Box
      sx={{
        alignSelf: 'flex-start',
        bgcolor: 'background.default',
        borderRadius: 2,
        borderLeft: 3,
        borderColor: 'divider',
        maxWidth: '85%',
        width: 'auto',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        mb: 0.5,
      }}
    >
      <Box
        onClick={() => hasThoughts && setIsExpanded(!isExpanded)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 1,
          cursor: hasThoughts ? 'pointer' : 'default',
          userSelect: 'none',
          minWidth: 120,
          '&:hover': { bgcolor: hasThoughts ? 'action.hover' : 'transparent' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            animation: isComplete ? 'none' : `${spin} 2s linear infinite`,
            color: 'text.secondary',
          }}
        >
          {isComplete ? <VscLightbulb fontSize={14} /> : <VscLoading fontSize={14} />}
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.65rem',
            flexGrow: 1,
          }}
        >
          {isComplete ? 'Thought' : 'Thinking...'}
        </Typography>
        {hasThoughts && (
          <Box
            sx={{
              display: 'flex',
              color: 'text.secondary',
              ml: 1,
            }}
          >
            {isExpanded ? <VscChevronDown fontSize={14} /> : <VscChevronRight fontSize={14} />}
          </Box>
        )}
      </Box>
      {isExpanded && hasThoughts && (
        <Box sx={{ px: 1.5, pb: 1, pt: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              whiteSpace: 'pre-wrap',
              fontSize: '0.75rem',
              lineHeight: 1.5,
              fontStyle: 'italic',
            }}
          >
            {thought}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
