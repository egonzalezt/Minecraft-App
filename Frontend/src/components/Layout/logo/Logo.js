import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ redirectUrl='/',disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === 'dark';

  const logoPath = isDarkTheme ? '/assets/logo.svg' : '/assets/logo-black.svg';

  const logo = (
    <Box
      ref={ref}
      component="img"
      src={"/assets/logo.svg"}
      alt="Logo"
      sx={{
        width: 100,
        height: 100,
        cursor: 'pointer',
        filter: `invert(${isDarkTheme ? '100%' : '0%'})`, // Invert colors for dark theme
        ...sx,
      }}
      {...other}
    />
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to={redirectUrl} component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
