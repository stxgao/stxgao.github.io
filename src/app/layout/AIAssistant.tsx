import {
  Box,
  Typography,
  TextField,
  IconButton,
  useTheme,
  Button,
  LinearProgress,
  Tooltip,
  Stack,
  styled,
  keyframes,
  Chip,
} from '@mui/material';
import { VscSend, VscTrash, VscCloudDownload, VscDebugStop, VscChatSparkle } from 'react-icons/vsc';
import { useState, useRef, useEffect, useMemo } from 'react';
import ChatMessageBubble from '../components/ChatMessageBubble';
import ThoughtBlock from '../components/ThoughtBlock';
import AIProvisionCard from '../components/AIProvisionCard';
import { useAIStore } from '../store/useAIStore';
import { useAppStore } from '../store/useAppStore';
import { SUGGESTED_QUESTIONS } from '../constants/ai';
import { parseMessageThoughts } from '../utils/ai';
import README from '../../../README.md?raw';

export default function AIAssistant() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  const {
    messages,
    aiStatus,
    isThinking,
    isGenerating,
    downloadProgress,
    initAI,
    handleSend,
    handleStop,
    handleDownload,
    clearChat,
  } = useAIStore();

  const { pageContents, isMobile } = useAppStore();

  // Aggregate all preloaded markdown content to provide as context in XML format
  const portfolioContext = useMemo(
    () =>
      [
        `<document name="home.md">\nCONTENT:\nName: Steven Gao\nTitle: Software Engineer, UI/UX 📍 San Francisco\nLinks: GitHub (https://github.com/stxgao), LinkedIn (https://www.linkedin.com/in/stxgao/), Email (steven@stevengao.dev), Resume (steven_gao_resume.pdf)\n</document>`,
        ...Object.entries(pageContents).map(
          ([name, content]) => `<document name="${name}">\nCONTENT:\n${content}\n</document>`,
        ),
        `<document name="README.md">\nCONTENT:\n${README}\n</document>`,
      ].join('\n\n'),
    [pageContents],
  );

  useEffect(() => {
    initAI(isMobile);
  }, [initAI, isMobile]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    // Check if user is within 100px of the bottom
    const atBottom = scrollHeight - scrollTop - clientHeight < 100;
    isAtBottomRef.current = atBottom;
  };

  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToBottom(isGenerating || isThinking ? 'auto' : 'smooth');
    }
  }, [messages, isGenerating, isThinking, aiStatus, downloadProgress]);

  const onSend = () => {
    if (isGenerating) {
      handleStop();
    } else if (input.trim()) {
      isAtBottomRef.current = true; // Force scroll to bottom when user sends a message
      handleSend(input, portfolioContext);
      setInput('');
    }
  };

  const handleSuggestedQuestion = (q: string) => {
    if (isGenerating || aiStatus !== 'available') return;
    isAtBottomRef.current = true;
    handleSend(q, portfolioContext);
  };

  const onExport = () => {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `chat-history-${new Date().toISOString()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1, minHeight: 0 }}
    >
      {/* Panel Header Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: theme.layout.tabHeight,
          pl: 3,
          pr: 1,
          flexShrink: 0,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 600, letterSpacing: '0.05em' }}
        >
          AI ASSISTANT
        </Typography>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Export Chat" arrow>
            <span>
              <IconButton
                size="small"
                onClick={onExport}
                disabled={messages.length <= 1}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' },
                  '&.Mui-disabled': { color: 'text.secondary', opacity: 0.3 },
                }}
              >
                <VscCloudDownload fontSize={18} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Clear Chat" arrow>
            <span>
              <IconButton
                size="small"
                onClick={clearChat}
                disabled={messages.length <= 1}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' },
                  '&.Mui-disabled': { color: 'text.secondary', opacity: 0.3 },
                }}
              >
                <VscTrash fontSize={18} />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Box>

      {/* Chat History */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          ref={scrollContainerRef}
          onScroll={handleScroll}
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            scrollbarGutter: 'stable',
            px: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pb: 2,
          }}
        >
          {messages.map((msg, idx) => {
            const isLastMessage = idx === messages.length - 1;
            const { thought, cleanContent, isComplete } = parseMessageThoughts(
              msg.content,
              msg.role,
              isLastMessage,
            );

            return (
              <Box
                key={msg.id || idx}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {/* 
                  When a thought is present for the assistant, 
                  we render the label ABOVE the thought block.
                */}
                {msg.role === 'assistant' && thought !== null && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block', px: 1 }}
                  >
                    AI Assistant
                  </Typography>
                )}

                {thought !== null && (
                  <ThoughtBlock
                    thought={thought}
                    isComplete={isComplete}
                    forceExpand={isLastMessage && !isComplete}
                  />
                )}

                {cleanContent !== null && (
                  <ChatMessageBubble
                    role={msg.role}
                    content={cleanContent}
                    hideLabel={msg.role === 'assistant' && thought !== null}
                  />
                )}
              </Box>
            );
          })}
          {aiStatus === 'downloading' && (
            <ChatMessageBubble role="assistant">
              <Typography variant="body2" sx={{ mb: 1 }}>
                Downloading Gemini Nano model...
              </Typography>
              <LinearProgress
                variant={downloadProgress > 0 ? 'determinate' : 'indeterminate'}
                value={downloadProgress}
                sx={{ borderRadius: 1 }}
              />
              <Typography
                variant="caption"
                sx={{ mt: 1, display: 'block', textAlign: 'right', color: 'text.secondary' }}
              >
                {downloadProgress > 0 ? `${Math.round(downloadProgress)}%` : 'Starting...'}
              </Typography>
            </ChatMessageBubble>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 20,
            background: `linear-gradient(to bottom, transparent, ${theme.palette.background.paper})`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      </Box>

      {/* Input Area */}
      {aiStatus === 'downloadable' ? (
        <Box sx={{ p: 2, pt: 0, bgcolor: 'background.paper', flexShrink: 0 }}>
          <AIProvisionCard onDownload={() => handleDownload(portfolioContext)} />
        </Box>
      ) : (
        <Box sx={{ p: 2, pt: 0, bgcolor: 'background.paper', flexShrink: 0 }}>
          {messages.length === 1 && aiStatus === 'available' && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <Chip
                  key={idx}
                  label={q}
                  onClick={() => handleSuggestedQuestion(q)}
                  clickable
                  size="small"
                  sx={{
                    bgcolor: 'background.default',
                    color: 'text.secondary',
                    border: 1,
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      color: 'text.primary',
                    },
                  }}
                />
              ))}
            </Box>
          )}
          <TextField
            fullWidth
            size="small"
            multiline
            maxRows={4}
            placeholder={aiStatus === 'available' ? 'Ask me anything...' : 'AI is unavailable'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={aiStatus !== 'available'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={onSend}
                  disabled={(!input.trim() && !isGenerating) || aiStatus !== 'available'}
                  sx={{
                    color: input.trim() || isGenerating ? 'primary.main' : 'text.secondary',
                    '&.Mui-disabled': {
                      color: 'text.secondary',
                      opacity: 0.3,
                    },
                  }}
                >
                  {isGenerating ? <VscDebugStop /> : <VscSend />}
                </IconButton>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                ...theme.typography.body2,
                color: 'text.primary',
                bgcolor: 'background.default',
                borderRadius: 2,
                p: 1.5,
                '& fieldset': {
                  borderColor: 'divider',
                  transition: 'border-color 0.2s ease',
                },
                '&:hover fieldset': {
                  borderColor: 'divider',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: '1px',
                },
                '&.Mui-disabled': {
                  opacity: 0.6,
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'text.secondary',
                opacity: 1,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
