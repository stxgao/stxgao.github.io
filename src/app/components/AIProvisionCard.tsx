import { Box, Typography, Button, useTheme } from '@mui/material';
import { VscChatSparkle, VscSparkle } from 'react-icons/vsc';

interface AIProvisionCardProps {
  onDownload: () => void;
}

/**
 * A specialized card component for provisioning Chrome's Gemini Nano model.
 * Styled to mimic the IDE's input field shell for a seamless transition
 * from setup to chat.
 */
export default function AIProvisionCard({ onDownload }: AIProvisionCardProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        borderRadius: 2,
        p: 2,
        border: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <VscChatSparkle style={{ color: theme.palette.text.primary, fontSize: 18 }} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Provision AI Assistant
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
        Activate Chrome's Built-in Gemini Nano API which will download the base LLM and fine-tuning
        weights (~1.5GB). All inference will execute on your local hardware via the browser.
      </Typography>
      <Button
        variant="contained"
        fullWidth
        disableElevation
        startIcon={<VscSparkle />}
        onClick={onDownload}
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: 2,
          textTransform: 'none',
          py: 1,
          fontWeight: 600,
        }}
      >
        Activate Gemini Nano
      </Button>
    </Box>
  );
}
