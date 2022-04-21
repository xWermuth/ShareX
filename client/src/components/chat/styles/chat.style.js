export const chatStyles = (
  theme,
  drawerWidth,
  drawerPeak,
  drawerPeakWidth
) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  root: {
    paddingTop: 80,
    display: "flex",
    backgroundColor: "rgb(246,247,249)",
  },

  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    transition: "all 0.5s",
    webkitTransition: "all 0.25s",
    whiteSpace: "nowrap",
    boxShadow:
      "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
  },
  drawerOpen: {
    transition: "all 0.5s",
    webkitTransition: "all 0.25s",

    transform: `translate(${0}px)`,
  },
  drawerClose: {
    transition: "all 0.5s",
    webkitTransition: "all 0.25s",

    overflowX: "hidden",

    transform: `translate(${drawerPeak}px)`,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",

    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  icon: {
    color: "#ffffff",

    // width: theme.spacing(4),
    // height: theme.spacing(4),
  },
  padding18: { padding: 18 },
  exitIcon: {
    color: "#ffffff",
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  appbar: {
    backgroundColor: "rgb(26,45,61)",
  },
  removeBorder: { border: "0px solid" },
  groupTL: {
    boxSizing: "border-box",
    display: "flex",
    flex: "1 1",
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
    alignItems: "center",
  },
  tool: {
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  mediaRoot: {
    minHeight: 1,
    flex: "1 1",
    display: "flex",
    flexDirection: "row",
  },
  friendList: {
    maxWidth: drawerPeakWidth,
    minHeight: 1,
    flex: "1 1",
    position: "relative",
    overflowY: "auto",
    paddingBottom: ".8rem",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    overflowAnchor: "none",
    touchAction: "auto",
  },
  chatWindow: {
    width: "100%",
    zIndex: 10,
    position: "relative",
    paddingBottom: "6.4rem",
    display: "flex",
    flex: "1 1",
    flexDirection: "column",
    background: "#f6f7f9",
    overflowY: "scroll",
  },
  railX: {
    width: 0,
    height: 15,
    left: 0,
    bottom: 0,
    zIndex: 99,
    display: "none",
    opacity: 0,
  },
  RailY: {
    top: 0,
    right: 0,
    height: 356,
    width: 15,
    zIndex: 99,
    display: "block",
    background: "transparent",
  },
  iconList: {
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
  },
  inputWrapper: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    paddingBottom: "1.6rem",
    paddingLeft: ".8rem",
    paddingRight: ".8rem",
  },
  input: {
    boxSizing: "border-box",
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatWrapper: {
    height: "100%",
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    flex: "1 1",
    overflowY: "auto",
    overflowAnchor: "none",
  },
  chatContainer: {
    width: "100%",
    height: "100%",
  },
  centerSpinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
