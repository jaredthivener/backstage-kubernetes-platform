import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  svg: {
    width: '100%',
    height: 'auto',
    maxHeight: 40,
  },
});

/**
 * Morgan Stanley full logo for the sidebar (expanded state).
 * White text on the dark navy sidebar background.
 */
const LogoFull = () => {
  const classes = useStyles();

  return (
    <svg
      className={classes.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 310 50"
      aria-label="Morgan Stanley - Kubernetes Platform"
    >
      <text
        x="155"
        y="24"
        textAnchor="middle"
        fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
        fontSize="22"
        fontWeight="700"
        fill="#FFFFFF"
        letterSpacing="2"
      >
        MORGAN STANLEY
      </text>
      <text
        x="155"
        y="44"
        textAnchor="middle"
        fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
        fontSize="12"
        fontWeight="500"
        fill="#4DA3E8"
        letterSpacing="2.5"
      >
        KUBERNETES AS A SERVICE
      </text>
    </svg>
  );
};

export default LogoFull;
