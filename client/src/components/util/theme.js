export default {
  palette: {
    primary: {
      light: "#33c9dc",
      main: "#0095F6",
      dark: "#2D3748 !important",
      darkFade: "rgba(45, 55, 72, 0.2) !important",
      contrastText: "#fff",
      icon: "#EDF2F7",
      default: "#000000",
      colorTextPrimary: "#262626",
      gradient: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    },
    secondary: {
      light: "#E2E8F0",
      main: "#ff3d00",
      dark: "#FF0000",
      contrastText: "#fff",
      default: "#000000",
    },
  },
  spreadThis: {
    typography: {
      useNextVariants: true,
    },
    form: { textAlign: "center" },
    image: { margin: "20px auto 20px auto" },
    pageTitle: { margin: "15px auto 15px auto" },
    button: { marginTop: 20, position: "relative" },
    textField: { margin: "10px auto 10px auto" },
    customError: { color: "red", fontSize: "0.8rem", marginTop: "10px" },
    progress: { position: "absolute" },
    invisibleSeperator: { border: "none", margin: 4 },
    visibleSeperator: {
      width: "100%",
      borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
      marginBottom: 10,
      marginTop: 10,
    },
  },
  spreadCancelButtons: {
    buttonWrapper: {
      position: "relative",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-end",
    },
    cancelButton: {
      marginRight: 10,
      color: "#5F5F5F",
      fontWeight: 500,
    },
  },
  spreadProfile: {
    paper: {
      padding: 20,
      width: "100%",
    },
    profile: {
      "& .image-wrapper": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        "& button": {
          position: "absolute",
          top: "80%",
          left: "70%",
        },
      },
      "& .profile-image": {
        width: 200,
        height: 200,
        objectFit: "cover",
        maxWidth: "100%",
        borderRadius: "50%",
      },
      "& .profile-details": {
        textAlign: "center",
        "& span, svg": {
          verticalAlign: "middle",
        },
        "& a": {
          color: "#00bcd4",
        },
      },
      "& hr": {
        border: "none",
        margin: "0 0 10px 0",
      },
      "& svg.button": {
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
    buttons: {
      textAlign: "center",
      "& a": {
        margin: "20px 10px",
      },
    },
  },
  fonts: {
    fontWeight700: {
      fontWeight: 700,
    },
    fontWeight400: {
      fontWeight: 400,
    },
    fontSize20: {
      fontSize: 20,
    },
  },
  paddings: {
    p0: {
      padding: 0,
    },
    pr5: {
      paddingRight: 5,
    },
    pl5: {
      paddingLeft: 5,
    },
  },
  margins: {
    marginRight5: {
      marginRight: 5,
    },
    margins5: {
      margin: 5,
    },
    margins10: {
      margin: 10,
    },
    margins15: {
      margin: 15,
    },
    ml5: {
      marginLeft: 5,
    },
    margins20: {
      margin: 20,
    },
    margins25: {
      margin: 25,
    },
    marginBottom5: {
      marginBottom: 5,
    },
    marginBottom10: {
      marginBottom: 10,
    },
    marginBottom15: {
      marginBottom: 15,
    },
    marginBottom20: {
      marginBottom: 25,
    },
    marginBottom25: {
      marginBottom: 25,
    },
  },
};
