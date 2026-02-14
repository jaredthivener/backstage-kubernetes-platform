import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  svg: {
    width: 'auto',
    height: 28,
  },
});

/**
 * Morgan Stanley icon logo for the sidebar (collapsed state).
 * Stylized "MS" monogram in brand colors.
 */
const LogoIcon = () => {
  const classes = useStyles();

  return (
    <svg
      className={classes.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      aria-label="Morgan Stanley"
    >
      <rect width="40" height="40" rx="4" fill="#002F6C" />
      <text
        x="20"
        y="27"
        fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="#FFFFFF"
        textAnchor="middle"
      >
        MS
      </text>
    </svg>
  );
};

export default LogoIcon;
