import { useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SendIcon from '@material-ui/icons/Send';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import CodeIcon from '@material-ui/icons/Code';
import HighlightIcon from '@material-ui/icons/Highlight';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { Header, Page, Content } from '@backstage/core-components';
import { HeaderBannerLogos } from '../shared/HeaderBannerLogos';
import { demoClusters } from '../../data/demoData';

const useStyles = makeStyles(theme => ({
  heroBanner: {
    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 40%, #43A047 100%)',
    borderRadius: 16,
    padding: theme.spacing(3.5, 4),
    color: '#fff',
    marginBottom: theme.spacing(3),
    position: 'relative' as const,
    overflow: 'hidden',
  },
  heroPattern: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    width: '38%',
    opacity: 0.06,
    background:
      'repeating-linear-gradient(45deg, #fff 0px, #fff 2px, transparent 2px, transparent 16px)',
  },
  formCard: {
    borderRadius: 12,
  },
  docsCard: {
    borderRadius: 12,
    height: '100%',
  },
  docsLinkButton: {
    justifyContent: 'space-between',
    marginTop: theme.spacing(1.5),
  },
  formRow: {
    marginBottom: theme.spacing(2),
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(3),
  },
  successText: {
    color: '#4CAF50',
    fontWeight: 600,
  },
  fileInput: {
    display: 'none',
  },
}));

