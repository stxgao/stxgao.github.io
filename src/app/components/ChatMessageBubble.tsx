import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatMessageBubbleProps {
  role: 'user' | 'assistant';
  content?: string;
  children?: React.ReactNode;
  hideLabel?: boolean;
}

export default function ChatMessageBubble({
  role,
  content,
  children,
  hideLabel = false,
}: ChatMessageBubbleProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
        maxWidth: '85%',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
      }}
      aria-label={`${role === 'user' ? 'User' : 'Assistant'} message`}
    >
      {!hideLabel && (
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', px: 1 }}>
          {role === 'user' ? 'You' : 'AI Assistant'}
        </Typography>
      )}
      <Box
        sx={{
          bgcolor: role === 'user' ? 'action.selected' : 'background.default',
          color: 'text.primary',
          p: 1.5,
          borderRadius: 2,
          width: 'fit-content',
          ml: role === 'assistant' ? 0 : 'auto',
        }}
      >
        {content ? <MarkdownRenderer content={content} variant="compact" /> : children}
      </Box>
    </Box>
  );
}
