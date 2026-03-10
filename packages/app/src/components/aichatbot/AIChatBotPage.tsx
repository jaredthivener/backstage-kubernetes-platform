import { useState, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { Header, Page, Content } from '@backstage/core-components';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import GetAppIcon from '@material-ui/icons/GetApp';
import ChatIcon from '@material-ui/icons/Chat';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CloseIcon from '@material-ui/icons/Close';
import { HeaderBannerLogos } from '../shared/HeaderBannerLogos';

const useStyles = makeStyles(theme => ({
  chatCardContent: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    height: 'clamp(460px, calc(100dvh - 190px), 780px)',
    [theme.breakpoints.down('sm')]: {
      height: 'clamp(380px, calc(100dvh - 170px), 620px)',
    },
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: 8,
    marginBottom: theme.spacing(2),
    overflowY: 'auto',
    minHeight: 280,
  },
  messageWrapper: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  message: {
    maxWidth: '70%',
    padding: theme.spacing(1.5, 2),
    borderRadius: 12,
    wordWrap: 'break-word',
  },
  userMessageBubble: {
    backgroundColor: '#1976D2',
    color: '#fff',
  },
  aiMessageBubble: {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
  },
  inputArea: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  inputField: {
    flex: 1,
    '& .MuiOutlinedInput-root': {
      alignItems: 'flex-end',
    },
    '& .MuiOutlinedInput-inputMultiline': {
      overflow: 'auto !important',
    },
  },
  attachedFilesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  attachedFileChip: {
    backgroundColor: theme.palette.primary.light,
    color: '#fff',
  },
  hiddenFileInput: {
    display: 'none',
  },
  quickActionsCard: {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.dark}15 100%)`,
    borderRadius: 12,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  quickActionChip: {
    margin: theme.spacing(0.5),
  },
  capabilitiesCard: {
    borderRadius: 12,
    marginTop: theme.spacing(2),
  },
  capabilityItem: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  capabilityIcon: {
    marginRight: theme.spacing(1.5),
    color: theme.palette.primary.main,
    fontSize: 20,
  },
  emptyStateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    textAlign: 'center',
  },
  emptyStateIcon: {
    fontSize: 64,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    opacity: 0.5,
  },
}));

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AttachedFile {
  name: string;
  size: number;
  type: string;
}

const EXAMPLE_QUERIES = [
  'What clusters do we have running?',
  'Show me high-priority security vulnerabilities',
  'Generate a cost optimization report',
  'Troubleshoot monitoring alerts',
  'What\'s the DORA metrics summary?',
];

const CAPABILITIES = [
  { icon: '📊', title: 'Query Analysis', desc: 'Ask questions about clusters, resources, and configurations' },
  { icon: '📈', title: 'Report Generation', desc: 'Generate cost, security, and performance reports' },
  { icon: '🔧', title: 'Troubleshooting', desc: 'Get guidance on resolving common platform issues' },
  { icon: '🎯', title: 'Recommendations', desc: 'Receive optimization and best practice suggestions' },
  { icon: '🔍', title: 'Cross-Cluster Search', desc: 'Search and compare data across all clusters' },
  { icon: '⚡', title: 'Real-time Insights', desc: 'Get live updates from monitoring and resource dashboards' },
];

export const AIChatBotPage = () => {
  const classes = useStyles();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  const SUPPORTED_FORMATS = ['txt', 'pdf', 'docx', 'xlsx', 'jpg', 'png'];

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const extension = getFileExtension(file.name);
      if (SUPPORTED_FORMATS.includes(extension)) {
        setAttachedFiles(prev => [
          ...prev,
          {
            name: file.name,
            size: file.size,
            type: file.type,
          },
        ]);
      }
    });
    event.currentTarget.value = '';
  };

  const removeAttachedFile = (fileName: string) => {
    setAttachedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.click();
  };

  const handleSendMessage = async (query: string = inputValue) => {
    if (!query.trim() && attachedFiles.length === 0) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query || `Shared ${attachedFiles.length} file(s): ${attachedFiles.map(f => f.name).join(', ')}`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachedFiles([]);
    setIsLoading(true);

    // Simulate AI response with a delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: generateAIResponse(query),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (query: string): string => {
    const queryLower = query.toLowerCase();

    if (queryLower.includes('cluster')) {
      return 'Based on our catalog, you currently have 24 production clusters across AWS, Azure, and GCP. ' +
        'The largest deployment is on AWS with 12 clusters, followed by Azure with 8 clusters, and GCP with 4 clusters. ' +
        'All clusters are running Kubernetes 1.28+ with no pending critical updates.';
    }
    if (queryLower.includes('security') || queryLower.includes('vulnerabil')) {
      return 'Security scan results show 3 medium-priority vulnerabilities and 0 critical issues. ' +
        'Primary concern: 2 pods running outdated container images (CVE-2024-1234). ' +
        'Recommendation: Schedule image updates in the next maintenance window. ' +
        'Network policies are properly configured with 94% compliance rate.';
    }
    if (queryLower.includes('cost') || queryLower.includes('optimization')) {
      return 'Current monthly cloud spend: $487,234 across all CSPs. ' +
        'Cost optimization opportunities identified:\n' +
        '• Right-size node pools: Save ~$12,400/mo\n' +
        '• Reserved instances: Save ~$8,900/mo\n' +
        '• Unused cluster: "staging-us-west-2" unused for 30 days - Save ~$3,200/mo\n' +
        'Total monthly potential savings: $24,500 (5% reduction)';
    }
    if (queryLower.includes('monitoring') || queryLower.includes('alert')) {
      return 'Current monitoring status:\n' +
        '• Active alerts: 2 (both warning level)\n' +
        '• Alert 1: High memory usage on prod-us-east-1 (78%) - Resolution: Auto-scaling job scheduled\n' +
        '• Alert 2: API latency spike on payment service - Cause: Database query optimization in progress\n' +
        'SLA compliance: 99.97% uptime this month\n' +
        'All critical services are operational.';
    }
    if (queryLower.includes('dora')) {
      return 'DORA Metrics Summary (Last 30 days):\n' +
        '📤 Deployment Frequency: 24.5 deployments/day (Excellent)\n' +
        '⏱️  Lead Time: 4.2 hours (Good)\n' +
        '🔄 Mean Time to Recovery: 18 minutes (Good)\n' +
        '🎯 Change Failure Rate: 2.1% (Excellent)\n' +
        'Overall: High-performing team with strong delivery cadence.';
    }

    return 'I understand you\'re asking about: ' + query + '\n\n' +
      'This is a simulated response. The AI Chat Bot is designed to integrate with your Backstage backend to provide real-time insights. ' +
      'In production, this would query:\n' +
      '• Cluster and resource data from your catalog\n' +
      '• Cost and billing information\n' +
      '• Security scanning results\n' +
      '• Monitoring and observability data\n' +
      '• DORA metrics and deployment information\n\n' +
      'Try asking about clusters, security, costs, monitoring, or DORA metrics!';
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleExportReport = () => {
    const reportContent = messages
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent));
    element.setAttribute('download', `ai-chatbot-report-${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Page themeId="home">
      <Header
        title={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <ChatIcon />
            AI Chat Bot
          </span>
        }
        subtitle={
          <HeaderBannerLogos layout="home" text="Intelligent assistant for platform insights, troubleshooting, and reporting" />
        }
      />
      <Content>
        <Grid container spacing={3}>
          {/* Main Chat Area */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent className={classes.chatCardContent}>
                {/* Chat Messages */}
                <Box className={classes.chatContainer}>
                  {messages.length === 0 ? (
                    <Box className={classes.emptyStateContainer}>
                      <ChatIcon className={classes.emptyStateIcon} />
                      <Typography variant="h6" style={{ marginBottom: 8 }}>
                        Start a Conversation
                      </Typography>
                      <Typography variant="body2" color="textSecondary" style={{ marginBottom: 24 }}>
                        Ask me anything about your Kubernetes platform
                      </Typography>
                      <Box display="grid" gridTemplateColumns="1fr 1fr" gridGap={8}>
                        {EXAMPLE_QUERIES.slice(0, 4).map(query => (
                          <Button
                            key={query}
                            variant="outlined"
                            size="small"
                            onClick={() => handleSendMessage(query)}
                            style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                          >
                            {query}
                          </Button>
                        ))}
                      </Box>
                    </Box>
                  ) : (
                    messages.map(msg => (
                      <Box
                        key={msg.id}
                        className={`${classes.messageWrapper} ${
                          msg.role === 'user' ? classes.userMessage : classes.aiMessage
                        }`}
                      >
                        <Paper
                          className={`${classes.message} ${
                            msg.role === 'user' ? classes.userMessageBubble : classes.aiMessageBubble
                          }`}
                        >
                          <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                            {msg.content}
                          </Typography>
                          <Typography variant="caption" style={{ opacity: 0.6, marginTop: 4, display: 'block' }}>
                            {msg.timestamp.toLocaleTimeString()}
                          </Typography>
                        </Paper>
                      </Box>
                    ))
                  )}
                  {isLoading && (
                    <Box className={`${classes.messageWrapper} ${classes.aiMessage}`}>
                      <Paper className={`${classes.message} ${classes.aiMessageBubble}`}>
                        <Typography variant="body2">Thinking...</Typography>
                      </Paper>
                    </Box>
                  )}
                </Box>

                <Divider />

                {/* Input Area */}
                <Box style={{ padding: 16 }}>
                  <input
                    id="file-input"
                    type="file"
                    className={classes.hiddenFileInput}
                    multiple
                    accept=".txt,.pdf,.docx,.xlsx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                  />
                  {attachedFiles.length > 0 && (
                    <Box className={classes.attachedFilesContainer}>
                      {attachedFiles.map(file => (
                        <Chip
                          key={file.name}
                          label={file.name}
                          className={classes.attachedFileChip}
                          size="small"
                          onDelete={() => removeAttachedFile(file.name)}
                          deleteIcon={<CloseIcon style={{ color: '#fff' }} />}
                        />
                      ))}
                    </Box>
                  )}
                  <Box className={classes.inputArea}>
                    <Tooltip title="Attach file (.txt, .pdf, .docx, .xlsx, .jpg, .png)">
                      <span>
                        <IconButton
                          onClick={triggerFileInput}
                          disabled={isLoading}
                          style={{ alignSelf: 'flex-end' }}
                        >
                          <AttachFileIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <TextField
                      className={classes.inputField}
                      placeholder="Ask me about clusters, security, costs, monitoring..."
                      multiline
                      minRows={1}
                      maxRows={6}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={isLoading}
                      variant="outlined"
                    />
                    <Tooltip title="Send message">
                      <span>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSendMessage()}
                          disabled={isLoading || (!inputValue.trim() && attachedFiles.length === 0)}
                          endIcon={<SendIcon />}
                          style={{ alignSelf: 'flex-end' }}
                        >
                          Send
                        </Button>
                      </span>
                    </Tooltip>
                  </Box>
                  {messages.length > 0 && (
                    <Box display="flex" gridGap={8} justifyContent="flex-end">
                      <Tooltip title="Export conversation as report">
                        <IconButton size="small" onClick={handleExportReport}>
                          <GetAppIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Clear chat history">
                        <IconButton size="small" onClick={handleClearChat}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar - Capabilities & Quick Actions */}
          <Grid item xs={12} md={4}>
            {/* Quick Actions */}
            {messages.length === 0 && (
              <Box className={classes.quickActionsCard}>
                <Typography variant="subtitle2" style={{ fontWeight: 600, marginBottom: 12 }}>
                  💡 Quick Questions
                </Typography>
                <Box display="flex" flexWrap="wrap">
                  {EXAMPLE_QUERIES.map(query => (
                    <Chip
                      key={query}
                      label={query}
                      onClick={() => handleSendMessage(query)}
                      className={classes.quickActionChip}
                      size="small"
                      clickable
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Capabilities */}
            <Card className={classes.capabilitiesCard}>
              <CardContent>
                <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 12 }}>
                  ✨ Capabilities
                </Typography>
                {CAPABILITIES.map((cap, idx) => (
                  <Box key={idx} className={classes.capabilityItem}>
                    <span className={classes.capabilityIcon}>{cap.icon}</span>
                    <Box>
                      <Typography variant="subtitle2" style={{ fontWeight: 600 }}>
                        {cap.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {cap.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card style={{ marginTop: 16, borderRadius: 12 }}>
              <CardContent>
                <Typography variant="subtitle2" style={{ fontWeight: 600, marginBottom: 8 }}>
                  🚀 Pro Tips
                </Typography>
                <Typography variant="caption" color="textSecondary" component="div" style={{ lineHeight: 1.6 }}>
                  • Ask specific questions for better answers<br/>
                  • Use natural language - no special syntax needed<br/>
                  • Export conversations as reports<br/>
                  • Ask follow-up questions to drill deeper<br/>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