export const NewSupportRequestPage = () => {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [requestType, setRequestType] = useState('kubernetes');
  const [priority, setPriority] = useState('medium');
  const [csp, setCsp] = useState('azure');
  const [cluster, setCluster] = useState('prod-trading-aks');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const descriptionInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const cspClusters = useMemo(
    () => demoClusters.filter(item => item.csp === csp),
    [csp],
  );

  useEffect(() => {
    if (!cspClusters.find(item => item.name === cluster)) {
      setCluster(cspClusters[0]?.name ?? '');
    }
  }, [cluster, cspClusters]);

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
    if (selectedFiles.length === 0) {
      return;
    }
    setAttachments(prev => [...prev, ...selectedFiles]);
    event.target.value = '';
  };

  const formatDescription = (format: 'bold' | 'highlight' | 'code' | 'bullets') => {
    const input = descriptionInputRef.current;
    const start = input?.selectionStart ?? description.length;
    const end = input?.selectionEnd ?? description.length;
    const selected = description.slice(start, end);

    let formatted = selected;

    if (format === 'bold') {
      formatted = `**${selected || 'bold text'}**`;
    } else if (format === 'highlight') {
      formatted = `<mark>${selected || 'highlighted text'}</mark>`;
    } else if (format === 'code') {
      const codeValue = selected || 'code snippet';
      formatted = codeValue.includes('\n') ? `\`\`\`\n${codeValue}\n\`\`\`` : `\`${codeValue}\``;
    } else if (format === 'bullets') {
      if (selected) {
        formatted = selected
          .split('\n')
          .map(line => {
            const trimmed = line.trim();
            if (!trimmed) {
              return '- ';
            }
            return trimmed.startsWith('- ') ? line : `- ${line}`;
          })
          .join('\n');
      } else {
        formatted = '- item 1\n- item 2';
      }
    }

    const next = `${description.slice(0, start)}${formatted}${description.slice(end)}`;
    setDescription(next);

    requestAnimationFrame(() => {
      if (!descriptionInputRef.current) {
        return;
      }
      const cursor = start + formatted.length;
      descriptionInputRef.current.focus();
      descriptionInputRef.current.setSelectionRange(cursor, cursor);
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <Page themeId="home">
      <Header
        title={<span style={{ opacity: 0, userSelect: 'none' }}>New Support Request</span>}
        subtitle={<HeaderBannerLogos layout="support" />}
      />
      <Content>
        <Box className={classes.heroBanner}>
          <Box className={classes.heroPattern} />
          <Box position="relative" zIndex={1}>
            <Typography variant="h5" style={{ fontWeight: 700, marginBottom: 6 }}>
              Submit New Request
            </Typography>
            <Typography variant="body2" style={{ opacity: 0.9, maxWidth: 720 }}>
              Open a support ticket for cluster issues, service mesh incidents, or urgent escalations.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card className={classes.formCard}>
              <CardContent>
                <Box mb={2}>
                  <Button
                    component={RouterLink}
                    to="/support"
                    startIcon={<ArrowBackIcon />}
                    size="small"
                  >
                    Back to Support
                  </Button>
                </Box>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.formRow}>
                      <TextField
                        fullWidth
                        label="Request Title"
                        variant="outlined"
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={3} className={classes.formRow}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={requestType}
                          onChange={event => setRequestType(event.target.value as string)}
                          label="Type"
                        >
                          <MenuItem value="kubernetes">Kubernetes</MenuItem>
                          <MenuItem value="service-mesh">Service Mesh</MenuItem>
                          <MenuItem value="escalation">Escalation</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3} className={classes.formRow}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Priority</InputLabel>
                        <Select
                          value={priority}
                          onChange={event => setPriority(event.target.value as string)}
                          label="Priority"
                        >
                          <MenuItem value="high">High</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="low">Low</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3} className={classes.formRow}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>CSP</InputLabel>
                        <Select
                          value={csp}
                          onChange={event => setCsp(event.target.value as string)}
                          label="CSP"
                        >
                          <MenuItem value="azure">Azure</MenuItem>
                          <MenuItem value="aws">AWS</MenuItem>
                          <MenuItem value="gcp">GCP</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3} className={classes.formRow}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Cluster</InputLabel>
                        <Select
                          value={cluster}
                          onChange={event => setCluster(event.target.value as string)}
                          label="Cluster"
                        >
                          {cspClusters.map(item => (
                            <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} className={classes.formRow}>
                      <Typography variant="caption" color="textSecondary" style={{ display: 'block', marginBottom: 6 }}>
                        Description Formatting
                      </Typography>
                      <Box className={classes.toolbar}>
                        <Tooltip title="Bold">
                          <IconButton size="small" onClick={() => formatDescription('bold')} aria-label="Bold text">
                            <FormatBoldIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Highlight">
                          <IconButton size="small" onClick={() => formatDescription('highlight')} aria-label="Highlight text">
                            <HighlightIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Code snippet">
                          <IconButton size="small" onClick={() => formatDescription('code')} aria-label="Insert code snippet">
                            <CodeIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Bullet list">
                          <IconButton size="small" onClick={() => formatDescription('bullets')} aria-label="Insert bullet list">
                            <FormatListBulletedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        minRows={5}
                        label="Description"
                        variant="outlined"
                        value={description}
                        inputRef={descriptionInputRef}
                        onChange={event => setDescription(event.target.value)}
                        helperText="Use the toolbar to apply bold, highlight, code snippets, and bullet lists."
                        required
                      />

                      <Box mt={1.5}>
                        <input
                          accept="*"
                          className={classes.fileInput}
                          id="support-request-attachments"
                          multiple
                          type="file"
                          onChange={handleAttachmentChange}
                        />
                        <label htmlFor="support-request-attachments">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<AttachFileIcon />}
                          >
                            Attach Files
                          </Button>
                        </label>
                        {attachments.length > 0 && (
                          <Box mt={1}>
                            <Typography variant="caption" color="textSecondary" style={{ display: 'block', marginBottom: 4 }}>
                              Attached files ({attachments.length})
                            </Typography>
                            {attachments.map((file, index) => (
                              <Typography key={`${file.name}-${index}`} variant="caption" style={{ display: 'block' }}>
                                • {file.name}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  <Box className={classes.actions}>
                    <Typography variant="body2" color="textSecondary">
                      This demo form simulates request creation in the support workflow.
                    </Typography>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SendIcon />}
                    >
                      Submit Request
                    </Button>
                  </Box>
                </form>

                {submitted && (
                  <Box mt={2}>
                    <Typography className={classes.successText}>
                      Request submitted successfully.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className={classes.docsCard}>
              <CardContent>
                <Typography variant="h6" style={{ fontWeight: 600 }}>
                  Documentation
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: 6 }}>
                  Quick links for common request guidance.
                </Typography>

                <Button
                  component={RouterLink}
                  to="/docs"
                  variant="outlined"
                  fullWidth
                  className={classes.docsLinkButton}
                  endIcon={<OpenInNewIcon />}
                >
                  FAQ
                </Button>

                <Button
                  component={RouterLink}
                  to="/docs/articles/etcd-troubleshooting"
                  variant="outlined"
                  fullWidth
                  className={classes.docsLinkButton}
                  endIcon={<OpenInNewIcon />}
                >
                  Known Issues
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
